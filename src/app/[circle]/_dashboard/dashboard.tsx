"use client"

import { cn } from "@/utils/tailwind/cn"
import { useEffect, useState } from "react"
import { GameWithResults, Member, Stat } from "../../../server/types"
import HasAccess from "../_components/has-access"
import { AddNewGameDialog } from "./_components/add-new-game-dialog"
import BumpChart from "./bump-chart"
import Members from "./members"

type Props = {
  recentGames: GameWithResults[]
  stats: Stat[]
  members: Member[]
  circleId: number
}

export default function Dashboard({ recentGames, stats, members, circleId }: Props) {
  const recentWinners = [...recentGames]
    .slice(0, 3)
    .map((game) => game.game_results.find((r) => r.winner)!.member_id)

  const [selectedMemberId, setSelectedMemberId] = useState(stats[0]?.member_id || 0)
  const [pendingMemberIds, setPendingMemberIds] = useState<number[]>([])

  const hasGames = recentGames.length > 0

  useEffect(() => {
    setPendingMemberIds([])
  }, [stats])

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col-reverse justify-center gap-10 rounded-lg sm:flex-row sm:gap-0 sm:px-4">
          <div
            className={cn(
              `relative flex min-h-16 w-full flex-1 items-start justify-end overflow-hidden`,
              "bg-[radial-gradient(rgb(223,223,223)_1px,transparent_0)] bg-[size:12px_12px] dark:bg-[radial-gradient(rgb(40,40,40)_1px,transparent_0)]",
            )}
          >
            {hasGames && (
              <BumpChart games={recentGames} stats={stats} highlight={selectedMemberId} />
            )}
          </div>

          <div className="flex flex-col sm:w-56">
            <Members
              circleId={circleId}
              stats={stats}
              members={members}
              recentWinners={recentWinners}
              highlightId={selectedMemberId}
              onHighlightChange={(id) => setSelectedMemberId(id)}
              pendingMemberIds={pendingMemberIds}
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
              members={members}
              circleId={circleId}
              onSubmitted={(ids) => setPendingMemberIds(ids)}
            />
          </div>
        </HasAccess>
      </div>
    </>
  )
}
