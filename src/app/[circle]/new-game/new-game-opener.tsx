"use client"

import Button from "@/components/button/button"
import { Tables } from "@/types/supabase"
import { useState } from "react"
import NewGameDialog from "./new-game-dialog"

type Member = Tables<"circle_members">

type Props = {
  members: Member[]
  circleId: number
}

export default function NewGameOpener({ members, circleId }: Props) {
  let [isOpen, setIsOpen] = useState(false)

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  // const { data: allMembers } = await supabase.from("circle_members").select("*")

  return (
    <>
      <div className="flex items-center justify-center">
        <Button onClick={openModal}>new game</Button>
      </div>

      {isOpen && (
        <NewGameDialog members={members} onClose={closeModal} circleId={circleId}></NewGameDialog>
      )}
    </>
  )
}
