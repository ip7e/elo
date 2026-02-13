import { useMemo } from "react"
import { MemberStats } from "@/server/types"
import { GameRecord } from "../bump-chart/types"
import { LeaderboardRow } from "../leaderboard"

type UseLeaderboardDataParams = {
  gameSeries: GameRecord[][]
  selectedGameIndex: number | null
  memberStats: MemberStats[]
  visibleMemberStats: MemberStats[]
  winStreaksByMemberId: Map<number, number>
  hasSpotlightGame: boolean
  showHidden: boolean
  newlyAddedMemberIds: Set<number>
}

/**
 * Hook to transform game and member data into leaderboard rows.
 * Handles filtering, sorting, and mapping data for display.
 */
export function useLeaderboardData({
  gameSeries,
  selectedGameIndex,
  memberStats,
  visibleMemberStats,
  winStreaksByMemberId,
  hasSpotlightGame,
  showHidden,
  newlyAddedMemberIds,
}: UseLeaderboardDataParams): LeaderboardRow[] {
  return useMemo(() => {
    const gameSession = gameSeries[selectedGameIndex ?? 0] ?? []
    const membersToShow = showHidden ? memberStats : visibleMemberStats

    return [...membersToShow]
      .map((member) => {
        const gameRecord = gameSession.find((p) => p.member.id === member.id)

        return {
          member,
          elo: gameRecord?.elo ?? 0,
          delta: gameRecord?.delta || undefined,
          isActive: member.isVisible || newlyAddedMemberIds.has(member.id),
        }
      })
      .sort((a, b) => (b.elo ?? 0) - (a.elo ?? 0) || (a.member.name ?? "").localeCompare(b.member.name ?? ""))
      .map(({ member, elo, delta, isActive }, index) => ({
        name: member.name!,
        rank: elo ? index + 1 : undefined,
        winStreak: winStreaksByMemberId.get(member.id) ?? undefined,
        elo,
        member,
        delta: hasSpotlightGame ? delta : undefined,
        isActive,
      }))
  }, [
    gameSeries,
    selectedGameIndex,
    memberStats,
    visibleMemberStats,
    winStreaksByMemberId,
    hasSpotlightGame,
    showHidden,
    newlyAddedMemberIds,
  ])
}
