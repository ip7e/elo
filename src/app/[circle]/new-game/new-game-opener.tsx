"use client"

import Button from "@/components/button/button"
import { useState } from "react"
import { Member } from "../types"

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
        <div className="fixed inset-0 flex items-center justify-center bg-black">
          <div className="relative w-96 bg-white rounded-lg">yoo</div>
        </div>
      )}
    </>
  )
}
