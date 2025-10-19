import { useMemo } from "react"
import { GameRecord } from "../bump-chart/types"

/**
 * Hook to calculate win streaks for each member based on game series data.
 * A win streak counts consecutive wins from the latest game backwards.
 */
export function useWinStreaks(gameSeries: GameRecord[][]): Map<number, number> {
  return useMemo(() => {
    const streaks = new Map<number, number>()

    if (gameSeries.length === 0) return streaks

    // For each member in the latest game
    gameSeries[0]?.forEach((record) => {
      const memberId = record.member.id
      let streak = 0

      // Look through games from latest to oldest
      for (let i = 0; i < gameSeries.length; i++) {
        const gameRecord = gameSeries[i]?.find((r) => r.member.id === memberId)

        if (!gameRecord?.played) continue

        if (gameRecord.won) {
          streak++ // If member played and won, increment streak
        } else {
          break // Stop counting once we hit a loss or non-played game
        }
      }

      if (streak > 0) {
        streaks.set(memberId, streak)
      }
    })

    return streaks
  }, [gameSeries])
}
