"use client"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import React, { useRef, useState } from "react"

const getRandomRotation = () => (Math.random() - 0.5) * 7

export function Card({ children }: { children: React.ReactNode }) {
  const [randomRotation, setRandomRotation] = useState(getRandomRotation)

  const rotate = () => setRandomRotation(getRandomRotation())

  return (
    <motion.div
      className={cn("dark: flex h-32 flex-col justify-between rounded-lg bg-background px-4 py-4")}
      animate={{
        rotate: randomRotation,
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        boxShadow: "0 8px 8px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      }}
      whileTap={{
        scale: 1.02,
        rotate: 0,
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      }}
      onMouseLeave={rotate}
    >
      {children}
    </motion.div>
  )
}
