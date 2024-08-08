"use server"

import { createServerClientWithCookies } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import z from "zod"
import { createServerActionProcedure } from "zsa"
import calculateElo, { DEFAULT_ELO } from "./utils/elo"
import { resolveInvitation } from "./admin"

const authedProcedure = createServerActionProcedure().handler(async () => {
  const supabase = createServerClientWithCookies()
  const { data } = await supabase.auth.getUser()

  if (!data.user) throw new Error("User not authenticated")

  return { user: data.user }
})

const circleAdminProcedure = createServerActionProcedure(authedProcedure)
  .input(z.object({ circleId: z.number() }))
  .handler(async ({ input, ctx }) => {
    const supabase = createServerClientWithCookies()

    const { data: member } = await supabase
      .from("circle_members")
      .select("*")
      .eq("circle_id", input.circleId)
      .eq("user_id", ctx.user.id)
      .single()

    if (!member) throw new Error("Has no access to this circle")

    // TODO: this returns circle_member, not circle
    return { member, user: ctx.user }
  })

export const addMember = circleAdminProcedure
  .createServerAction()
  .input(
    z.object({
      name: z.string().min(1).max(20),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const supabase = createServerClientWithCookies()

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
    const supabase = createServerClientWithCookies()

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
    const supabase = createServerClientWithCookies()
    const { loserIds, winnerIds } = input
    const { member } = ctx

    const { data: membersStats } = await supabase
      .from("members_stats")
      .select(`*`)
      .eq("circle_id", member.circle_id)

    if (!membersStats) throw new Error("Failed to get members elo")

    const existingEloMap = Object.fromEntries(
      membersStats.map((member) => [member.member_id, member.elo]),
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

    if (!game?.length) throw new Error("Failed to create game")

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
  .onError((error) => console.log(error))
  .handler(async ({ input, ctx }) => {
    const supabase = createServerClientWithCookies()

    const { data: vacantMember } = await supabase
      .from("circle_members")
      .select("*")
      .eq("id", input.memberId)
      .is("user_id", null)
      .single()

    if (!vacantMember) return { error: "Member is already linked to a user" }

    const { error } = await supabase
      .from("member_invitations")
      .insert({
        email: input.email,
        member_id: input.memberId,
        invited_by: ctx.member.id,
      })
      .select()

    if (error) return { error: "failed to invite a member" }

    const [data] = await resolveInvitation({ email: input.email })

    return { success: true, resolved: data?.resolved }
  })
