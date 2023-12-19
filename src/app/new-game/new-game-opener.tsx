"use client"

import Button from "@/components/button/button"
import { Tables } from "@/types/supabase"
import { useState } from "react"
import NewGameDialog from "./new-game-dialog"

type Member = Tables<"circle_members">

type Props = {
  members: Member[]
}

export default function NewGameOpener({ members }: Props) {
  let [isOpen, setIsOpen] = useState(false)

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  return (
    <>
      <div className="flex items-center justify-center">
        <Button onClick={openModal}>New game session</Button>
      </div>

      {isOpen && <NewGameDialog members={members} onClose={closeModal}></NewGameDialog>}
    </>
  )
}
