"use client"

import * as d3 from "d3"
import { motion } from "framer-motion"
import { GameWithGameResults, MemberStats } from "./types"
import { useMemo } from "react"

type Props = {
  stats: MemberStats[]
  games: GameWithGameResults[]
  highlight: number
}

type GameRecord = {
  game_id: number
  rank: number
  played: boolean
}

export default function Chart({ stats: statsArr, games: games, highlight }: Props) {
  const gamesByMember = useMemo(() => {
    let gamesByMember: Record<number, GameRecord[]> = {}
    // will mutate while looping through games
    const rollingStats = statsArr.reduce(
      (acc, s) => ({
        ...acc,
        [s.member_id!]: { ...s },
      }),
      {} as Record<number, MemberStats>,
    )

    // loop through games starting with the most recent one
    games.forEach((game, i) => {
      // collect list of members who played in this round
      const membersWhoPlayed = new Set<number>()

      // update elo for this round
      game.game_results.forEach((result) => {
        if (!rollingStats[result.member_id]) return

        membersWhoPlayed.add(result.member_id)
        rollingStats[result.member_id].elo = result.elo
      })

      // sort members by elo to determine rank for this round
      const sortedStats = Object.values(rollingStats).sort((a, b) => b.elo! - a.elo!)

      sortedStats.forEach((s, i) => {
        gamesByMember[s.member_id!] = gamesByMember[s.member_id!] || []

        gamesByMember[s.member_id!].unshift({
          game_id: game.id,
          rank: i,
          played: membersWhoPlayed.has(s.member_id!),
        })

        if (s.first_game === game.id) {
          delete rollingStats[s.member_id!]
        }
      })

      return
    })

    return gamesByMember
  }, [games, statsArr])

  if (!gamesByMember) return null

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
    .domain([0, statsArr.length])
    .range([padding, height - padding])

  // Create line generator
  const line = d3
    .line<GameRecord>()
    .defined((d) => d !== undefined)
    .x((record) => x("g-" + record.game_id)!)
    .y((record) => y(record.rank))
    .curve(d3.curveCatmullRom.alpha(0.5))

  const selectedData = gamesByMember[highlight]

  return (
    <div className={`w-full my-8 aspect-[512/128]`}>
      <svg vectorEffect="non-scaling-stroke" viewBox={`0 0 ${width} ${height}`} width="100%">
        {Object.entries(gamesByMember).map(([memberId, data]) => (
          <>
            <path
              key={memberId}
              d={line(data)!}
              stroke="#aeaeae45"
              strokeWidth={2}
              fill="none"
              strokeLinecap="round"
            ></path>
            {data[0].played && (
              <circle
                key={memberId}
                cx={x("g-" + data[0].game_id)!}
                cy={y(data[0].rank)}
                r={2}
                fill="#aeaeae45"
              ></circle>
            )}
          </>
        ))}

        {selectedData && (
          <>
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

            {selectedData
              .filter((r) => r.played)
              .map((record, i) => (
                <motion.circle
                  key={`${highlight}-${record.game_id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: i * 0.02 } }}
                  cx={x("g-" + record.game_id)!}
                  cy={y(record.rank)}
                  r={3}
                  stroke="#E6A320"
                  fill="#F5F2ED"
                ></motion.circle>
              ))}
          </>
        )}
      </svg>
    </div>
  )
}
