"use client"

import { useRef, useState } from "react"
import { Circle, MemberStats } from "../types"
import { addMember } from "./add-member.action"
import { kickMember } from "./kick-member.action"

type Props = {
  members: {
    id: number
    name: string
    total_games: number
  }[]
  circle: Circle
}

export default function ControlClient({ circle, members }: Props) {
  const [optimisticStats, setOptimisticStats] = useState(members)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAddMember = async () => {
    const name = inputRef.current?.value
    if (!name) return

    const randomId = Math.random() * 10
    const draftMember = { id: randomId, total_games: 0, name: name }
    setOptimisticStats([...optimisticStats, draftMember])

    const { data: addedMember } = await addMember({
      name,
      circleId: circle.id,
    })

    if (addedMember) {
      setOptimisticStats([...optimisticStats, { ...draftMember, id: addedMember.id }])
    }
  }

  const handleKickMember = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to kick member?")
    if (!confirm) return
    setOptimisticStats([...optimisticStats].filter((member) => member.id !== id))
    await kickMember({ id })
  }

  return (
    <div className="mt-10 flex flex-col gap-3 max-w-md mx-auto">
      <h3 className="text-center font-light dark:text-gray-300">Members</h3>

      {optimisticStats.map((member, i) => (
        <div className="flex gap-5 w-full justify-between group dark:text-gray-200" key={member.id}>
          <span className="text-lg font-bold ">{member.name}</span>{" "}
          <div className="flex gap-2">
            {!member.total_games && (
              <button
                className="text-white px-4 bg-accent rounded-md dark:text-black"
                onClick={() => handleKickMember(member.id)}
              >
                kick
              </button>
            )}

            <span className="italic opacity-30">{member.total_games} games</span>
          </div>
        </div>
      ))}

      <div className="flex flex-row gap-2">
        <input
          ref={inputRef}
          className="appearance-none
              flex-1
              px-2 h-8
              border-none
              rounded-md
              outline-offset-0
              outline
              outline-gray-300
              focus:outline-gray-500 
              focus:outline-offset-0
              bg-white/30
              transition-all

              dark:text-white
              dark:bg-white/10
              dark:outline-white/20
              dark:focus:outline-white/50
              "
        />

        <button
          className="text-white px-4 h-8 bg-accent rounded-md dark:text-black"
          onClick={handleAddMember}
        >
          Add member
        </button>
      </div>
    </div>
  )
}
