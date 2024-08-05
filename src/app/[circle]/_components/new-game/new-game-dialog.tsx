"use client"

import Button from "@/components/button/big-button"
import MemberPill from "@/components/member-pill"
import { createGameSession } from "@/server/actions"
import { useState } from "react"
import { useServerAction } from "zsa-react"
import { Member } from "../../../../server/types"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  members: Member[]
  circleId: number
}

type MemberStatus = "none" | "losing" | "wining"

export default function NewGameDialog({ members, circleId }: Props) {
  let [statusMap, setStatusMap] = useState<Record<number, MemberStatus>>({})

  const { isPending, execute } = useServerAction(createGameSession)
  const handleClick = (member: Member) => {
    const prev = statusMap[member.id] || "none"
    const next = ({ none: "losing", losing: "wining", wining: "none" } as const)[prev]
    setStatusMap({ ...statusMap, [member.id]: next })
  }

  const loserIds = members.filter((m) => statusMap[m.id] === "losing").map((m) => m.id)
  const winnerIds = members.filter((m) => statusMap[m.id] === "wining").map((m) => m.id)

  const submit = async () => {
    if (!loserIds.length) return
    if (!winnerIds.length) return

    await execute({ loserIds, winnerIds, circleId })
  }

  const isValid = loserIds.length > 0 && winnerIds.length > 0

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Who&apos;s winning today?</DialogTitle>
        <DialogDescription className="py-4">
          Tap once for <span className="font-bold text-gray-900 dark:text-gray-200">losers</span>,
          twice for <span className="font-bold text-yellow-600">winners</span>
        </DialogDescription>
      </DialogHeader>
      <div className="mx-auto flex max-w-md flex-wrap justify-center gap-2">
        {members.map((m) => (
          <MemberPill
            key={m.id}
            color={
              statusMap[m.id] === "losing"
                ? "highlight"
                : statusMap[m.id] === "wining"
                  ? "golden"
                  : undefined
            }
            onClick={() => handleClick(m)}
          >
            {m.name}
          </MemberPill>
        ))}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button secondary>close</Button>
        </DialogClose>
        <Button disabled={!isValid || isPending} onClick={() => submit()}>
          {isPending ? "adding..." : "add new game"}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
