import { cn } from "@/utils/tailwind/cn"
import { motion } from "framer-motion"
import { PropsWithChildren, useEffect, useRef, useState } from "react"

type Props = PropsWithChildren<{
  variant: MemberPillVariant
  selected?: boolean
  onClick?: () => void
}>

export type MemberPillVariant = "selected" | "winning" | "default"

const MemberPill = ({ variant, children, onClick }: Props) => {
  const isSelected = variant === "selected"
  const isWinning = variant === "winning"
  const prevVariantRef = useRef(variant)
  const [jump, setJump] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    if (variant === "winning" && prevVariantRef.current !== "winning") {
      const r = () => 0.7 + Math.random() * 0.6
      const s = Math.random() > 0.5 ? 1 : -1
      setJump({
        y: [0, -10 * r(), 0, -4 * r(), 0],
        rotate: [0, -4 * s * r(), 4 * s * r(), -2 * s * r(), 0],
        transition: { duration: 0.45 + Math.random() * 0.15, ease: "easeOut" },
      })
    }
    prevVariantRef.current = variant
  }, [variant])

  return (
    <motion.div
      animate={jump ?? {}}
      onAnimationComplete={() => setJump(null)}
      onMouseDown={onClick}
      className={cn(
        `-ring-offset-1 inline-block cursor-pointer select-none rounded-full px-4 py-1 font-mono font-light ring-1 ring-neutral-200 transition-colors dark:text-neutral-300`,
        isSelected &&
          `bg-neutral-900 text-white ring-0 ring-transparent hover:bg-neutral-800 dark:bg-neutral-200 dark:text-black dark:hover:bg-neutral-300`,
        isWinning && `bg-accent text-white ring-0 dark:bg-accent dark:text-black`,
      )}
    >
      {children}
    </motion.div>
  )
}

export default MemberPill
