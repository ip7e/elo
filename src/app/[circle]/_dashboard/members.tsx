"use client"

import { kickMember } from "@/server/actions"
import { cn } from "@/utils/tailwind/cn"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { Member, MemberStats } from "../../../server/types"
import HasAccess from "../_components/has-access"
import Star from "../_components/star"
import { NameCell, RankCell, ScoreCell, Table, TableRow } from "./_components/table"
import AddNewMember from "./add-new-member"
import { useServerAction } from "zsa-react"

type Props = {
  circleId: number
  stats: MemberStats[]
  members: Member[]
  recentWinners: number[]
  onHighlightChange: (id: number) => void
  highlightId: number
}

export default function Members({
  circleId,
  highlightId,
  onHighlightChange,
  recentWinners,
  members,
  stats,
}: Props) {
  const newMembers = members.filter((m) => !stats.find((s) => s.member_id === m.id))

  const winsByMemberId = recentWinners.reduce(
    (acc, winner) => ({
      ...acc,
      [winner]: acc[winner] ? acc[winner] + 1 : 1,
    }),
    {} as Record<number, number>,
  )

  return (
    <Table>
      {stats.map(({ elo, name, member_id }, i) => (
        <TableRow
          className="group"
          key={member_id}
          layoutId={"member-" + member_id}
          onMouseEnter={() => onHighlightChange(member_id!)}
        >
          <RankCell>{i + 1}</RankCell>
          <NameCell className={cn(highlightId === member_id && "text-accent")}>
            {name}
            <span className="mx-1 tracking-widest">
              {Array.from({ length: winsByMemberId[member_id!] }, (v, i) => (
                <Star key={i} />
              ))}
            </span>
          </NameCell>
          <ScoreCell>{elo}</ScoreCell>
        </TableRow>
      ))}
      {newMembers.map((m) => (
        <NewMemberRow member={m} key={m.id} />
      ))}

      <HasAccess>
        <AddNewMember circleId={circleId} />
      </HasAccess>
    </Table>
  )
}

const NewMemberRow = ({ member: m }: { member: Member }) => {
  const { isPending, execute } = useServerAction(kickMember)
  const [hovered, setHovered] = useState(false)

  const handleKickMember = async (id: number) => {
    execute({ id })
  }

  return (
    <TableRow
      className={cn("group", isPending && "animate-pulse")}
      key={m.id}
      layoutId={"member-" + m.id}
    >
      <RankCell className="text-sm text-neutral-200 dark:text-neutral-600">{"?"}</RankCell>
      <NameCell
        className={cn(
          "text-neutral-300 transition-all dark:text-neutral-600",
          (hovered || isPending) && "text-neutral-400 line-through dark:text-neutral-400",
        )}
      >
        {m.name}
      </NameCell>
      <HasAccess>
        <ScoreCell className="text-neutral-300 dark:text-neutral-500">
          <button
            className="flex cursor-default items-center justify-center rounded-md opacity-0 transition-colors hover:text-neutral-800 group-hover:opacity-100 dark:hover:text-neutral-200"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => handleKickMember(m.id)}
          >
            <Trash2 size={16} strokeWidth={1.25} />
          </button>
        </ScoreCell>
      </HasAccess>
    </TableRow>
  )
}
