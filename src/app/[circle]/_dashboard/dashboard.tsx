"use client"

import { cn } from "@/utils/tailwind/cn"
import { useEffect, useMemo, useState } from "react"
import { GameWithResults, MemberStats } from "../../../server/types"
import { BumpChart } from "./bump-chart/bump-chart"
import Leaderboard from "./leaderboard"
import { getGameSeries } from "./prepare-data"
import { useWinStreaks } from "./_hooks/useWinStreaks"
import { useMemberVisibility } from "./_hooks/useMemberVisibility"
import { useGameSelection } from "./_hooks/useGameSelection"
import { useLeaderboardData } from "./_hooks/useLeaderboardData"
import { EmptyChart } from "./_components/empty-chart"
import { GameControls } from "./_components/game-controls"
import { DashboardLayout } from "./_components/dashboard-layout"
type Props = {
  recentGames: GameWithResults[]
  memberStats: MemberStats[]
  circleId: number
}

export default function Dashboard({ recentGames, memberStats, circleId }: Props) {
  const [selectedMemberId, setSelectedMemberId] = useState(memberStats[0]?.id || 0)
  const [pendingMemberIds, setPendingMemberIds] = useState<number[]>([])

  // Use custom hooks for business logic
  const {
    showHidden,
    visibleMemberStats,
    hasHiddenMembers,
    toggleShowHidden,
    addNewlyAddedMember,
    newlyAddedMemberIds,
  } = useMemberVisibility(memberStats)

  const {
    selectedGameIndex,
    handleGameSelect,
    resetSelectedGame,
    leaderboardTitle,
    hasSpotlightGame,
  } = useGameSelection(recentGames)

  // TODO: Move this to query
  const gameSeries = useMemo(
    () => getGameSeries(visibleMemberStats, recentGames),
    [visibleMemberStats, recentGames],
  )

  const winStreaksByMemberId = useWinStreaks(gameSeries)

  const leaderboard = useLeaderboardData({
    gameSeries,
    selectedGameIndex,
    memberStats,
    visibleMemberStats,
    winStreaksByMemberId,
    hasSpotlightGame,
    showHidden,
    newlyAddedMemberIds,
  })

  const showChart = recentGames.length

  useEffect(() => {
    setPendingMemberIds([])
  }, [memberStats])

  return (
    <div className="flex flex-col">
      <DashboardLayout
        chartSection={
          showChart ? (
            <BumpChart
              data={gameSeries}
              selectedMemberId={selectedMemberId}
              className={cn(!showChart && "hidden sm:flex")}
              selectedGameIndex={selectedGameIndex}
              onGameSelect={handleGameSelect}
            />
          ) : (
            <EmptyChart />
          )
        }
        leaderboardSection={
          <Leaderboard
            floatingTitle={leaderboardTitle}
            rows={leaderboard}
            pendingMemberIds={pendingMemberIds}
            highlightId={selectedMemberId}
            onHighlightChange={(id) => setSelectedMemberId(id)}
            onResetSelectedGame={resetSelectedGame}
            showHidden={showHidden}
            onToggleShowHidden={toggleShowHidden}
            hasHiddenMembers={hasHiddenMembers}
            onMemberAdded={addNewlyAddedMember}
          />
        }
      />

      <GameControls
        memberStats={memberStats}
        circleId={circleId}
        hasHiddenMembers={hasHiddenMembers}
        showHidden={showHidden}
        onToggleShowHidden={toggleShowHidden}
        onGameSubmitted={(ids) => {
          setPendingMemberIds(ids)
          resetSelectedGame()
        }}
      />
    </div>
  )
}
