import { cn } from "@/utils/tailwind/cn"
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion"
import { PropsWithChildren } from "react"

type ChildrenWithClassName = PropsWithChildren<{ className?: string }>

export function Table({ children, className }: ChildrenWithClassName) {
  return (
    <div className={cn("flex w-full flex-col", className)}>
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </div>
  )
}

type TableRowProps = PropsWithChildren<HTMLMotionProps<"div">>
export function TableRow({ children, className, ...props }: TableRowProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
      transition={{ mass: 10, damping: 100, stiffness: 500, type: "spring" }}
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

export function LeadingCell({ children, className }: ChildrenWithClassName) {
  return (
    <div className={cn("w-6 text-right text-neutral-300 dark:text-neutral-500", className)}>
      {children}
    </div>
  )
}

export function MiddleCell({ children, className }: ChildrenWithClassName) {
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

export function TrailingCell({ children, className }: ChildrenWithClassName) {
  return (
    <div className={cn("text-right font-medium text-neutral-300 dark:text-neutral-400", className)}>
      {children}
    </div>
  )
}
