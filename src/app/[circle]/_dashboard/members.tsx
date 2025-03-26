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
import { MembersWithStats } from "@/server/queries"
import { cn } from "@/utils/tailwind/cn"
import { EllipsisVertical, Loader2, ShieldCheck, Trash2 } from "lucide-react"
import { useMemo } from "react"
import { useServerAction } from "zsa-react"
import { GameWithResults } from "../../../server/types"
import HasAccess from "../_components/has-access"
import Star from "../_components/star"
import InviteDialogContent from "./_components/invite-dialog-content"
import { AnimatedRow, FloatingCell, Table, TableCell } from "./_components/table"
import AddNewMember from "./add-new-member"

type Props = {
  circleId: number
  membersWithStats: MembersWithStats
  recentGames: GameWithResults[]
  onHighlightChange: (id: number) => void
  highlightId: number
  pendingMemberIds: number[]
  selectedGameIndex: number | null
}

export default function Members({
  circleId,
  highlightId,
  onHighlightChange,
  recentGames,
  membersWithStats,
  pendingMemberIds,
  selectedGameIndex,
}: Props) {
  const ownerMembers = membersWithStats.filter((m) => !!m.user_id).map((m) => m.id)

  const winningStreaksByMemberId = useMemo(() => {
    if (!recentGames.length) return {}
    const latestWinners = recentGames.at(0)!.game_results.filter((r) => r.winner)

    const streaksById = Object.fromEntries(latestWinners.map((r) => [r.member_id, 1]))

    let currentStreak = 1
    let maxStreak = 3

    while (true && currentStreak < maxStreak) {
      const game = recentGames.at(currentStreak)
      if (!game) break

      let isMoving = false

      const winners = game.game_results.filter((r) => r.winner)

      if (!winners.length) break

      winners.forEach((r) => {
        if (streaksById[r.member_id] === currentStreak) {
          isMoving = true
          streaksById[r.member_id]++
        }
      })

      if (!isMoving) break
      currentStreak++
    }

    return streaksById
  }, [recentGames])

  const members = membersWithStats.map((m, i) => ({
    id: m.id!,
    name: m.name || "Unknown",
    rank: m.latest_game ? i + 1 : undefined,
    elo: m.latest_game?.elo,
    winningStreak: winningStreaksByMemberId[m.id!],
    isNew: !m.latest_game,
    isPending: pendingMemberIds.includes(m.id!),
  }))

  const hasTwoDigitRank = members.some((m) => m.rank && m.rank > 9)

  return (
    <div className="relative">
      <Table>
        {members.map((member) => (
          <AnimatedRow
            className="group relative"
            key={member.id}
            layoutId={`row-${member.id}`}
            onMouseOver={() => !member.isNew && onHighlightChange(member.id)}
          >
            <RankCell rank={member.rank} wide={hasTwoDigitRank} />
            <NameCell
              name={member.name}
              winStreak={member.winningStreak}
              highlight={member.id === highlightId}
              muted={!!member.isNew}
            />
            <EloCell elo={member.elo} />
            <FloatingCell>
              <HasAccess>
                {ownerMembers.includes(member.id) ? (
                  <CircleOwnerBadge />
                ) : member.isNew ? (
                  <NewMemberActions memberId={member.id} circleId={circleId} />
                ) : (
                  <MemberActions memberId={member.id} circleId={circleId} />
                )}
              </HasAccess>
            </FloatingCell>
          </AnimatedRow>
        ))}
        <HasAccess>
          <AddNewMember
            circleId={circleId}
            showTooltip={membersWithStats.length < 2}
            leadingCellSize={hasTwoDigitRank ? "w-6" : "w-3"}
          />
        </HasAccess>
      </Table>
    </div>
  )
}

function MemberActions({ memberId, circleId }: { memberId: number; circleId: number }) {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          tabIndex={-1}
          className={cn(
            "opacity-0 group-hover:opacity-100",
            "hover:text-primary data-[state=open]:text-primary",
          )}
        >
          <EllipsisVertical size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DialogTrigger>
            <DropdownMenuItem>Invite as owner</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <InviteDialogContent circleId={circleId} memberId={memberId} />
    </Dialog>
  )
}

function NewMemberActions({ memberId, circleId }: { memberId: number; circleId: number }) {
  const { isPending, execute } = useServerAction(kickMember)

  return (
    <button
      className={cn(!isPending && "opacity-0 hover:text-primary group-hover:opacity-100")}
      onClick={() => execute({ id: memberId, circleId })}
    >
      {isPending ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <Trash2 size={16} strokeWidth={1.25} />
      )}
    </button>
  )
}

const CircleOwnerBadge = () => {
  return (
    <Tooltip>
      <TooltipTrigger tabIndex={-1} className="cursor-default opacity-0 group-hover:opacity-100">
        <ShieldCheck size={16} />
      </TooltipTrigger>
      <TooltipContent>Circle Owner</TooltipContent>
    </Tooltip>
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
  winStreak?: number
  highlight: boolean
  muted: boolean
}) {
  return (
    <TableCell
      className={cn(
        "flex-1 items-center overflow-hidden text-ellipsis text-nowrap font-medium text-primary",
        highlight && "text-accent",
        muted && "text-secondary",
      )}
    >
      <span>{name}</span>
      {winStreak ? (
        <Tooltip delayDuration={500}>
          <TooltipTrigger>
            <span className="mx-1 tracking-widest">
              {Array.from({ length: winStreak }, (_, i) => (
                <Star key={i} />
              ))}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {winStreak === 1 ? "won the last game" : `${winStreak} wins in a row`}
          </TooltipContent>
        </Tooltip>
      ) : null}
    </TableCell>
  )
}

function EloCell({ elo }: { elo: number | undefined }) {
  return <TableCell className="w-20 text-right">{elo}</TableCell>
}
