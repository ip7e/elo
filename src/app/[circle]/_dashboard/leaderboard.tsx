"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { kickMember } from "@/server/actions"
import { cn } from "@/utils/tailwind/cn"
import { EllipsisVertical, Loader2, ShieldCheck, Trash2, X } from "lucide-react"
import { useServerAction } from "zsa-react"
import { Member, MemberStats } from "../../../server/types"
import HasAccess from "../_components/has-access"
import NumberShuffler from "../_components/numbers-shuffler"
import Star from "../_components/star"
import InviteDialogContent from "./_components/invite-dialog-content"
import { AnimatedRow, FloatingCell, Table, TableCell } from "./_components/table"
import AddNewMember from "./add-new-member"
import { useState } from "react"
import RenameMemberDialogContent from "./_components/rename-member-dialog-content"

export type LeaderboardRow = {
  name: string
  rank: number | undefined
  elo: number | undefined
  winStreak: number | undefined
  delta: number | undefined
  member: MemberStats
}

type Props = {
  rows: LeaderboardRow[]
  onHighlightChange: (id: number) => void
  pendingMemberIds: number[]
  highlightId: number
  floatingTitle?: string
  showAddMember?: boolean
  onResetSelectedGame?: () => void
}

export default function Leaderboard({
  rows,
  highlightId,
  onHighlightChange,
  floatingTitle,
  showAddMember = true,
  onResetSelectedGame,
  pendingMemberIds,
}: Props) {
  const hasTwoDigitRank = rows.some((m) => m.rank && m.rank > 9)

  return (
    <div className="relative">
      {floatingTitle && (
        <div
          className="group absolute -top-12 left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-2 text-nowrap rounded-md border border-border bg-background px-3 py-1.5 shadow-sm"
          onClick={onResetSelectedGame}
        >
          <span className="text-sm font-medium text-muted-foreground">{floatingTitle}</span>
          <X className="h-3 w-3 text-muted group-hover:text-primary" />
        </div>
      )}
      <Table>
        {rows.map((row) => (
          <AnimatedRow
            className="group relative"
            key={row.member.id}
            layoutId={`row-${row.member.id}`}
            onMouseOver={() => onHighlightChange(row.member.id)}
          >
            <RankCell rank={row.rank} wide={hasTwoDigitRank} />

            <NameCell
              name={row.name}
              winStreak={row.winStreak}
              highlight={row.member.id === highlightId}
              muted={(floatingTitle && !row.delta) || !row.elo}
            />

            {row.delta && (
              <TableCell className="text-right">
                <span
                  className={cn(
                    "rounded-md border border-border bg-muted px-1 py-0.5 text-sm font-medium text-muted-foreground",
                    row.delta > 0
                      ? "border-green-500 bg-green-500/10 text-green-500"
                      : "border-red-500 bg-red-500/10 text-red-500",
                  )}
                >
                  {row.delta < 0 ? row.delta : `+${row.delta}`}
                </span>
              </TableCell>
            )}

            <EloCell elo={row.elo} spin={pendingMemberIds.includes(row.member.id)} />

            <FloatingCell>
              <HasAccess>
                <MemberActions member={row.member} />
              </HasAccess>
            </FloatingCell>
          </AnimatedRow>
        ))}
        {showAddMember && (
          <HasAccess>
            <AnimatedRow layoutId="add-member">
              <AddNewMember
                circleId={rows[0]?.member.circle_id}
                showTooltip={rows.length < 2}
                leadingCellSize={hasTwoDigitRank ? "w-6" : "w-3"}
              />
            </AnimatedRow>
          </HasAccess>
        )}
      </Table>
    </div>
  )
}

function MemberActions({ member }: { member: MemberStats }) {
  const [dialogContentType, setDialogContentType] = useState<"invite" | "rename" | null>(null)
  const { isPending, execute } = useServerAction(kickMember)

  const isAdmin = !!member.user_id
  const isNew = !member.latest_game

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          tabIndex={-1}
          className={cn(
            "group-hover:opacity-100 sm:opacity-0",
            "hover:text-primary data-[state=open]:text-primary data-[state=open]:opacity-100",
          )}
        >
          <EllipsisVertical size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          {isAdmin && (
            <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground" disabled>
              <ShieldCheck size={14} />
              Circle Owner
            </DropdownMenuItem>
          )}

          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setDialogContentType("rename")}>
              Rename
            </DropdownMenuItem>
          </DialogTrigger>

          {!isAdmin && !isNew && (
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={() => setDialogContentType("invite")}>
                Invite as owner
              </DropdownMenuItem>
            </DialogTrigger>
          )}

          {isNew && !isAdmin && (
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => execute({ id: member.id, circleId: member.circle_id })}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContentType === "invite" && (
        <InviteDialogContent circleId={member.circle_id} memberId={member.id} />
      )}
      {dialogContentType === "rename" && member && (
        <RenameMemberDialogContent
          memberId={member.id}
          circleId={member.circle_id}
          currentName={member.name}
        />
      )}
    </Dialog>
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
        highlight && "text-accent",
        muted && "text-secondary",
        highlight && muted && "text-accent/50",
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
