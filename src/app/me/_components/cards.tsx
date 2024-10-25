"use client"
import { cn } from "@/lib/utils"
import { motion, Variants } from "framer-motion"
import React, { PropsWithChildren, useState } from "react"

const getRandomRotation = () => (Math.random() - 0.5) * 7
type Props = PropsWithChildren<{
  className?: string
  forceHoverState?: boolean
}>

const cardVariants: Variants = {
  initial: (rotation: number) => ({
    rotate: rotation,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  }),
  hover: {
    scale: 1.05,
    rotate: 0,
    boxShadow: "0 8px 8px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
  tap: {
    scale: 1.02,
    rotate: 0,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
}

export function Card({ forceHoverState, children, className }: Props) {
  const [randomRotation, setRandomRotation] = useState(getRandomRotation)

  const rotate = () => setRandomRotation(getRandomRotation())

  return (
    <motion.div
      className={cn(
        "border border-muted",
        "dark: flex size-36 flex-col justify-between rounded-lg bg-background p-4",
        className,
      )}
      onMouseLeave={rotate}
      variants={cardVariants}
      custom={randomRotation}
      initial="initial"
      animate={forceHoverState ? "hover" : "initial"}
      whileHover={"hover"}
      whileTap={forceHoverState ? "hover" : "tap"}
    >
      {children}
    </motion.div>
  )
}
