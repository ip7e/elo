"use client"

import { useState } from "react"
import { GameWithResults, Member, Stat } from "../../../server/types"
import BumpChart from "./bump-chart"
import Rankings from "./rankings"
import Members from "./members"

type Props = {
  recentGames: GameWithResults[]
  stats: Stat[]
  members: Member[]
  circleId: number
}

export default function CircleClient({ recentGames, stats, members, circleId }: Props) {
  const recentWinners = [...recentGames]
    .slice(0, 3)
    .map((game) => game.game_results.find((r) => r.winner)!.member_id)

  const [selectedMemberId, setSelectedMemberId] = useState(stats[0]?.member_id || 0)

  const hasGames = recentGames.length > 0
  return (
    <div className="flex flex-col-reverse justify-center gap-10 rounded-lg px-4 sm:flex-row sm:gap-0 sm:px-4">
      <div className="bg-dot-grid relative flex h-full w-full flex-1 items-start justify-end overflow-hidden">
        {hasGames && <BumpChart games={recentGames} stats={stats} highlight={selectedMemberId} />}
      </div>

      <div className="flex flex-col sm:w-56">
        <Members
          stats={stats}
          members={members}
          recentWinners={recentWinners}
          highlightId={selectedMemberId}
          onHighlightChange={(id) => setSelectedMemberId(id)}
        />
      </div>
    </div>
  )
}
