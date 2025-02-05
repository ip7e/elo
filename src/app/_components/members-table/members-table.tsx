import { cn } from "@/utils/tailwind/cn"
import { motion } from "framer-motion"
import {
  LeadingCell,
  MiddleCell,
  Table,
  TableRow,
  TrailingCell,
} from "@/app/[circle]/_dashboard/_components/table"
import Star from "@/app/[circle]/_components/star"
import NumbersShuffler from "@/app/[circle]/_components/numbers-shuffler"

export type MemberRowData = {
  id: number
  name: string
  rank?: number
  elo?: number
  winningStreak?: number
  isNew?: boolean
  isPending?: boolean
}

type Props = {
  members: MemberRowData[]
  onHighlightChange?: (id: number) => void
  highlightId?: number
  className?: string
  renderActions?: (member: MemberRowData) => React.ReactNode
}

export function MembersTable({
  members,
  highlightId,
  onHighlightChange,
  className,
  renderActions,
}: Props) {
  const activeMembers = members.filter((m) => !m.isNew)
  const newMembers = members.filter((m) => m.isNew)
  const hasTwoDigitRank = activeMembers.length > 9

  return (
    <Table className={cn("relative", className)}>
      {activeMembers.map((member) => (
        <TableRow
          className="group relative"
          key={member.id}
          layoutId={"member-" + member.id}
          onMouseEnter={() => onHighlightChange?.(member.id)}
        >
          <LeadingCell className={cn("hidden md:block", hasTwoDigitRank && "w-8")}>
            {member.rank || "?"}
          </LeadingCell>
          <MiddleCell className={cn(highlightId === member.id && "text-accent dark:text-accent")}>
            {member.name}
            {member.winningStreak ? (
              <span className="mx-1 tracking-widest">
                {Array.from({ length: member.winningStreak }, (_, i) => (
                  <Star key={i} />
                ))}
              </span>
            ) : null}
          </MiddleCell>
          <TrailingCell>
            <NumbersShuffler spin={!!member.isPending} value={member.elo ?? 0} />
          </TrailingCell>

          {renderActions?.(member)}
        </TableRow>
      ))}

      {newMembers.map((member) => (
        <TableRow className="group" key={member.id} layoutId={"member-" + member.id}>
          <LeadingCell
            className={cn(
              "text-sm text-neutral-200 dark:text-neutral-600",
              hasTwoDigitRank && "w-8",
            )}
          >
            {"?"}
          </LeadingCell>
          <MiddleCell className="text-neutral-300 dark:text-neutral-600">{member.name}</MiddleCell>
          {renderActions?.(member)}
        </TableRow>
      ))}
    </Table>
  )
}
