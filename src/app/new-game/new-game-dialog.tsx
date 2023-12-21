"use client"

import Button from "@/components/button/button"
import Dialog from "@/components/dialog/dialog"
import MemberPill from "@/components/member-pill"
import { Tables } from "@/types/supabase"
import { useState } from "react"

type Member = Tables<"circle_members">
type Props = {
  members: Member[]
  onClose: () => void
}

type MemberStatus = "none" | "losing" | "wining"

export default function NewGameDialog({ members, onClose }: Props) {
  let [statusMap, setStatusMap] = useState<Record<number, MemberStatus>>({})

  const handleClick = (member: Member) => {
    const prev = statusMap[member.id] || "none"
    const next = ({ none: "losing", losing: "wining", wining: "none" } as const)[prev]
    setStatusMap({ ...statusMap, [member.id]: next })
  }

  const losingIds = members.filter((m) => statusMap[m.id] === "losing").map((m) => m.id)
  const winningIds = members.filter((m) => statusMap[m.id] === "wining").map((m) => m.id)

  const submit = async () => {
    console.log({ losingIds, winningIds })
    // await createGameSession(memberIds, winnerIds)
  }

  const isValid = losingIds.length > 0 && winningIds.length > 0

  return (
    <Dialog
      title="Who's winning today?"
      subtitle={
        <>
          Tap once for <span className="text-gray-900  font-bold">losers</span>, twice for{" "}
          <span className="text-yellow-600 font-bold">winners</span>
        </>
      }
      content={
        <>
          <div className="flex flex-wrap justify-center max-w-md gap-2 mx-auto">
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
                {m.display_name}
              </MemberPill>
            ))}
          </div>
        </>
      }
      footer={
        <>
          <>
            <Button secondary onClick={onClose}>
              Close
            </Button>
            <Button disabled={!isValid} onClick={() => submit()}>
              Submit
            </Button>
          </>
        </>
      }
      onClose={onClose}
    ></Dialog>
  )
}
