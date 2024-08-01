"use client"

import useClickedOutside from "@/app/hooks/useClickedOutside"
import { addMember } from "@/server/actions"
import { cn } from "@/utils/tailwind/cn"
import { CornerDownLeft, Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useServerAction } from "zsa-react"
import { NameCell, RankCell, TableRow } from "./_components/table"

const placeholderTexts = [
  "add a member",
  "another one",
  "and one more",
  "one more",
  "big group ha?",
  "you go",
  "enough, huh?",
  "add more",
]

// TODO: circle id via context maybe?
export default function AddNewMember({ circleId }: { circleId: number }) {
  const formRef = useRef<HTMLFormElement>(null)

  const [isActive, setIsActive] = useState(false)
  const [name, setName] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const placeholder = placeholderTexts[placeholderIndex]

  const { isPending, execute } = useServerAction(addMember)

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
    setPlaceholderIndex(0)
  }

  const nameIsValid = name.length > 1 && name.length < 20

  return (
    <TableRow className={cn(isPending && "animate-pulse")}>
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
          <form
            className="flex w-full gap-2"
            onSubmit={async (e) => {
              e.preventDefault()
              await execute({ name, circle_id: circleId })
              setName("")
              setPlaceholderIndex((i) => Math.min(i + 1, placeholderTexts.length - 1))
            }}
            ref={formRef}
          >
            <input
              className={cn(
                "w-full appearance-none bg-transparent bg-none outline-none placeholder:italic",
                "caret-neutral-800 dark:caret-neutral-200",
                "text-neutral-400 dark:text-neutral-400",
                "placeholder:text-neutral-300 dark:placeholder:text-neutral-700",
              )}
              placeholder={placeholder}
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className={cn(
                "flex size-5 items-center justify-center rounded-md transition-colors",
                "text-neutral-300 dark:text-neutral-500",
                nameIsValid && !isPending && "text-neutral-600 dark:text-neutral-300",
              )}
              type="submit"
              disabled={isPending}
            >
              <CornerDownLeft size={16} strokeWidth={1.25} />
            </button>
          </form>
        </NameCell>
      )}
    </TableRow>
  )
}
