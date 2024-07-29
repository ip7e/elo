"use client"

import { cn } from "@/utils/tailwind/cn"
import { CornerDownLeft, Plus } from "lucide-react"
import { useEffect, useState } from "react"

export default function AddNewMember() {
  const [isActive, setIsActive] = useState(false)
  const [name, setName] = useState("")

  useEffect(() => {
    if (!isActive) return
    const onKeyDown = (e: KeyboardEvent) => {
      console.log(e)
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

  return (
    <div
      className={cn(
        "flex h-7 w-full items-center gap-4 font-mono text-base text-neutral-300 transition-opacity duration-300 group-hover:opacity-100 group-hover:delay-0",
        !isActive && "opacity-100 delay-500",
      )}
    >
      <div className="flex w-6 justify-end text-neutral-500 dark:text-neutral-600">
        <button
          className={cn(
            "border-1 flex size-5 translate-x-[5px] items-center justify-center rounded-md transition-opacity hover:border hover:border-neutral-300",
            isActive && "opacity-0",
          )}
          onClick={() => activate()}
        >
          <Plus size={12} strokeWidth={1} />
        </button>
      </div>
      {isActive && (
        <div className="flex flex-1 items-center gap-2">
          <input
            className="h-6 w-full appearance-none bg-transparent bg-none text-neutral-600 caret-neutral-800 outline-none placeholder:italic placeholder:text-neutral-300"
            placeholder="type name"
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className={cn(
              "flex size-5 items-center justify-center rounded-md",
              "text-neutral-300 transition-colors",
              nameIsValid && "text-neutral-600",
            )}
          >
            <CornerDownLeft size={16} strokeWidth={1.25} />
          </button>
        </div>
      )}
    </div>
  )
}
