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
import { DashboardToolbar } from "./_components/dashboard-toolbar"
import { MemberStats as MemberStatsComponent } from "./stats/member-stats"
import { calculateMemberStats } from "./stats/calculate-member-stats"
type Props = {
  recentGames: GameWithResults[]
  memberStats: MemberStats[]
  circleId: number
}

export default function Dashboard({ recentGames, memberStats, circleId }: Props) {
  const [hoveredMemberId, setHoveredMemberId] = useState(memberStats[0]?.id || 0)
  const [showStatsForMemberId, setShowStatsForMemberId] = useState<number | null>(null)
  const [pendingMemberIds, setPendingMemberIds] = useState<number[]>([])
  const [isAddingMember, setIsAddingMember] = useState(false)

  const selectedMemberId = showStatsForMemberId ?? hoveredMemberId

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

  const memberStatsData = useMemo(() => {
    if (!showStatsForMemberId) return null
    return calculateMemberStats(showStatsForMemberId, memberStats, recentGames)
  }, [showStatsForMemberId, memberStats, recentGames])

  useEffect(() => {
    setPendingMemberIds([])
  }, [memberStats])

  return (
    <div className="flex flex-col">
      <DashboardToolbar
        hasHiddenMembers={hasHiddenMembers}
        showHidden={showHidden}
        onToggleShowHidden={toggleShowHidden}
        hidden={hasSpotlightGame}
        onAddMember={() => setIsAddingMember(true)}
      />
      <DashboardLayout
        chartSection={
          memberStatsData ? (
            <MemberStatsComponent stats={memberStatsData} />
          ) : showChart ? (
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
            onHighlightChange={(id) => setHoveredMemberId(id)}
            onMemberClick={(id) => setShowStatsForMemberId(showStatsForMemberId === id ? null : id)}
            onResetSelectedGame={resetSelectedGame}
            onMemberAdded={addNewlyAddedMember}
            canDeleteSelectedGame={selectedGameIndex === 0}
            circleId={circleId}
            isAddingMember={isAddingMember}
            onAddingMemberChange={setIsAddingMember}
          />
        }
      />
      <GameControls
        memberStats={memberStats}
        circleId={circleId}
        onGameSubmitted={(ids) => {
          setPendingMemberIds(ids)
          resetSelectedGame()
        }}
      />
    </div>
  )
}
