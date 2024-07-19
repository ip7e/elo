import { cn } from "@/utils/tailwind/cn"
import { motion } from "framer-motion"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  color?: "highlight" | "golden" | null
  selected?: boolean
  onClick?: () => void
}>

const MemberPill = ({ color, children, onClick }: Props) => {
  return (
    <motion.div
      onMouseDown={onClick}
      className={cn(
        `inline-block cursor-pointer select-none rounded-full px-4 py-1 font-mono font-light`,
        color === "highlight" &&
          `bg-neutral-900 text-white ring-neutral-900 hover:bg-neutral-800 dark:bg-neutral-200 dark:text-black dark:ring-neutral-200 dark:hover:bg-neutral-300`,
        color === "golden" &&
          `ring-accent", bg-accent text-white dark:bg-neutral-200 dark:text-black`,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  )
}

export default MemberPill
