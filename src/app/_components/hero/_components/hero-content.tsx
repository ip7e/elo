import { motion } from "framer-motion"
import RevealHeadline from "./reveal-headline"
import { Button } from "@/components/ui/button"
import { BaseDelay } from "../constants"
import Link from "next/link"

const fadeInUpAnimation = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
}

const textTransition = {
  duration: 1,
  ease: "backInOut",
  type: "tween",
}

export default function HeroContent() {
  return (
    <div className="justify-items-center text-center">
      <RevealHeadline className="text-primary">
        Never let your friends forget who is the winner
      </RevealHeadline>
      <motion.p
        {...fadeInUpAnimation}
        transition={{ ...textTransition, delay: BaseDelay.description }}
        className="mt-8 max-w-md text-pretty text-xl/8 font-light text-primary/70"
      >
        A very good leaderboard app for competitive games.
      </motion.p>
      <motion.div
        {...fadeInUpAnimation}
        transition={{ ...textTransition, delay: BaseDelay.callToAction }}
        className="mt-10 flex flex-row items-center gap-x-4 gap-y-3"
      >
        <Button asChild>
          <Link href="/me">Get started</Link>
        </Button>
        <span className="text-sm text-muted-foreground">it&apos;s free</span>
      </motion.div>
    </div>
  )
}
