"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { MemberStats } from "../../../server/types"
import Star from "../_components/star"

type Props = {
  stats: MemberStats[]
  recentWinners: number[]
  onHighlightChange: (id: number) => void
  highlightId: number
}

export default function Rankings({ stats, recentWinners, onHighlightChange, highlightId }: Props) {
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
          className="flex h-8 select-none gap-4 font-mono text-base"
        >
          <div className="w-10 text-right text-neutral-300 dark:text-neutral-600">{i + 1}</div>

          <div
            className={`w-full pr-4 font-medium ${highlight == member_id ? "text-accent" : "text-neutral-900 dark:text-white"}`}
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
            className={`text-right font-medium dark:text-white ${highlight == member_id ? "text-accent" : "text-neutral-300 dark:text-white"} `}
          >
            {elo}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
