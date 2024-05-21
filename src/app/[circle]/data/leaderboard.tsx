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
    <div className="flex flex-col">
      {stats.map(({ elo, name, member_id, total_games, total_wins }, i) => (
        <motion.div
          layout
          layoutId={"m" + member_id!}
          key={member_id}
          onMouseEnter={() => handleHighlight(member_id!)}
          className="flex gap-4 h-8 select-none text-base"
        >
          <div className="text-right w-10 text-neutral-300 dark:text-neutral-600">{i + 1}</div>

          <div
            className={`w-full font-medium pr-4
                 ${highlight == member_id ? "text-accent" : "text-neutral-900 dark:text-white"}`}
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
          </div>
          <div
            className={`font-medium  text-right dark:text-white
              ${highlight == member_id ? "text-accent" : "text-neutral-300  dark:text-white"}
            `}
          >
            {elo}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
