"use client"

import { cn } from "@/utils/tailwind/cn"
import { Member, MemberStats } from "../../../server/types"
import { NameCell, RankCell, ScoreCell, Table, TableRow } from "./_components/table"
import HasAccess from "../_components/has-access"
import AddNewMember from "./add-new-member"
import Star from "../_components/star"

type Props = {
  stats: MemberStats[]
  members: Member[]
  recentWinners: number[]
  onHighlightChange: (id: number) => void
  highlightId: number
}

export default function Members({
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
        <TableRow className="group" key={m.id} layoutId={"member-" + m.id}>
          <RankCell className="text-sm text-neutral-200 dark:text-neutral-700">{"?"}</RankCell>
          <NameCell className={cn("text-neutral-300 dark:text-neutral-600")}>{m.name}</NameCell>
        </TableRow>
      ))}

      <HasAccess>
        <AddNewMember />
      </HasAccess>
    </Table>
  )
}
