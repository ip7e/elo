import { cn } from "@/utils/tailwind/cn"
import { motion } from "framer-motion"
import Queen from "../_assets/queen"
import Racket from "../_assets/racket"
import Sword from "../_assets/sword"
import King from "../_assets/king"
import { BaseDelay } from "../constants"

// Animation configs
const fadeInUpAnimation = {
  initial: { opacity: 0, y: 5 },
  animate: { opacity: 1, y: 0 },
}

const iconTransition = {
  mass: 1,
  type: "spring",
}

function AnimatedIcon({
  children,
  delay,
  className,
}: {
  children: React.ReactNode
  delay: number
  className?: string
}) {
  return (
    <motion.div
      {...fadeInUpAnimation}
      transition={{ ...iconTransition, delay: BaseDelay.characters + delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HeroCharacters() {
  return (
    <div className={cn("relative flex items-end gap-4")}>
      <AnimatedIcon delay={0}>
        <Queen className={cn("h-20", "sm:h-28", "lg:h-24")} />
      </AnimatedIcon>

      <AnimatedIcon delay={0.2} className="mr-4">
        <Racket className={cn("h-16", "sm:h-20", "lg:h-16")} />
      </AnimatedIcon>

      <AnimatedIcon delay={0.3}>
        <Sword className={cn("h-16 scale-x-[-1]", "sm:h-20", "lg:h-16")} />
      </AnimatedIcon>

      <AnimatedIcon delay={0.1}>
        <King className={cn("h-20 scale-x-[-1]", "sm:h-28", "lg:h-24")} />
      </AnimatedIcon>
    </div>
  )
}
