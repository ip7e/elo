"use client"

import Button from "@/components/button/button"
import Dialog from "@/components/dialog/dialog"
import { Tables } from "@/types/supabase"
import { HTMLAttributes, PropsWithChildren, useState } from "react"

type Member = Tables<"circle_members">
type Props = {
  members: Member[]
}

const Bubble = ({
  selected,
  children,
  ...props
}: PropsWithChildren<{ selected?: boolean }> &
  HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={`inline-block p-2 px-4 font-bold border border-gray-900 rounded-full cursor-pointer 
      ${
        selected
          ? "bg-gray-900 text-white hover:bg-gray-800"
          : "hover:bg-gray-900 hover:text-white"
      }`}
      {...props}
    >
      {children}
    </span>
  )
}

export default function MyModal({ members }: Props) {
  let [winningMembers, setWinningMembers] = useState<Member[]>([])
  let [playingMembers, setPlayingMembers] = useState<Member[]>([])

  let [isOpen, setIsOpen] = useState(true)

  const closeModal = () => setIsOpen(false)
  const openModal = () => setIsOpen(true)

  console.log(playingMembers)
  const chooseMembers = (
    <div className="flex justify-center w-full gap-2 py-10">
      {members.map((m) => (
        <Bubble
          key={m.id}
          selected={playingMembers.includes(m)}
          onClick={() => {
            console.log("hi")
            if (playingMembers.includes(m)) {
              setPlayingMembers(playingMembers.filter((p) => p.id !== m.id))
            } else {
              setPlayingMembers([...playingMembers, m])
            }
          }}
        >
          {m.display_name}
        </Bubble>
      ))}
    </div>
  )

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <Button type="button" onClick={openModal}>
          Open dialog
        </Button>
      </div>

      <Dialog
        isOpen={isOpen}
        title={<div className="text-center">Who&apos;s playing?</div>}
        content={chooseMembers}
        footer={<Button onClick={closeModal}>Close</Button>}
        onClose={closeModal}
      ></Dialog>
    </>
  )
}
