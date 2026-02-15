"use client"

import { motion } from "framer-motion"

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
}

export function DemoAnnotations() {
  return (
    <div className="pointer-events-none hidden lg:block" aria-hidden="true">
      {/* Annotation 1: Chart — top-left, arrow curves down into the chart area */}
      <motion.div
        {...fadeIn}
        transition={{ duration: 0.8, delay: 2.0 }}
        className="absolute z-20 -top-4 -left-8 flex flex-col text-primary/40"
      >
        <span className="font-handwriting text-[22px]">
          tap the chart to explore games
        </span>
        <svg
          width="80"
          height="70"
          viewBox="0 0 80 70"
          fill="none"
          className="ml-16"
        >
          <path
            d="M 10 2 C 14 15, 22 30, 35 42 C 44 51, 55 58, 65 62"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 58 58 L 66 63 L 60 67"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* Annotation 2: Elo scores — right side, arrow points left into scores */}
      <motion.div
        {...fadeIn}
        transition={{ duration: 0.8, delay: 2.3 }}
        className="absolute z-20 -right-56 top-20 flex items-center gap-1 text-primary/40"
      >
        <svg width="80" height="30" viewBox="0 0 80 30" fill="none">
          <path
            d="M 75 16 C 55 13, 30 11, 8 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 14 9 L 7 15 L 15 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span className="font-handwriting text-[22px]">rankings based on Elo</span>
      </motion.div>

      {/* Annotation 3: Members — below card, arrow curves up into names */}
      <motion.div
        {...fadeIn}
        transition={{ duration: 0.8, delay: 2.6 }}
        className="absolute z-20 -bottom-12 right-8 flex items-start gap-1 text-primary/40"
      >
        <span className="font-handwriting text-[22px] mt-6">click on members</span>
        <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
          <path
            d="M 25 55 C 24 40, 22 25, 20 15 C 19 10, 18 6, 16 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 21 7 L 16 2 L 12 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  )
}
