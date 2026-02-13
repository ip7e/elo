"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/utils/tailwind/cn"
import { MemberStats } from "../../../server/types"
import HasAccess from "../_components/has-access"
import NumberShuffler from "../_components/numbers-shuffler"
import Star from "../_components/star"
import { AnimatedRow, FloatingCell, Table, TableCell } from "./_components/table"
import { DeltaCell } from "./_components/delta-cell"
import { LeaderboardHeader } from "./_components/leaderboard-header"
import { MemberActionsMenu } from "./_components/member-actions-menu"
import AddNewMember from "./add-new-member"

export type LeaderboardRow = {
  name: string
  rank: number | undefined
  elo: number | undefined
  winStreak: number | undefined
  delta: number | undefined
  member: MemberStats
  isActive: boolean
}

type Props = {
  rows: LeaderboardRow[]
  onHighlightChange: (id: number) => void
  onMemberClick?: (id: number) => void
  pendingMemberIds: number[]
  highlightId: number
  floatingTitle?: string
  onResetSelectedGame?: () => void
  onMemberAdded?: (id: number) => void
  canDeleteSelectedGame?: boolean
  circleId: number
  isAddingMember?: boolean
  onAddingMemberChange?: (adding: boolean) => void
}

export default function Leaderboard({
  rows,
  highlightId,
  onHighlightChange,
  onMemberClick,
  floatingTitle,
  onResetSelectedGame,
  pendingMemberIds,
  onMemberAdded,
  canDeleteSelectedGame,
  circleId,
  isAddingMember,
  onAddingMemberChange,
}: Props) {
  const hasTwoDigitRank = rows.some((m) => m.rank && m.rank > 9)

  return (
    <div className="relative">
      <LeaderboardHeader
        floatingTitle={floatingTitle}
        onResetSelectedGame={onResetSelectedGame}
        canDelete={canDeleteSelectedGame}
        circleId={circleId}
      />
      <Table>
        {rows.map((row) => (
          <AnimatedRow
            className="group relative cursor-pointer"
            key={row.member.id}
            layoutId={`row-${row.member.id}`}
            onMouseOver={() => onHighlightChange(row.member.id)}
            onClick={() => onMemberClick?.(row.member.id)}
          >
            <RankCell rank={row.rank} wide={hasTwoDigitRank} />

            <NameCell
              name={row.name}
              winStreak={row.winStreak}
              highlight={row.member.id === highlightId}
              muted={(floatingTitle && !row.delta) || !row.elo || !row.isActive}
            />

            <DeltaCell delta={row.delta} />

            <EloCell elo={row.elo} spin={pendingMemberIds.includes(row.member.id)} />

            <FloatingCell>
              <HasAccess>
                <MemberActionsMenu member={row.member} />
              </HasAccess>
            </FloatingCell>
          </AnimatedRow>
        ))}
        {isAddingMember && (
          <AnimatedRow layoutId="add-member">
            <AddNewMember
              circleId={circleId}
              leadingCellSize={hasTwoDigitRank ? "w-6" : "w-3"}
              onMemberAdded={onMemberAdded}
              onClose={() => onAddingMemberChange?.(false)}
            />
          </AnimatedRow>
        )}
      </Table>
    </div>
  )
}

function RankCell({ rank, wide }: { rank: number | undefined; wide?: boolean }) {
  const hasRank = rank !== undefined
  return (
    <TableCell className={cn("w-3 text-right", wide && "w-6", !hasRank && "text-muted")}>
      {rank || "?"}
    </TableCell>
  )
}

function NameCell({
  name,
  winStreak,
  highlight,
  muted,
}: {
  name: string
  winStreak: number | undefined
  highlight: boolean
  muted: boolean
}) {
  return (
    <TableCell
      className={cn(
        "flex-1 items-center overflow-hidden text-ellipsis text-nowrap font-medium text-primary",
        "group-hover:text-accent",
        highlight && "text-accent",
        muted && "text-secondary",
        highlight && muted && "text-accent/50",
        muted && "group-hover:text-accent/50",
      )}
    >
      <span>{name}</span>
      {winStreak ? (
        <Tooltip delayDuration={500}>
          <TooltipTrigger>
            <span className="mx-1 tracking-widest">
              <Star />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {winStreak === 1 ? "last game winner" : `${winStreak} wins in a row`}
          </TooltipContent>
        </Tooltip>
      ) : null}
    </TableCell>
  )
}

function EloCell({ elo, spin }: { elo: number | undefined; spin: boolean }) {
  return (
    <TableCell className="w-10 text-right">
      {elo ? <NumberShuffler value={elo} spin={spin} /> : ""}
    </TableCell>
  )
}
