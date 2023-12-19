"use client"

import { createGameSession } from "@/app/queries/get-members"
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

const steps = ["choose-members", "choose-winners"] as const

type Step = (typeof steps)[number]

export default function NewGameDialog({ members, onClose }: Props) {
  const [currentStep, setCurrentStep] = useState<Step>("choose-members")

  let [winningMembers, setWinningMembers] = useState<Member[]>([])
  let [playingMembers, setPlayingMembers] = useState<Member[]>([])

  const togglePlayingMember = (m: Member) =>
    playingMembers.includes(m)
      ? setPlayingMembers(playingMembers.filter((p) => p.id !== m.id))
      : setPlayingMembers([...playingMembers, m])

  const toggleWinningMember = (m: Member) =>
    winningMembers.includes(m)
      ? setWinningMembers(winningMembers.filter((p) => p.id !== m.id))
      : setWinningMembers([...winningMembers, m])

  const submit = async () => {
    const memberIds = playingMembers.map((m) => m.id)
    const winnerIds = winningMembers.map((m) => m.id)

    await createGameSession(memberIds, winnerIds)
  }

  return (
    <Dialog
      title="Choose who's playing?"
      content={
        <>
          {currentStep === "choose-members" && (
            <div className="flex flex-wrap justify-center max-w-md gap-2 mx-auto">
              {members.map((m) => (
                <MemberPill
                  key={m.id}
                  color={playingMembers.includes(m) ? "highlight" : undefined}
                  onClick={() => togglePlayingMember(m)}
                >
                  {m.display_name}
                </MemberPill>
              ))}
            </div>
          )}

          {currentStep === "choose-winners" && (
            <div className="flex flex-wrap justify-center max-w-md gap-2 mx-auto">
              {playingMembers.map((m) => (
                <MemberPill
                  key={m.id}
                  color={winningMembers.includes(m) ? "golden" : "highlight"}
                  onClick={() => toggleWinningMember(m)}
                >
                  {m.display_name}
                </MemberPill>
              ))}
            </div>
          )}
        </>
      }
      footer={
        <>
          {currentStep === "choose-members" && (
            <>
              <Button secondary onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => setCurrentStep("choose-winners")}>
                Submit
              </Button>
            </>
          )}

          {currentStep === "choose-winners" && (
            <>
              <Button
                secondary
                onClick={() => setCurrentStep("choose-members")}
              >
                Back
              </Button>
              <Button onClick={submit}>Submit</Button>
            </>
          )}
        </>
      }
      onClose={onClose}
    ></Dialog>
  )
}
