"use client"

import Button from "@/components/button/big-button"
import { useState } from "react"
import { Member } from "../../../../server/types"
import NewGameDialog from "./new-game-dialog"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"

type Props = {
  members: Member[]
  circleId: number
}

export default function NewGameOpener({ members, circleId }: Props) {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center justify-center">
        <Button>new game</Button>
      </DialogTrigger>

      <NewGameDialog circleId={circleId} members={members} />
    </Dialog>
  )
}
