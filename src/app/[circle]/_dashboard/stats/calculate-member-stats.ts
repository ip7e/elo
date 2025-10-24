import { GameWithResults, Member, MemberStats as ServerMemberStats } from "@/server/types"
import { MemberStatsData, OpponentRecord, StreakInfo } from "./types"

export function calculateMemberStats(
  memberId: number,
  memberStats: ServerMemberStats[],
  games: GameWithResults[],
): MemberStatsData | null {
  const member = memberStats.find((m) => m.id === memberId)
  if (!member) return null

  const memberGames = games
    .filter((game) => game.game_results.some((r) => r.member_id === memberId))
    .sort((a, b) => a.id - b.id)

  const totalGames = memberGames.length
  const totalCircleGames = games.length

  const memberResults = memberGames.map((game) => {
    const result = game.game_results.find((r) => r.member_id === memberId)!
    return {
      game,
      result,
      opponents: game.game_results.filter((r) => r.member_id !== memberId),
    }
  })

  const wins = memberResults.filter((r) => r.result.winner).length
  const losses = totalGames - wins
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0

  const elos = memberResults.map((r) => r.result.elo)
  const currentElo = member.elo
  const peakElo = Math.max(...elos, currentElo)
  const lowestElo = Math.min(...elos, currentElo)

  const firstElo = member.first_game?.elo ?? 1100
  const totalEloChange = currentElo - firstElo
  const avgEloChangePerGame = totalGames > 0 ? totalEloChange / totalGames : 0

  const opponentMap = new Map<string, OpponentRecord>()

  memberResults.forEach((r) => {
    r.opponents.forEach((opp) => {
      const oppId = String(opp.member_id)
      if (!opponentMap.has(oppId)) {
        const oppMember = memberStats.find((m) => m.id === opp.member_id)
        if (!oppMember) return

        opponentMap.set(oppId, {
          opponent: oppMember,
          wins: 0,
          losses: 0,
          totalGames: 0,
          winRate: 0,
        })
      }

      const record = opponentMap.get(oppId)!
      record.totalGames++
      if (r.result.winner) {
        record.wins++
      } else {
        record.losses++
      }
    })
  })

  const opponentRecords = Array.from(opponentMap.values()).map((record) => ({
    ...record,
    winRate: record.totalGames > 0 ? (record.wins / record.totalGames) * 100 : 0,
  }))

  const easiestOpponent =
    opponentRecords.length > 0
      ? opponentRecords.reduce((max, opp) =>
          opp.totalGames >= 3 && opp.winRate > max.winRate ? opp : max,
        )
      : null

  const toughestOpponent =
    opponentRecords.length > 0
      ? opponentRecords.reduce((min, opp) =>
          opp.totalGames >= 3 && opp.winRate < min.winRate ? opp : min,
        )
      : null

  const mostFrequentOpponent =
    opponentRecords.length > 0
      ? opponentRecords.reduce((max, opp) => (opp.totalGames > max.totalGames ? opp : max))
      : null

  const streaks = calculateStreaks(memberResults.map((r) => r.result.winner ?? false))

  const recentForm = memberResults
    .slice(-5)
    .reverse()
    .map((r) => ({
      participated: true,
      won: r.result.winner ?? false,
      gameId: r.game.id,
    }))

  const participationRate = totalCircleGames > 0 ? (totalGames / totalCircleGames) * 100 : 0

  return {
    member,
    totalGames,
    wins,
    losses,
    winRate,
    currentElo,
    peakElo,
    lowestElo,
    totalEloChange,
    avgEloChangePerGame,
    opponentRecords,
    easiestOpponent,
    toughestOpponent,
    mostFrequentOpponent,
    streaks,
    recentForm,
    participationRate,
  }
}

function calculateStreaks(winHistory: boolean[]): StreakInfo {
  let currentStreak = { type: "win" as "win" | "loss", count: 0 }
  let longestWin = 0
  let longestLoss = 0
  let currentWinStreak = 0
  let currentLossStreak = 0

  for (let i = winHistory.length - 1; i >= 0; i--) {
    const won = winHistory[i]

    if (won) {
      currentWinStreak++
      currentLossStreak = 0
      longestWin = Math.max(longestWin, currentWinStreak)
    } else {
      currentLossStreak++
      currentWinStreak = 0
      longestLoss = Math.max(longestLoss, currentLossStreak)
    }
  }

  if (currentWinStreak > 0) {
    currentStreak = { type: "win", count: currentWinStreak }
  } else if (currentLossStreak > 0) {
    currentStreak = { type: "loss", count: currentLossStreak }
  }

  return {
    current: currentStreak,
    longestWin,
    longestLoss,
  }
}
