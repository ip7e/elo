import { GameWithResults } from "@/server/types"
import { createServerClient, createServerClientWithCookies } from "@/utils/supabase/server"
import { createServerAction } from "zsa"
import z from "zod"

import "server-only"
import { authedProcedure } from "./procedures"
export const getCircleBySlug = async (slug: string) => {
  const supabase = createServerClient()
  const { data: circle } = await supabase.from("circles").select("*").eq("slug", slug).single()
  return circle
}

export const getMembers = createServerAction()
  .input(z.object({ circleId: z.number() }))
  .handler(async ({ input }) => {
    const supabase = createServerClient()

    const { data: members } = await supabase
      .from("circle_members")
      .select("*")
      .eq("circle_id", input.circleId)
      .order("created_at", { ascending: true })

    return members
  })

export const getStats = async (circleId: number) => {
  const supabase = createServerClient()
  const { data: stats, error } = await supabase
    .from("members_stats")
    .select("*")
    .eq("circle_id", circleId)
    .order("elo", { ascending: false })

  return stats
}

export const getAllGames = async (circleId: number) => {
  const supabase = createServerClient()
  const { data: recentGames }: { data: GameWithResults[] | null } = await supabase
    .from("games")
    .select("*, game_results(*)")
    .order("created_at", { ascending: false })
    .eq("circle_id", circleId)

  return recentGames
}

export const getCurrentUser = async () => {
  const supabase = createServerClientWithCookies()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export const hasCurrentUserAccessToCircle = async (circleId: number) => {
  const user = await getCurrentUser()
  const supabase = createServerClientWithCookies()

  if (!user) return false

  const { data: circle } = await supabase
    .from("circle_members")
    .select("*")
    .eq("circle_id", circleId)
    .eq("user_id", user.id)
    .single()

  return !!circle
}

export const getMyCircles = authedProcedure.createServerAction().handler(async ({ ctx }) => {
  const supabase = createServerClient()
  const { user } = ctx

  const { data: circles } = await supabase
    .from("circles")
    .select("*, circle_members!inner(*)")
    .eq("circle_members.user_id", user.id)

  return circles
})
