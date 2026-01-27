import { CirclePlan, CirclePlanStatus, GameResult, GameWithResults, MemberStats } from "@/server/types"
import { createServerClient, createServerClientWithCookies } from "@/utils/supabase/server"
import "server-only"
import z from "zod"
import { createServerAction, inferServerActionReturnData } from "zsa"
import { FREE_GAME_LIMIT } from "./constants"
import { authedProcedure } from "./procedures"

export const getCircleBySlug = async (slug: string) => {
  const supabase = createServerClient()
  const { data: circle } = await supabase.from("circles").select("*").eq("slug", slug).single()
  return circle
}

export const getMembersStats = createServerAction()
  .input(z.object({ circleId: z.number() }))
  .handler<Promise<MemberStats[]>>(async ({ input }) => {
    const supabase = createServerClient()

    // Fetch recent games, members, and circle in parallel
    const [recentCircleGamesResult, membersResult, circleResult] = await Promise.all([
      supabase
        .from("games")
        .select("id, game_results(member_id)")
        .eq("circle_id", input.circleId)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("circle_members")
        .select(
          `*,
          games:game_results(count),
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
        .eq("circle_id", input.circleId),
      supabase.from("circles").select("auto_hide_after_games").eq("id", input.circleId).single(),
    ])

    const recentCircleGames = recentCircleGamesResult.data ?? []
    const autoHideAfterGames = circleResult.data?.auto_hide_after_games ?? 20

    return (membersResult.data ?? [])
      .map((v) => {
        const latestGame = v.latest_game?.[0]
        const recentMissedGamesCount = latestGame
          ? recentCircleGames.filter((game) => game.id > latestGame.game_id).length
          : recentCircleGames.length

        const calculateVisibility = () => {
          if (recentCircleGames.length === 0) return true // show all members if no games have been played yet
          if (v.visibility === "always_visible") return true
          if (v.visibility === "always_hidden") return false
          if (!latestGame) return false // hide members who have never played
          return recentMissedGamesCount < autoHideAfterGames
        }

        return {
          ...v,
          name: v.name ?? "",
          total_wins: v.wins?.[0]?.count ?? 0,
          total_games: v.games?.[0]?.count ?? 0,
          elo: latestGame?.elo ?? 0,
          latest_game: latestGame as GameResult,
          first_game: v.first_game?.[0] as GameResult,
          recent_missed_games: recentMissedGamesCount,
          isVisible: calculateVisibility(),
        }
      })
      .sort((a, b) => {
        if (b.elo !== a.elo) return b.elo - a.elo
        if (b.total_wins !== a.total_wins) return b.total_wins - a.total_wins
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      })
  })

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
  const supabase = await createServerClientWithCookies()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export const hasCurrentUserAccessToCircle = async (circleId: number) => {
  const user = await getCurrentUser()
  const supabase = await createServerClientWithCookies()

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

export const getCirclePlan = async (circleId: number): Promise<CirclePlan> => {
  const supabase = createServerClient()

  const [circleResult, gamesCountResult] = await Promise.all([
    supabase.from("circles").select("is_unlocked").eq("id", circleId).single(),
    supabase.from("games").select("id", { count: "exact", head: true }).eq("circle_id", circleId),
  ])

  const isUnlocked = circleResult.data?.is_unlocked ?? false
  const gamesPlayed = gamesCountResult.count ?? 0
  const status: CirclePlanStatus = isUnlocked ? "pro" : gamesPlayed >= FREE_GAME_LIMIT ? "locked" : "trial"

  return {
    status,
    gamesPlayed,
    gamesLeft: isUnlocked ? Infinity : Math.max(0, FREE_GAME_LIMIT - gamesPlayed),
  }
}
