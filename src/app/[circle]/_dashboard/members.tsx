"use client"

import { kickMember } from "@/server/actions"
import { cn } from "@/utils/tailwind/cn"
import { EllipsisVertical, Info, Trash2 } from "lucide-react"
import { useState } from "react"
import { Member, MemberStats } from "../../../server/types"
import HasAccess from "../_components/has-access"
import Star from "../_components/star"
import { MiddleCell, LeadingCell, TrailingCell, Table, TableRow } from "./_components/table"
import AddNewMember from "./add-new-member"
import { useServerAction } from "zsa-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@headlessui/react"

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
          className="group relative"
          key={member_id}
          layoutId={"member-" + member_id}
          onMouseEnter={() => onHighlightChange(member_id!)}
        >
          <LeadingCell>{i + 1}</LeadingCell>
          <MiddleCell className={cn(highlightId === member_id && "text-accent dark:text-accent")}>
            {name}
            <span className="mx-1 tracking-widest">
              {Array.from({ length: winsByMemberId[member_id!] }, (v, i) => (
                <Star key={i} />
              ))}
            </span>
          </MiddleCell>
          <TrailingCell>{elo}</TrailingCell>

          <HasAccess>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "absolute -right-5 text-neutral-300 outline-none",
                    "opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100",
                    "hover:text-neutral-600 data-[state=open]:text-neutral-600",
                  )}
                >
                  <EllipsisVertical size={16} />
                  {/* <ShieldCheck size={16} /> */}
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="font-sans">
                  <DialogTrigger>
                    <DropdownMenuItem>Invite as owner</DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className="font-sans">
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                </DialogHeader>

                <DialogDescription>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <label className="block">
                      <input
                        className="bg-background mt-1 block w-full rounded-md border-neutral-300 px-3 py-2 text-base outline-none placeholder:text-neutral-300 focus:border-accent focus:ring-accent dark:border-neutral-600 dark:bg-black dark:placeholder:text-neutral-700"
                        placeholder="Enter email"
                      />
                    </label>
                  </form>
                </DialogDescription>

                <DialogFooter>
                  <Button type="submit">Invite</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </HasAccess>
        </TableRow>
      ))}
      {newMembers.map((m) => (
        <NewMemberRow member={m} key={m.id} circleId={circleId} />
      ))}

      <HasAccess>
        <AddNewMember circleId={circleId} />
      </HasAccess>
    </Table>
  )
}

const NewMemberRow = ({ member: m, circleId }: { member: Member; circleId: number }) => {
  const { isPending, execute } = useServerAction(kickMember)
  const [hovered, setHovered] = useState(false)

  return (
    <TableRow
      className={cn("group", isPending && "animate-pulse")}
      key={m.id}
      layoutId={"member-" + m.id}
    >
      <LeadingCell className="text-sm text-neutral-200 dark:text-neutral-600">{"?"}</LeadingCell>
      <MiddleCell
        className={cn(
          "text-neutral-300 transition-all dark:text-neutral-600",
          (hovered || isPending) && "text-neutral-400 line-through dark:text-neutral-400",
        )}
      >
        {m.name}
      </MiddleCell>
      <HasAccess>
        <TrailingCell className="text-neutral-300 dark:text-neutral-500">
          <button
            className="flex cursor-default items-center justify-center rounded-md opacity-0 transition-colors hover:text-neutral-800 group-hover:opacity-100 dark:hover:text-neutral-200"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => execute({ id: m.id, circleId })}
          >
            <Trash2 size={16} strokeWidth={1.25} />
          </button>
        </TrailingCell>
      </HasAccess>
    </TableRow>
  )
}
