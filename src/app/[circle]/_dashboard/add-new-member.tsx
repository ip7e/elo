"use client"

import { addMember } from "@/server/actions"
import { cn } from "@/utils/tailwind/cn"
import { CornerDownLeft } from "lucide-react"
import { useRef, useState } from "react"
import { useServerAction } from "zsa-react"
import { TableCell } from "./_components/table"

const placeholderTexts = [
  "add member",
  "add member",
  "add another",
  "add more",
  "more friends",
  "who's next?",
  "one more",
  "still going?",
  "another one?",
  "enough?",
  "how many more?",
  "seriously?",
  "stop already!",
  "too many!",
]

type Props = {
  circleId: number
  leadingCellSize?: string
  onMemberAdded?: (id: number) => void
  onClose: () => void
}

export default function AddNewMember({
  circleId,
  leadingCellSize,
  onMemberAdded,
  onClose,
}: Props) {
  const [name, setName] = useState("")
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const placeholder = placeholderTexts[placeholderIndex]

  const { isPending, execute } = useServerAction(addMember)

  const nameIsValid = name.length > 1 && name.length < 20

  return (
    <>
      <TableCell className={cn("h-full", leadingCellSize)} />
      <TableCell className="flex-1">
        <form
          className="flex w-full gap-2"
          onSubmit={async (e) => {
            e.preventDefault()
            if (!nameIsValid) return
            const [result] = await execute({ name, circleId })
            if (result?.data?.id) {
              onMemberAdded?.(result.data.id)
            }
            setPlaceholderIndex((i) => Math.min(i + 1, placeholderTexts.length - 1))
            setName("")
            inputRef.current?.focus()
          }}
        >
          <input
            ref={inputRef}
            className={cn(
              "w-full appearance-none bg-transparent bg-none outline-none placeholder:italic",
              "caret-secondary",
              "text-accent",
              "placeholder:text-muted",
            )}
            placeholder={placeholder}
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={onClose}
            onKeyDown={(e) => { if (e.key === "Escape") onClose() }}
          />
          <button
            className={cn(
              "flex size-5 items-center justify-center rounded-md transition-colors",
              "text-neutral-300 dark:text-neutral-500",
              nameIsValid && "text-neutral-600",
              isPending && "dark:text-neutral-300",
            )}
            type="submit"
            disabled={isPending}
            onMouseDown={(e) => e.preventDefault()}
          >
            <CornerDownLeft size={16} strokeWidth={1.25} />
          </button>
        </form>
      </TableCell>
    </>
  )
}
