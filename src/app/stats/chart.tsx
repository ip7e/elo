"use client"

import * as d3 from "d3"
import { motion } from "framer-motion"
import { GameWithGameResults, MemberStatsWithElo } from "./types"

type Props = {
  members: MemberStatsWithElo[]
  games: GameWithGameResults[]
  highlight: number
}

export default function Chart({ members, games: games, highlight }: Props) {
  let curEloByMember = members.reduce(
    (acc, m) => ({
      ...acc,
      [m.member_id!]: m.elo!,
    }),
    {} as Record<number, number>,
  )

  let rankingByMemberGames = {} as Record<number | string, [number | string, number][]>

  games.forEach((game) => {
    game.game_results.forEach((r) => {
      if (!curEloByMember[r.member_id!]) return

      curEloByMember[r.member_id!] = r.elo!
    })

    const curRanking = Object.entries(curEloByMember).sort((a, b) => b[1] - a[1])

    curRanking.forEach(([memberId, elo], i) => {
      rankingByMemberGames[memberId] = rankingByMemberGames[memberId] || []
      rankingByMemberGames[memberId].unshift([game.id, i])
    })
  })

  const width = 512
  const height = 128
  const padding = 8

  // Create scales
  const x = d3
    .scaleBand()
    .paddingInner(1)
    .domain(games.map((g) => "g-" + g.id.toString()))
    .range([width - padding, padding])

  const y = d3
    .scaleLinear()
    .domain([0, members.length])
    .range([padding, height - padding])

  // Create line generator
  const line = d3
    .line<[number | string, number]>()
    .defined(([game_id, rank]) => rank !== undefined)
    .x(([game_id, rank]) => x("g-" + game_id)!)
    .y(([game_id, rank]) => y(rank))
    .curve(d3.curveCatmullRom.alpha(0.5))

  const selectedData = rankingByMemberGames[highlight]

  return (
    <div className={`w-full my-8 aspect-[512/128]`}>
      <svg vectorEffect="non-scaling-stroke" viewBox={`0 0 ${width} ${height}`} width="100%">
        {Object.entries(rankingByMemberGames).map(([memberId, data]) => (
          <path
            key={memberId}
            d={line(data)!}
            stroke="#aeaeae45"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          ></path>
        ))}

        {selectedData && (
          <motion.path
            key={highlight}
            d={line(selectedData)!}
            stroke="#E6A320"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          ></motion.path>
        )}
      </svg>
    </div>
  )
}
