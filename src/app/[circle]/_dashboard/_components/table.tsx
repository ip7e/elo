import { cn } from "@/utils/tailwind/cn"
import { HTMLMotionProps, motion } from "framer-motion"
import { PropsWithChildren } from "react"

type ChildrenWithClassName = PropsWithChildren<{ className?: string }>

export function Table({ children, className }: ChildrenWithClassName) {
  return <div className={cn("flex w-full flex-col", className)}>{children}</div>
}

type TableRowProps = PropsWithChildren<HTMLMotionProps<"div">>
export function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ mass: 10, damping: 100, stiffness: 1000, type: "spring" }}
      className={cn(
        "flex h-8 w-full select-none items-center gap-4 font-mono text-base",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function RankCell({ children, className }: ChildrenWithClassName) {
  return (
    <div className={cn("w-6 text-right text-neutral-300 dark:text-neutral-600", className)}>
      {children}
    </div>
  )
}

export function NameCell({ children, className }: ChildrenWithClassName) {
  return (
    <div
      className={cn(
        "flex-1 overflow-hidden text-ellipsis text-nowrap font-medium text-neutral-900 dark:text-white",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function ScoreCell({ children, className }: ChildrenWithClassName) {
  return (
    <div className={cn("text-right font-medium text-neutral-300 dark:text-white", className)}>
      {children}
    </div>
  )
}
