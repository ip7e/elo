"use client"

import { useOptimistic, useState } from "react"
import Leaderboard from "./data/leaderboard"
import Chart from "./data/chart"
import { GameWithResults, Member, Stat } from "./types"
import NewGameOpener from "./new-game/new-game-opener"
import { useDebounce } from "use-debounce"

type Props = {
  members: Member[]
  recentGames: GameWithResults[]
  stats: Stat[]
}

export default function CircleClient({ members, recentGames, stats }: Props) {
  const [optimisticStats, setOptimisticStats] = useOptimistic(stats)
  const [optimisticRecentGames, setOptimisticRecentGames] = useOptimistic(recentGames)
  const [optimisticMembers, setOptimisticMembers] = useOptimistic(members)

  const recentWinners = [...recentGames]
    .slice(0, 3)
    .map((game) => game.game_results.find((r) => r.winner)!.member_id)

  const [selectedMemberId, setSelectedMemberId] = useState(stats[0].member_id!)
  const [debouncedSelectedMemberId] = useDebounce(selectedMemberId, 150)

  return (
    <>
      <Leaderboard
        recentWinners={recentWinners}
        stats={stats}
        highlightId={selectedMemberId}
        onHighlightChange={(id) => setSelectedMemberId(id)}
      />

      <Chart games={recentGames} stats={stats} highlight={debouncedSelectedMemberId} />

      <NewGameOpener members={members} circleId={2} />
    </>
  )
}
