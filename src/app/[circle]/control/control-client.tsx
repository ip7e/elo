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
      // setOptimisticStats([...optimisticStats, { ...draftMember, id: addedMember.id }])
    }
  }

  const handleKickMember = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to kick member?")
    if (!confirm) return
    setOptimisticStats([...optimisticStats].filter((member) => member.id !== id))
    await kickMember({ id })
  }

  return (
    <div className="mt-10 flex flex-col gap-3">
      <h3 className="text-center dark:text-white">Circle Members</h3>

      {optimisticStats.map((member, i) => (
        <div className="flex gap-5 w-full justify-between group dark:text-gray-200" key={member.id}>
          <div>
            <span className="text-lg font-bold ">{member.name}</span>{" "}
            <span className="italic opacity-30">{member.total_games} games</span>
          </div>

          <div>
            {!member.total_games && (
              <button
                className="text-white px-4 bg-accent rounded-md dark:text-black"
                onClick={() => handleKickMember(member.id)}
              >
                kick
              </button>
            )}
            {/* 
            <button className="text-white px-2 bg-gray-300 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button> */}
          </div>
        </div>
      ))}

      <div className="flex mt-2 gap-2 justify-end">
        <div className="flex flex-row gap-2">
          <input
            ref={inputRef}
            className="appearance-none px-2 h-8
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
    </div>
  )
}
