"use client"

import * as d3 from "d3"
import { motion } from "framer-motion"
import { GameWithResults, MemberStats } from "../types"
import { useMemo } from "react"

type Props = {
  stats: MemberStats[]
  games: GameWithResults[]
  highlight: number
}

type GameRecord = {
  game_id: number
  rank: number
  played: boolean
  won: boolean
  isFirstGame: boolean
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
      const membersWhoWon = new Set<number>()

      // update elo for this round
      game.game_results.forEach((result) => {
        if (!rollingStats[result.member_id]) return

        membersWhoPlayed.add(result.member_id)
        if (result.winner) membersWhoWon.add(result.member_id)
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
          won: membersWhoWon.has(s.member_id!),
          isFirstGame: s.first_game === game.id,
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
  const lineHeight = statsArr.length <= 6 ? 20 : 16
  const height = statsArr.length * lineHeight
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
    .curve(d3.curveMonotoneX)

  const selectedData = gamesByMember[highlight]

  return (
    <div className={`w-full my-8 aspect-[512/${height}]`}>
      <svg vectorEffect="non-scaling-stroke" viewBox={`0 0 ${width} ${height}`} width="100%">
        {Object.entries(gamesByMember).map(([memberId, data], i) => (
          <g key={`m-${memberId}`}>
            <path
              key={`m-${memberId}`}
              d={line(data)!}
              strokeWidth={1}
              fill="none"
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeLinecap="round"
            ></path>

            {data[0].isFirstGame && (
              <circle
                cx={x("g-" + data[0].game_id)!}
                cy={y(data[0].rank)}
                r={2}
                className="fill-neutral-300 dark:fill-neutral-700"
              ></circle>
            )}
          </g>
        ))}

        {selectedData && (
          <>
            <motion.path
              key={"selected" + highlight}
              d={line(selectedData)!}
              className="stroke-accent"
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
                  strokeWidth={2}
                  r={3}
                  className={`stroke-accent ${
                    record.won ? "fill-accent" : "fill-bg dark:fill-black"
                  }`}
                ></motion.circle>
              ))}
          </>
        )}
      </svg>
    </div>
  )
}
