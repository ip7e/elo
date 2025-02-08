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
import { EllipsisVertical, ShieldCheck, Trash2 } from "lucide-react"
import { useMemo } from "react"
import { useServerAction } from "zsa-react"
import { GameWithResults } from "../../../server/types"
import HasAccess from "../_components/has-access"
import InviteDialogContent from "./_components/invite-dialog-content"
import AddNewMember from "./add-new-member"
import { MembersTable, MemberRowData } from "@/app/_components/members-table/members-table"

type Props = {
  circleId: number
  membersWithStats: MembersWithStats
  recentGames: GameWithResults[]
  onHighlightChange: (id: number) => void
  highlightId: number
  pendingMemberIds: number[]
}

export default function Members({
  circleId,
  highlightId,
  onHighlightChange,
  recentGames,
  membersWithStats,
  pendingMemberIds,
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

  const members: MemberRowData[] = membersWithStats.map((m, i) => ({
    id: m.id!,
    name: m.name || "Unknown",
    rank: m.latest_game ? i + 1 : undefined,
    elo: m.latest_game?.elo,
    winningStreak: winningStreaksByMemberId[m.id!],
    isNew: !m.latest_game,
    isPending: pendingMemberIds.includes(m.id!),
  }))

  return (
    <div className="relative">
      <MembersTable
        members={members}
        highlightId={highlightId}
        onHighlightChange={onHighlightChange}
        renderActions={(member) => (
          <HasAccess>
            {ownerMembers.includes(member.id) ? (
              <Tooltip>
                <TooltipTrigger
                  tabIndex={-1}
                  className={cn(
                    "absolute -right-6 pl-2 text-neutral-300 outline-none",
                    "opacity-0 transition-opacity group-hover:opacity-100",
                    "cursor-default dark:text-neutral-700",
                  )}
                >
                  <ShieldCheck size={16} />
                </TooltipTrigger>
                <TooltipContent>Owner</TooltipContent>
              </Tooltip>
            ) : member.isNew ? (
              <NewMemberActions memberId={member.id} circleId={circleId} />
            ) : (
              <MemberActions memberId={member.id} circleId={circleId} />
            )}
          </HasAccess>
        )}
      />

      <HasAccess>
        <div className={cn("absolute -bottom-8 w-full")}>
          <AddNewMember
            circleId={circleId}
            showTooltip={membersWithStats.length < 2}
            leadingCellSize={membersWithStats.length > 9 ? "w-6" : "w-3"}
          />
        </div>
      </HasAccess>
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
            "absolute -right-6 pl-2 text-neutral-300 outline-none",
            "opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100",
            "hover:text-neutral-600 data-[state=open]:text-neutral-600 dark:text-neutral-600 dark:hover:text-neutral-300 dark:data-[state=open]:text-neutral-300",
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
      className="absolute right-0 flex cursor-default items-center justify-center rounded-md pl-2 text-neutral-300 opacity-0 transition-colors hover:text-neutral-800 group-hover:opacity-100 dark:text-neutral-500 dark:hover:text-neutral-200"
      onClick={() => execute({ id: memberId, circleId })}
    >
      <Trash2 size={16} strokeWidth={1.25} />
    </button>
  )
}
