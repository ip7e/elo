"use client"

import Button from "@/components/button/big-button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Member } from "../../../../server/types"
import NewGameDialog from "./new-game-dialog"

type Props = {
  members: Member[]
  circleId: number
}

export default function NewGameOpener({ members, circleId }: Props) {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center justify-center">new game</DialogTrigger>

      <NewGameDialog circleId={circleId} members={members} />
    </Dialog>
  )
}
