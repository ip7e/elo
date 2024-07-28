"use client"

import { cn } from "@/utils/tailwind/cn"
import { HTMLMotionProps, motion } from "framer-motion"
import { PropsWithChildren } from "react"
import { MemberStats } from "../../../server/types"
import Star from "../_components/star"

type Props = {
  stats: MemberStats[]
  recentWinners: number[]
  onHighlightChange: (id: number) => void
  highlightId: number
}

export default function Rankings({ stats, recentWinners, onHighlightChange, highlightId }: Props) {
  const handleHighlight = (id: number) => {
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
    <div className="flex w-full flex-col">
      {stats.map(({ elo, name, member_id, total_games, total_wins }, i) => (
        <RankingRow
          highlight={highlightId === member_id}
          memberId={member_id!}
          name={name!}
          rank={i + 1}
          wins={winsByMemberId[member_id!]}
          elo={elo!}
          onMouseEnter={() => handleHighlight(member_id!)}
          key={member_id}
        ></RankingRow>
      ))}
    </div>
  )
}

type RankingRowProps = PropsWithChildren<
  HTMLMotionProps<"div"> & {
    highlight: boolean
    memberId: number
    rank: number
    name: string
    wins: number
    elo: number
  }
>

function RankingRow({ memberId, wins, elo, highlight, name, rank, ...divProps }: RankingRowProps) {
  return (
    <motion.div
      layout
      layoutId={"m" + memberId}
      key={memberId}
      {...divProps}
      className="flex h-8 w-full select-none gap-4 font-mono text-base"
    >
      <div className="w-6 text-right text-neutral-300 dark:text-neutral-600">{rank}</div>

      <div
        className={cn(
          `w-full flex-1 pr-4 font-medium`,
          highlight && "text-accent",
          !highlight && "text-neutral-900 dark:text-white",
        )}
      >
        {name}

        <span className="mx-1 tracking-widest">
          {Array.from({ length: wins }, (v, i) => (
            <Star key={i} />
          ))}
        </span>
      </div>

      <div
        className={cn(
          `text-right font-medium dark:text-white`,
          highlight && "text-accent",
          "text-neutral-300 dark:text-white",
        )}
      >
        {elo}
      </div>
    </motion.div>
  )
}
