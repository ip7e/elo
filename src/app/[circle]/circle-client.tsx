"use client"

import { useState } from "react"
import { useDebounce } from "use-debounce"
import Chart from "./data/chart"
import Leaderboard from "./data/leaderboard"
import NewGameOpener from "./new-game/new-game-opener"
import { GameWithResults, Member, Stat } from "./types"

type Props = {
  members: Member[]
  recentGames: GameWithResults[]
  stats: Stat[]
  isAdmin: boolean
  circleId: number
}

export default function CircleClient({ members, recentGames, stats, isAdmin, circleId }: Props) {
  const recentWinners = [...recentGames]
    .slice(0, 3)
    .map((game) => game.game_results.find((r) => r.winner)!.member_id)

  const [selectedMemberId, setSelectedMemberId] = useState(stats[0]?.member_id || 0)

  return (
    <div className="h-full flex flex-col justify-center ">
      <div className="flex justify-center gap-4">
        <div className="flex basis-2/3 relative">
          <div className="absolute top-0 h-full right-0 gradient-clip">
            <Chart games={recentGames} stats={stats} highlight={selectedMemberId} />
          </div>
        </div>

        <div className="flex basis-1/3">
          <Leaderboard
            recentWinners={recentWinners}
            stats={stats}
            highlightId={selectedMemberId}
            onHighlightChange={(id) => setSelectedMemberId(id)}
          />
        </div>
      </div>
    </div>
  )
}
