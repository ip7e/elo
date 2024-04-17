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
  const [debouncedSelectedMemberId] = useDebounce(selectedMemberId, 150)

  return (
    <div className="flex flex-col h-full justify-center gap-4">
      <Leaderboard
        recentWinners={recentWinners}
        stats={stats}
        highlightId={selectedMemberId}
        onHighlightChange={(id) => setSelectedMemberId(id)}
      />

      <div>
        <Chart games={recentGames} stats={stats} highlight={debouncedSelectedMemberId} />

        {isAdmin && <NewGameOpener members={members} circleId={circleId} />}
      </div>
    </div>
  )
}
