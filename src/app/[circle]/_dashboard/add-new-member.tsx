"use client"

import { cn } from "@/utils/tailwind/cn"
import { CornerDownLeft, Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { addMember } from "../control/_actions/add-member.action"
import { useClickedOutside } from "@/app/hooks/use-clicked-outside"
import { NameCell, RankCell, TableRow } from "./_components/table"

// TODO: circle id via context maybe?
export default function AddNewMember({ circleId }: { circleId: number }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")

  useClickedOutside(formRef, () => setIsActive(false))

  useEffect(() => {
    if (!isActive) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsActive(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [isActive])

  const activate = () => {
    setIsActive(true)
    setName("")
  }

  const nameIsValid = name.length > 1 && name.length < 20

  const handleSubmit = async () => {
    if (!nameIsValid) return

    setIsLoading(true)
    await addMember({ name, circleId: circleId })
    setIsLoading(false)
    setName("")
  }

  return (
    <TableRow>
      <RankCell className="flex w-6 justify-end">
        <button
          className={cn(
            "flex size-5 translate-x-[5px] items-center justify-center rounded-md transition-opacity",
            "text-neutral-400 dark:text-neutral-400",
            "hover:border hover:border-neutral-300 dark:hover:border-neutral-600",
            isActive && "opacity-0",
          )}
          onClick={() => activate()}
        >
          <Plus size={12} strokeWidth={1} />
        </button>
      </RankCell>
      {isActive && (
        <NameCell>
          <form className="flex w-full gap-2" action={handleSubmit} ref={formRef}>
            <input
              className={cn(
                "w-full appearance-none bg-transparent bg-none outline-none placeholder:italic",
                "caret-neutral-800 dark:caret-neutral-200",
                "placeholder:text-neutral-300 dark:placeholder:text-neutral-500",
                "text-neutral-400 dark:text-neutral-400",
              )}
              placeholder="type name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className={cn(
                "flex size-5 items-center justify-center rounded-md transition-colors",
                "text-neutral-300 dark:text-neutral-500",
                nameIsValid && "text-neutral-600 dark:text-neutral-300",
              )}
              type="submit"
            >
              <CornerDownLeft size={16} strokeWidth={1.25} />
            </button>
          </form>
        </NameCell>
      )}
    </TableRow>
  )
}
