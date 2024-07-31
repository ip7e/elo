"use client"

import { cn } from "@/utils/tailwind/cn"
import { HTMLMotionProps, motion } from "framer-motion"
import { PropsWithChildren } from "react"
import { Member, MemberStats } from "../../../server/types"
import HasAccess from "../_components/has-access"
import Star from "../_components/star"
import AddNewMember from "./add-new-member"

type Props = {
  stats: MemberStats[]
  members: Member[]
  recentWinners: number[]
  onHighlightChange: (id: number) => void
  highlightId: number
}

export default function Rankings({
  stats,
  recentWinners,
  members,
  onHighlightChange,
  highlightId,
}: Props) {
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

  // TODO: Improves this
  const membersWithNoGames = members.filter((m) => !stats.find((s) => s.member_id === m.id))

  return (
    <div className="group flex w-full flex-col">
      {stats.map(({ elo, name, member_id }, i) => (
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
      {membersWithNoGames.map((m) => (
        <RankingRow
          highlight={highlightId === m.id}
          memberId={m.id}
          name={m.name!}
          rank={"?"}
          wins={0}
          elo={1100}
          key={m.id}
        ></RankingRow>
      ))}
      <HasAccess>
        <AddNewMember />
      </HasAccess>
    </div>
  )
}

type RankingRowProps = PropsWithChildren<
  HTMLMotionProps<"div"> & {
    highlight: boolean
    memberId: number
    rank: number | string
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
          `flex-1 overflow-hidden text-ellipsis text-nowrap pr-4 font-medium`,
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
