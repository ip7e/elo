import { GameResult, GameWithResults } from "@/server/types"
import { createServerClient, createServerClientWithCookies } from "@/utils/supabase/server"
import "server-only"
import z from "zod"
import { createServerAction, inferServerActionReturnData } from "zsa"
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

export const getMembersStatsV2 = createServerAction()
  .input(z.object({ circleId: z.number() }))
  .handler(async ({ input }) => {
    const supabase = createServerClient()

    const { data: response, error } = await supabase
      .from("circle_members")
      .select(
        `*, 
          wins:game_results(count), 
          latest_game:game_results(*), 
          first_game:game_results(*)
        `,
      )
      .order("created_at", { referencedTable: "latest_game", ascending: false })
      .order("created_at", { referencedTable: "first_game", ascending: true })

      .limit(1, { referencedTable: "latest_game" })
      .limit(1, { referencedTable: "first_game" })

      .order("created_at", { ascending: true })
      .eq("wins.winner", true)
      .eq("circle_id", input.circleId)

    return (response ?? [])
      .map((v) => ({
        createdAt: v.created_at!,
        id: v.id!,
        circleId: v.circle_id!,
        name: v.name!,
        userId: v.user_id!,
        firstGameId: v.first_game?.[0]?.game_id,
        latestGameId: v.latest_game?.[0]?.id,
        elo: v.latest_game?.[0]?.elo ?? 0,
        wins: v.wins?.[0]?.count ?? 0,
        isNew: !!v.latest_game?.[0],
      }))
      .sort((a, b) => b.elo - a.elo || b.wins - a.wins || a.name.localeCompare(b.name))
  })

export const getMembersStats = createServerAction()
  .input(z.object({ circleId: z.number() }))
  .handler(async ({ input }) => {
    const supabase = createServerClient()

    const { data: response, error } = await supabase
      .from("circle_members")
      .select(
        `*, 
          wins:game_results(count), 
          latest_game:game_results(*), 
          first_game:game_results(*)
        `,
      )
      .order("created_at", { referencedTable: "latest_game", ascending: false })
      .order("created_at", { referencedTable: "first_game", ascending: true })

      .limit(1, { referencedTable: "latest_game" })
      .limit(1, { referencedTable: "first_game" })

      .order("created_at", { ascending: true })
      .eq("wins.winner", true)
      .eq("circle_id", input.circleId)

    const resp = (response ?? [])
      .map((v) => ({
        ...v,
        latest_game: v.latest_game?.[0] as GameResult,
        first_game: v.first_game?.[0] as GameResult,
      }))
      .sort((a, b) => (b.latest_game?.elo ?? 0) - (a.latest_game?.elo ?? 0))

    return resp
  })
export type MembersWithStats = inferServerActionReturnData<typeof getMembersStats>

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
    .select(
      `*, 
        me:circle_members!inner(*), 
        members:circle_members(
          *,
          latest_game:game_results!inner(*)
        )
      `,
    )
    .order("created_at", { referencedTable: "members.latest_game", ascending: false })
    .eq("me.user_id", user.id)

  if (!circles) return []

  return circles.map((circle) => {
    const myRank = circle.members
      .sort((a, b) => b.latest_game?.[0]?.elo! - a.latest_game?.[0]?.elo!)
      .findIndex((m) => m.id === circle.me[0].id)

    return { ...circle, myRank: myRank === -1 ? undefined : myRank + 1 }
  })
})

export type CircleWithMyRank = inferServerActionReturnData<typeof getMyCircles>
