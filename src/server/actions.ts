"use server"

import { revalidatePath } from "next/cache"
import z from "zod"
import { resolveInvitation } from "./admin"
import { authedProcedure, circleAdminProcedure } from "./procedures"
import createSuperClient from "./supabase"
import calculateElo, { DEFAULT_ELO } from "./utils/elo"
import { reservedSlugs } from "./constants"

export const TestAdminProcedure = circleAdminProcedure
  .createServerAction()
  .handler(async () => "test")

export const addMember = circleAdminProcedure
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(1).max(20),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const supabase = createSuperClient()

    const { name } = input

    const { data, error } = await supabase
      .from("circle_members")
      .insert({ circle_id: ctx.member.circle_id, name: name })
      .select("*")
      .single()

    if (!error) {
      revalidatePath("/[circle]", "layout")
      return { data, success: true }
    }

    return { error }
  })

export const kickMember = circleAdminProcedure
  .createServerAction()
  .input(
    z.object({
      id: z.number(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const supabase = createSuperClient()

    const { data, error } = await supabase
      .from("circle_members")
      .delete()
      .eq("id", input.id)
      .neq("id", ctx.member.id)
      .single()

    if (!error) {
      revalidatePath("/[circle]", "layout")
      return { data, success: true }
    }

    return { error }
  })

export const createGameSession = circleAdminProcedure
  .createServerAction()
  .input(
    z.object({
      loserIds: z.array(z.number()),
      winnerIds: z.array(z.number()),
    }),
  )
  .onError((error) => console.log(error))
  .handler(async ({ input, ctx }) => {
    const supabase = createSuperClient()
    const { loserIds, winnerIds } = input
    const { member } = ctx

    const { data: membersStats } = await supabase
      .from("circle_members")
      .select(`*, latest_game:game_results!inner(*)`)
      .eq("circle_id", member.circle_id)
      .order("created_at", { referencedTable: "latest_game", ascending: false })

    if (!membersStats) throw "Failed to get members elo"

    const existingEloMap = Object.fromEntries(
      membersStats.map((member) => [member.id, member.latest_game[0].elo]),
    )
    const winnersMap = Object.fromEntries(winnerIds.map((id) => [id, true]))

    const members = [...loserIds, ...winnerIds].map((id) => ({
      id,
      startElo: existingEloMap[id] || DEFAULT_ELO,
      isWinner: !!winnersMap[id],
      rwr: 0,
      newElo: 0,
      delta: 0,
    }))

    const newElos = calculateElo(
      members.map((member) => ({
        id: member.id,
        startElo: member.startElo,
        isWinner: member.isWinner,
      })),
    )

    const { data: game } = await supabase
      .from("games")
      .insert({ circle_id: member.circle_id })
      .select()

    if (!game?.length) throw "Failed to create game"

    await supabase
      .from("game_results")
      .insert(
        Object.entries(newElos).map(([id, result]) => ({
          member_id: +id,
          game_id: game[0].id,
          winner: winnersMap[id],
          elo: result.elo,
          previous_elo: existingEloMap[id] || DEFAULT_ELO,
        })),
      )
      .select()

    revalidatePath(`/[circle]`, "layout")

    return { success: true, message: "Game session created successfully" }
  })

export const inviteMemberAsOwner = circleAdminProcedure
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      memberId: z.number(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const supabase = createSuperClient()

    const { data: vacantMember } = await supabase
      .from("circle_members")
      .select("*")
      .eq("id", input.memberId)
      .is("user_id", null)
      .single()

    if (!vacantMember) return "Member is already linked to a user"

    const { error } = await supabase
      .from("member_invitations")
      .insert({
        email: input.email,
        member_id: input.memberId,
        invited_by: ctx.member.id,
      })
      .select()

    if (error) throw "failed to invite a member"

    const [data] = await resolveInvitation({ email: input.email })

    return { success: true, resolved: data?.resolved }
  })

export const createCircle = authedProcedure
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(1).max(20),
      slug: z.string().min(1).max(20),
      nickname: z.string().min(1).max(20),
      members: z.string().optional().default(""),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const supabase = createSuperClient()

    const { name, slug, members, nickname } = input

    // reserved slugs
    if (reservedSlugs.includes(slug)) throw `shmelo.io/${slug} is already taken`

    const { data: circles } = await supabase.from("circles").select("*").eq("slug", slug).single()

    if (circles) throw `shmelo.io/${slug} is already taken`

    const { data: circle, error } = await supabase
      .from("circles")
      .insert({ name, slug })
      .select()
      .single()

    if (error) throw "failed to create circle"

    const { error: membersError } = await supabase
      .from("circle_members")
      .insert([
        {
          name: nickname,
          circle_id: circle.id,
          user_id: ctx.user.id,
        },
        ...members
          .split(",")
          .map((m) => m.trim())
          .filter(Boolean)
          .map((member) => ({
            name: member,
            circle_id: circle.id,
          })),
      ])
      .select()

    if (membersError) throw "failed to add circle members"

    revalidatePath("/me")

    return { success: true, circle }
  })

export const editCircle = circleAdminProcedure
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(1).max(20),
      slug: z.string().min(1).max(20),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const supabase = createSuperClient()

    const { name, slug } = input

    if (slug !== ctx.circle?.slug) {
      const { data } = await supabase.from("circles").select("*").eq("slug", slug).single()
      if (data) throw `shmelo.io/${slug} is already taken`
    }

    const { data: circle, error } = await supabase
      .from("circles")
      .update({
        name: name,
        slug: slug,
      })
      .eq("id", ctx.member.circle_id)
      .select()
      .single()

    if (error) {
      console.log(error)
      throw "failed to edit circle"
    }

    return { success: true, circle }
  })

export const deleteCircle = circleAdminProcedure
  .createServerAction()
  .input(
    z.object({
      circleId: z.number(),
      confirmName: z.string(),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const supabase = createSuperClient()
    const { circleId } = input

    const { data, error } = await supabase
      .from("circles")
      .delete()
      .eq("id", circleId)
      .eq("name", input.confirmName)
      .single()

    if (error) {
      console.log(error)
      throw "failed to delete circle"
    }

    revalidatePath("/me", "layout")

    return { success: true }
  })

export const deleteLastGame = circleAdminProcedure
  .createServerAction()
  .input(
    z.object({
      circleId: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    const supabase = createSuperClient()
    const { circleId } = input

    const { data, error } = await supabase
      .from("games")
      .delete()
      .eq("circle_id", circleId)
      .order("id", { ascending: false })
      .limit(1)
      .single()

    if (!error) {
      revalidatePath("/[circle]", "layout")
      return { success: true }
    }

    return { error }
  })

export const renameMember = circleAdminProcedure
  .createServerAction()
  .input(
    z.object({
      id: z.number(),
      name: z.string().min(1).max(20),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const supabase = createSuperClient()

    const { data, error } = await supabase
      .from("circle_members")
      .update({ name: input.name })
      .eq("id", input.id)
      .eq("circle_id", ctx.member.circle_id)
      .select()
      .single()

    if (!error) {
      revalidatePath("/[circle]", "layout")
      return { data, success: true }
    }

    return { error }
  })
