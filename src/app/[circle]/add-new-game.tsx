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
      className={`inline-block py-1 px-4 text-lg font-semibold border border-gray-900 rounded-full cursor-pointer 
      ${
        selected
          ? "bg-gray-900 text-white hover:bg-gray-800"
          : "hover:bg-gray-200"
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

  const togglePlayingMember = (m: Member) =>
    playingMembers.includes(m)
      ? setPlayingMembers(playingMembers.filter((p) => p.id !== m.id))
      : setPlayingMembers([...playingMembers, m])

  const chooseMembers = (
    <div className="flex flex-wrap justify-center max-w-md gap-2 mx-auto ">
      {members.map((m) => (
        <Bubble
          key={m.id}
          selected={playingMembers.includes(m)}
          onClick={() => togglePlayingMember(m)}
        >
          {m.display_name}
        </Bubble>
      ))}
    </div>
  )

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <Button onClick={openModal}>New game session</Button>
      </div>

      <Dialog
        isOpen={isOpen}
        title="Choose who's playing?"
        content={chooseMembers}
        footer={
          <>
            <Button secondary onClick={closeModal}>
              Close
            </Button>
            <Button onClick={closeModal}>Submit</Button>
          </>
        }
        onClose={closeModal}
      ></Dialog>
    </>
  )
}
