"use client"

import { MembersWithStats } from "@/server/queries"
import { cn } from "@/utils/tailwind/cn"
import { useEffect, useState } from "react"
import { GameWithResults } from "../../../server/types"
import HasAccess from "../_components/has-access"
import { AddNewGameDialog } from "./_components/add-new-game-dialog"
import { BumpChart } from "./bump-chart/bump-chart"
import Members from "./members"
import { getGameSeries } from "./prepare-data"

type Props = {
  recentGames: GameWithResults[]
  membersWithStats: MembersWithStats
  circleId: number
}

export default function Dashboard({ recentGames, membersWithStats, circleId }: Props) {
  const [selectedMemberId, setSelectedMemberId] = useState(membersWithStats[0]?.id || 0)
  const [pendingMemberIds, setPendingMemberIds] = useState<number[]>([])
  const [selectedGameIndex, setSelectedGameIndex] = useState<number | null>(null)

  const chartData = getGameSeries(membersWithStats, recentGames)

  const handleGameSelect = (index: number | null) => {
    if (selectedGameIndex === index) setSelectedGameIndex(null)
    else setSelectedGameIndex(index)
  }

  const showChart = recentGames.length

  useEffect(() => {
    setPendingMemberIds([])
  }, [membersWithStats])

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col-reverse justify-center gap-10 rounded-lg sm:flex-row sm:gap-4 sm:px-4">
          <div
            className={cn(
              `relative flex min-h-16 w-full flex-1 items-start justify-end overflow-hidden`,
            )}
          >
            {showChart && (
              <BumpChart
                data={chartData}
                selectedMemberId={selectedMemberId}
                className={cn(!showChart && "hidden sm:flex")}
                selectedGameIndex={selectedGameIndex}
                onGameSelect={handleGameSelect}
              />
            )}
            {!showChart && (
              <div className="flex h-full min-h-16 w-full items-center justify-center">
                <span className="rounded-md border border-border bg-background px-2 py-1 font-mono text-sm text-muted">
                  no games yet
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col py-2 sm:w-60">
            <Members
              circleId={circleId}
              membersWithStats={membersWithStats}
              recentGames={recentGames}
              highlightId={selectedMemberId}
              onHighlightChange={(id) => setSelectedMemberId(id)}
              pendingMemberIds={pendingMemberIds}
              selectedGameIndex={selectedGameIndex}
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
              members={membersWithStats}
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
