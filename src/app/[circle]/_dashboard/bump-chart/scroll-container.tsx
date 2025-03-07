import { cn } from "@/lib/utils"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

type Props = React.PropsWithChildren<{ className?: string }>

export function ScrollContainer({ children, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollXProgress } = useScroll({
    container: containerRef,
    axis: "x",
  })

  return (
    <div
      ref={containerRef}
      className={cn("scrollbar relative overflow-x-auto", className)}
      style={{
        scrollbarWidth: "none",
      }}
    >
      <motion.div
        className="inline-flex"
        style={{
          x: useTransform(scrollXProgress, [0, 1], [0, -100]),
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
