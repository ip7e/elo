"use client"

import MemberPill, { MemberPillVariant } from "@/app/[circle]/_dashboard/_components/member-pill"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createGameSession } from "@/server/actions"
import { Member } from "@/server/types"
import { motion } from "framer-motion"
import { Swords } from "lucide-react"
import { useEffect, useState } from "react"
import { useServerAction } from "zsa-react"

type Props = {
  members: Member[]
  circleId: number
  onSubmitted: (memberIds: number[]) => void
}

const nextMemberPillVariant = (prev: MemberPillVariant) => {
  const nextMap: Record<MemberPillVariant, MemberPillVariant> = {
    default: "selected",
    selected: "winning",
    winning: "default",
  }
  return nextMap[prev]
}

export function AddNewGameDialog({ members, circleId, onSubmitted }: Props) {
  let [open, setOpen] = useState(false)
  let [statusMap, setStatusMap] = useState<Record<number, MemberPillVariant>>({})

  const handleClick = (member: Member) => {
    const prev = statusMap[member.id] || "default"
    const next = nextMemberPillVariant(prev)
    setStatusMap({ ...statusMap, [member.id]: next })
  }

  const loserIds = members.filter((m) => statusMap[m.id] === "selected").map((m) => m.id)
  const winnerIds = members.filter((m) => statusMap[m.id] === "winning").map((m) => m.id)

  const { isPending, execute } = useServerAction(createGameSession)

  const isFormValid = loserIds.length > 0 && winnerIds.length > 0

  useEffect(() => {
    !open && setStatusMap({})
  }, [open])

  if (members.length < 2) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="rounded-full" variant="accent" disabled={isPending}>
          <Swords size={16} className="mr-2" />
          New Game
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form
          action="#"
          onSubmit={async (e) => {
            e.preventDefault()
            execute({ loserIds, winnerIds, circleId })
            onSubmitted(loserIds.concat(winnerIds))
            setOpen(false)
          }}
        >
          <DialogHeader>
            <DialogTitle className="mt-8 text-center">Who&apos;s winning today?</DialogTitle>
            <DialogDescription className="py-4 text-center">
              Tap once for{" "}
              <span className="font-bold text-gray-900 dark:text-gray-200">losers</span>, twice for{" "}
              <span className="font-bold text-accent">winners</span>
            </DialogDescription>
          </DialogHeader>

          <div className="mx-auto my-8 flex max-w-md flex-wrap justify-center gap-2">
            {members.map((m, i) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.02 } }}
              >
                <MemberPill
                  key={m.id}
                  onClick={() => handleClick(m)}
                  variant={statusMap[m.id] ?? "default"}
                >
                  {m.name}
                </MemberPill>
              </motion.div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size={"sm"} tabIndex={-1}>
                Close
              </Button>
            </DialogClose>
            <Button
              variant="default"
              size={"sm"}
              tabIndex={-1}
              type="submit"
              disabled={!isFormValid || isPending}
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
