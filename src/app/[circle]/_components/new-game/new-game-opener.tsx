"use client"

import Button from "@/components/button/big-button"
import { useState } from "react"
import { Member } from "../../../../server/types"
import NewGameDialog from "./new-game-dialog"

type Props = {
  members: Member[]
  circleId: number
}

export default function NewGameOpener({ members, circleId }: Props) {
  let [isOpen, setIsOpen] = useState(false)

  const openModal = () => setIsOpen(true)

  return (
    <>
      <div className="flex items-center justify-center">
        <Button onClick={openModal}>new game</Button>
      </div>

      {isOpen && (
        <NewGameDialog circleId={circleId} members={members} onClose={() => setIsOpen(false)} />
      )}
    </>
  )
}
