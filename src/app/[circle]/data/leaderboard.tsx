"use client"

import { useEffect, useState } from "react"
import { useDebounce } from "use-debounce"
import { GameWithResults, MemberStats } from "../types"
import Star from "./star"
import { motion } from "framer-motion"

type Props = {
  stats: MemberStats[]
  recentWinners: number[]
  onHighlightChange: (id: number) => void
  highlightId: number
}

export default function StatsClient({
  stats,
  recentWinners,
  onHighlightChange,
  highlightId,
}: Props) {
  const [highlight, setHighlight] = useState<number>(highlightId)
  const [highlightDebounced] = useDebounce(highlight, 150)

  const handleHighlight = (id: number) => {
    setHighlight(id)
    onHighlightChange(id)
  }

  const winsByMemberId = recentWinners.reduce(
    (acc, winner) => ({
      ...acc,
      [winner]: acc[winner] ? acc[winner] + 1 : 1,
    }),
    {} as Record<number, number>,
  )

  return (
    <table className="table border-separate border-spacing-x-3 border-spacing-y-2">
      <thead>
        <tr className="text-sm lowercase align-text-top  text-neutral-300 dark:text-neutral-600">
          <th className="invisible"></th>
          <th className="invisible w-full">Player</th>
          <th className="text-center font-light text-lg">elo</th>
          <th className="text-center font-light text-lg">%</th>
        </tr>
      </thead>

      <tbody>
        {stats.map(({ elo, name, member_id, total_games, total_wins }, i) => (
          <motion.tr
            layout
            layoutId={"m" + member_id!}
            key={member_id}
            onMouseEnter={() => handleHighlight(member_id!)}
            className="select-none text-lg"
          >
            <td className="text-right text-neutral-300 dark:text-neutral-600 w-max ">{i + 1}</td>

            <td
              className={`w-full font-semibold
                 ${highlight == member_id ? "text-[#E6A320]" : "text-neutral-900 dark:text-white"}`}
            >
              {name}

              {winsByMemberId[member_id!] && (
                <span className="mx-1 tracking-widest">
                  {Array(winsByMemberId[member_id!])
                    .fill(null)
                    .map((_, i) => (
                      <Star key={i} />
                    ))}
                </span>
              )}
            </td>
            <td className="font-medium text-right text-black dark:text-white">{elo}</td>
            <td className="text-right text-neutral-400 dark:text-neutral-600 w-max">
              {Math.round(((total_wins || 0) / (total_games || 0)) * 100)}
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  )
}
