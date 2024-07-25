"use client"

import { useRef, useState } from "react"
import { Circle } from "../types"
import { kickMember } from "./_actions/kick-member.action"
import { addMember } from "./_actions/add-member.action"

type Props = {
  members: {
    id: number
    name: string
    total_games: number
  }[]
  circle: Circle
}

export default function ControlClient({ circle, members }: Props) {
  const [optimisticMembers, setOptimisticMembers] = useState(members)
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleAddMember = async () => {
    const name = inputRef.current?.value
    if (!name) return

    const randomId = Math.random() * 10
    const draftMember = { id: randomId, total_games: 0, name: name }
    setOptimisticMembers([...optimisticMembers, draftMember])

    const { data: addedMember } = await addMember({
      name,
      circleId: circle.id,
    })

    if (addedMember) {
      setOptimisticMembers([...optimisticMembers, { ...draftMember, id: addedMember.id }])
    }
    formRef.current?.reset()
  }

  const handleKickMember = async (id: number) => {
    const confirm = window.confirm("Are you sure you want to kick member?")
    if (!confirm) return
    setOptimisticMembers([...optimisticMembers].filter((member) => member.id !== id))
    await kickMember({ id })
  }

  return (
    <div className="mt-16 flex gap-4 p-8">
      <div className="flex w-full">
        <div className="w-32">
          <h2 className="font-light text-gray-400">Members</h2>
        </div>

        <div className="flex w-full flex-1 flex-col gap-3">
          {optimisticMembers.map((member) => (
            <div className="flex w-full items-center justify-between" key={member.id}>
              <div className="flex flex-col">
                <span className="font-semibold text-black dark:text-white">{member.name}</span>
                <span className="text-sm font-light text-gray-400">{member.total_games} games</span>
              </div>
              <div>
                {!member.total_games && (
                  <button
                    className="h-8 rounded-md bg-accent px-4 text-white dark:text-black"
                    onClick={() => handleKickMember(member.id)}
                  >
                    kick
                  </button>
                )}
              </div>
            </div>
          ))}

          <form action={handleAddMember} ref={formRef} className="flex flex-row gap-2">
            <input
              ref={inputRef}
              className="h-8 flex-1 appearance-none rounded-md border-none bg-white/30 px-2 outline outline-offset-0 outline-gray-300 transition-all focus:outline-offset-0 focus:outline-gray-500 dark:bg-white/10 dark:text-white dark:outline-white/20 dark:focus:outline-white/50"
            />

            <button
              className="h-8 rounded-md bg-accent px-4 text-white dark:text-black"
              type="submit"
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>

    // <div className="mt-10 flex flex-col gap-3 max-w-md mx-auto">
    //   <h3 className="text-center font-light dark:text-gray-300">Members</h3>

    //   {optimisticStats.map((member, i) => (
    //     <div className="flex gap-5 w-full justify-between group dark:text-gray-200" key={member.id}>
    //       <span className="text-lg font-bold ">{member.name}</span>{" "}
    //       <div className="flex gap-2">
    //         {!member.total_games && (
    //           <button
    //             className="text-white px-4 bg-accent rounded-md dark:text-black"
    //             onClick={() => handleKickMember(member.id)}
    //           >
    //             kick
    //           </button>
    //         )}

    //         <span className="italic opacity-30">{member.total_games} games</span>
    //       </div>
    //     </div>
    //   ))}

    //   <div className="flex flex-row gap-2">
    //     <input
    //       ref={inputRef}
    //       className="appearance-none
    //           flex-1
    //           px-2 h-8
    //           border-none
    //           rounded-md
    //           outline-offset-0
    //           outline
    //           outline-gray-300
    //           focus:outline-gray-500
    //           focus:outline-offset-0
    //           bg-white/30
    //           transition-all

    //           dark:text-white
    //           dark:bg-white/10
    //           dark:outline-white/20
    //           dark:focus:outline-white/50
    //           "
    //     />

    //     <button
    //       className="text-white px-4 h-8 bg-accent rounded-md dark:text-black"
    //       onClick={handleAddMember}
    //     >
    //       Add member
    //     </button>
    //   </div>
    // </div>
  )
}
