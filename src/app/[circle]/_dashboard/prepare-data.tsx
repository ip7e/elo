import { MembersWithStats } from "@/server/queries"
import { GameWithResults, Member } from "@/server/types"
import { GameRecord } from "./bump-chart/types"

export function getGameSeries(
  membersWithStats: MembersWithStats,
  games: GameWithResults[],
): GameRecord[][] {
  // Initialize the current state with latest member stats
  const currentMemberStats = new Map(
    membersWithStats
      .filter((m) => m.latest_game)
      .map((m) => [
        m.id,
        {
          elo: m.latest_game?.elo ?? 1100,
          member_id: m.id,
          firstGameId: m.first_game?.game_id,
          won: m.latest_game?.winner ?? false,
        },
      ]),
  )

  // Sort games in reverse chronological order (newest first)
  const sortedGames = [...games].sort((a, b) => b.id - a.id)

  // For each game, we'll store an array of GameRecord for all members
  const gameRecords: GameRecord[][] = []

  // Process each game
  sortedGames.forEach((game) => {
    const participants = new Set(game.game_results.map((r) => r.member_id))
    const records: GameRecord[] = []

    // Update ELOs for participants to their previous values
    game.game_results.forEach((result) => {
      if (currentMemberStats.has(result.member_id)) {
        const stats = currentMemberStats.get(result.member_id)!
        stats.elo = result.elo
        stats.won = result.winner ?? false
      }
    })

    // Create sorted list of all current members by ELO
    const sortedMembers = Array.from(currentMemberStats.entries()).sort(
      (a, b) => b[1].elo - a[1].elo,
    )

    // Create records for this game
    sortedMembers.forEach(([memberId, stats], index) => {
      records.push({
        rank: index,
        elo: stats.elo,
        member: membersWithStats.find((m) => m.id === memberId)!,
        played: participants.has(memberId),
        isFirstGame: stats.firstGameId === game.id,
        won: stats.won,
        id: game.id,
      })

      // Remove member if this was their first game
      if (stats.firstGameId === game.id) {
        currentMemberStats.delete(memberId)
      }
    })

    gameRecords.push(records)
  })

  return gameRecords
}
