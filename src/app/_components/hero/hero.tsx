import { Button } from "@/components/ui/button"
import Queen from "./_assets/queen"
import HeroChart from "./_components/hero-chart"
import King from "./_assets/king"
import Sword from "./_assets/sword"
import Racket from "./_assets/racket"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import RevealHeadline from "./_components/reveal-headline"
import HeroCharacters from "./_components/hero-characters"
import { BaseDelay } from "./constants"

// Animation configs
const fadeInUpAnimation = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
}

const textTransition = {
  duration: 1,
  ease: "backInOut",
  type: "tween",
}

const iconTransition = {
  mass: 1,
  type: "spring",
}

// Hero content section
function HeroContent() {
  return (
    <div className="justify-items-center text-center lg:justify-items-start lg:text-left">
      <RevealHeadline className="text-gray-900">
        Never let your friends forget who&apos;s winning
      </RevealHeadline>
      <motion.p
        {...fadeInUpAnimation}
        transition={{ ...textTransition, delay: BaseDelay.description }}
        className="mt-8 max-w-md text-pretty text-lg font-light text-gray-500 lg:text-xl/8"
      >
        A scoreboard for competitive games to track results, rankings, and winning streaks
      </motion.p>
      <motion.div
        {...fadeInUpAnimation}
        transition={{ ...textTransition, delay: BaseDelay.callToAction }}
        className="mt-10 flex flex-col items-center gap-x-4 gap-y-3 lg:flex-row"
      >
        <Button asChild>
          <a href="#">Get started</a>
        </Button>
        <span className="text-sm text-gray-400">it&apos;s free</span>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  return (
    <div className="mx-auto max-w-2xl py-20 lg:max-w-5xl lg:py-56">
      <div className="grid grid-cols-1 items-center gap-y-8 lg:grid-cols-[1fr_min-content] lg:gap-x-12">
        <HeroContent />
        <div className="relative w-[500px] justify-self-center rounded-lg">
          <HeroChart />
          <HeroCharacters />
        </div>
      </div>
    </div>
  )
}
