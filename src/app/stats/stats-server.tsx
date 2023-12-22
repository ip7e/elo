import { supabase } from "@/supabase"
import StatsClient from "./stats-client"
import { GameWithGameResults, MemberStatsWithElo } from "./types"

export default async function StatsServer() {
  const { data: leaderBoardRaw } = await supabase
    .from("members_stats")
    .select("*, members_elo(elo, *)")
    .filter("total_games", "gte", 5)

  const { data: recentGames }: { data: GameWithGameResults[] | null } = await supabase
    .from("games")
    .select("*, game_results(*)")
    .order("created_at", { ascending: false })
    .limit(20)

  if (!leaderBoardRaw) return null
  if (!recentGames) return null

  const leaderBoard: MemberStatsWithElo[] = leaderBoardRaw
    .map((member) => {
      const { members_elo, ...rest } = member
      return { ...rest, elo: members_elo!.elo! }
    })
    .sort((a, b) => b.elo - a.elo)

  const recentWinners = recentGames
    .slice(0, 3)
    .map((game) => game.game_results.find((result) => result.winner === true)?.member_id)
    .filter(Boolean) as number[]

  return (
    <StatsClient
      leaderBoard={leaderBoard}
      recentWinners={recentWinners}
      recentGames={recentGames}
    />
  )
}
