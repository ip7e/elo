"use client"

import { cn } from "@/utils/tailwind/cn"
import { useEffect, useMemo, useState } from "react"
import { GameWithResults, MemberStats } from "../../../server/types"
import HasAccess from "../_components/has-access"
import { AddNewGameDialog } from "./_components/add-new-game-dialog"
import { BumpChart } from "./bump-chart/bump-chart"
import Leaderboard, { LeaderboardRow } from "./leaderboard"
import { getGameSeries } from "./prepare-data"
import { format } from "date-fns"
type Props = {
  recentGames: GameWithResults[]
  memberStats: MemberStats[]
  circleId: number
}

export default function Dashboard({ recentGames, memberStats, circleId }: Props) {
  const [selectedMemberId, setSelectedMemberId] = useState(memberStats[0]?.id || 0)
  const [pendingMemberIds, setPendingMemberIds] = useState<number[]>([])
  const [selectedGameIndex, setSelectedGameIndex] = useState<number | null>(null)
  const [showHidden, setShowHidden] = useState(false)
  const [newlyAddedMemberIds, setNewlyAddedMemberIds] = useState<Set<number>>(new Set())

  const visibleMemberStats = useMemo(
    () => (showHidden ? memberStats : memberStats.filter((m) => m.isVisible)),
    [memberStats, showHidden],
  )

  // TODO: Move this to query
  const gameSeries = useMemo(
    () => getGameSeries(visibleMemberStats, recentGames),
    [visibleMemberStats, recentGames],
  )

  const winStreaksByMemberId = useMemo(() => {
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

        if (gameRecord.won)
          streak++ // If member played and won, increment streak
        else break // Stop counting once we hit a loss or non-played game
      }

      if (streak > 0) {
        streaks.set(memberId, streak)
      }
    })

    return streaks
  }, [gameSeries])

  const handleGameSelect = (index: number | null) => {
    if (selectedGameIndex === index) setSelectedGameIndex(null)
    else setSelectedGameIndex(index)
  }

  const leaderboardTitle = useMemo(() => {
    if (selectedGameIndex === null) return undefined

    return format(new Date(recentGames[selectedGameIndex].created_at), "MMMM d")
  }, [selectedGameIndex, recentGames])

  const showChart = recentGames.length

  useEffect(() => {
    setPendingMemberIds([])
  }, [memberStats])

  const hasSpotlightGame = selectedGameIndex !== null
  const hasHiddenMembers = memberStats.some((m) => !m.isVisible)

  const leaderboard = useMemo<LeaderboardRow[]>(() => {
    const gameSession = gameSeries[selectedGameIndex ?? 0] ?? []
    const membersToShow = showHidden ? memberStats : visibleMemberStats

    return [...membersToShow]
      .map((member) => {
        const gameRecord = gameSession.find((p) => p.member.id === member.id)

        return {
          member,
          elo: gameRecord?.elo ?? 0,
          delta: gameRecord?.delta || undefined,
          isActive: member.isVisible,
        }
      })
      .sort((a, b) => (b.elo ?? 0) - (a.elo ?? 0))
      .map(({ member, elo, delta, isActive }, index) => ({
        name: member.name!,
        rank: elo ? index + 1 : undefined,
        winStreak: winStreaksByMemberId.get(member.id) ?? undefined,
        elo,
        member,
        delta: hasSpotlightGame ? delta : undefined,
        isActive,
      }))
  }, [gameSeries, selectedGameIndex, memberStats, visibleMemberStats, winStreaksByMemberId, hasSpotlightGame, showHidden])

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col-reverse justify-center gap-10 rounded-lg sm:flex-row sm:gap-4 sm:px-4">
          <div
            className={cn(
              `relative flex min-h-16 w-full flex-1 items-start justify-end overflow-hidden`,
            )}
          >
            {showChart ? (
              <BumpChart
                data={gameSeries}
                selectedMemberId={selectedMemberId}
                className={cn(!showChart && "hidden sm:flex")}
                selectedGameIndex={selectedGameIndex}
                onGameSelect={handleGameSelect}
              />
            ) : (
              <div className="flex h-full min-h-16 w-full items-center justify-center">
                <span className="rounded-md border border-border bg-background px-2 py-1 font-mono text-sm text-muted">
                  no games yet
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col py-2 sm:w-64">
            <Leaderboard
              floatingTitle={leaderboardTitle}
              rows={leaderboard}
              pendingMemberIds={pendingMemberIds}
              highlightId={selectedMemberId}
              onHighlightChange={(id) => setSelectedMemberId(id)}
              onResetSelectedGame={() => handleGameSelect(null)}
              showHidden={showHidden}
              onToggleShowHidden={() => setShowHidden(!showHidden)}
              hasHiddenMembers={hasHiddenMembers}
            />
          </div>
        </div>

        <HasAccess>
          <div
            className={cn(
              "flex w-full items-center justify-end py-8 sm:order-1 sm:justify-center sm:py-16",
              "-order-1",
            )}
          >
            <AddNewGameDialog
              members={memberStats}
              circleId={circleId}
              onSubmitted={(ids) => {
                setPendingMemberIds(ids)
                setSelectedGameIndex(null)
              }}
            />
          </div>
        </HasAccess>
      </div>
    </>
  )
}
