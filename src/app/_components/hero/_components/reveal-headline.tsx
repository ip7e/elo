import { PropsWithChildren } from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { BaseDelay } from "../constants"

type Props = PropsWithChildren<{
  className?: string
}>

export default function RevealHeadline({ children, className }: Props) {
  // Split text into words
  const words = typeof children === "string" ? children.split(" ") : []

  return (
    <h1 className={cn("text-balance text-4xl font-semibold tracking-tight", className)}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 1.1, y: 5, rotate: ((Math.PI * (i + 1)) % 10) - 5 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          transition={{
            delay: BaseDelay.headline + i * 0.03,
            duration: 1,
            type: "tween",
            ease: "backInOut",
          }}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}
