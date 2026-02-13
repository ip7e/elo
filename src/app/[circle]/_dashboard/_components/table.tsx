import { cn } from "@/utils/tailwind/cn"
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion"
import { PropsWithChildren } from "react"

type ChildrenWithClassName = PropsWithChildren<{ className?: string }>

export function Table({ children, className }: ChildrenWithClassName) {
  return (
    <div className={cn("relative flex w-full flex-col", className)}>
      <AnimatePresence initial={false}>{children}</AnimatePresence>
    </div>
  )
}

export function AnimatedRow({
  children,
  className,
  ...props
}: PropsWithChildren<HTMLMotionProps<"div">>) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: 10, transition: { duration: 0.1 } }}
      transition={{ mass: 10, damping: 100, stiffness: 500, type: "spring" }}
      className={cn(
        "relative flex h-8 w-full select-none items-center gap-4 font-mono text-base",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function TableCell({ children, className }: ChildrenWithClassName) {
  return <div className={cn("text-secondary", className)}>{children}</div>
}

export function FloatingCell({ children, className }: ChildrenWithClassName) {
  return (
    <div
      className={cn(
        "flex cursor-default items-center justify-center rounded-md pl-2 text-muted transition-colors",
        "w-6 sm:absolute sm:-right-4",
        "-ml-4 sm:ml-0",
        className,
      )}
    >
      {children}
    </div>
  )
}
