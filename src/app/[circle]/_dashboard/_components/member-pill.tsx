import { cn } from "@/utils/tailwind/cn"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  variant: MemberPillVariant
  selected?: boolean
  onClick?: () => void
}>

export type MemberPillVariant = "selected" | "winning" | "default"

const MemberPill = ({ variant, children, onClick }: Props) => {
  const isSelected = variant === "selected"
  const isWinning = variant === "winning"
  return (
    <div
      onMouseDown={onClick}
      className={cn(
        `-ring-offset-1 inline-block cursor-pointer select-none rounded-full px-4 py-1 font-mono font-light ring-1 ring-neutral-200 transition-colors dark:text-neutral-300`,
        isSelected &&
          `bg-neutral-900 text-white ring-0 ring-transparent hover:bg-neutral-800 dark:bg-neutral-200 dark:text-black dark:hover:bg-neutral-300`,
        isWinning && `bg-accent text-white ring-0 dark:bg-accent dark:text-black`,
      )}
    >
      {children}
    </div>
  )
}

export default MemberPill
