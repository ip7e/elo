import { cn } from "@/lib/utils"
import QueenVsKing from "./_assets/queen-vs-king"
import "./globals.css"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-1"></div>

      <div className="flex size-full flex-[4] flex-col items-center justify-start">
        <QueenVsKing className="w-52" />
        <h1 className="mt-2 h-20 -rotate-2 justify-center overflow-visible text-5xl font-bold lowercase text-accent">
          Shmelo
        </h1>

        <p className={cn("text-center text-lg", "text-neutral-500 dark:text-neutral-400")}>
          Track your wins in board games, tennis, chess, <br /> or anything else that&apos;s
          competitive
        </p>

        <div className={cn("mt-8 text-center text-lg", "text-neutral-200 dark:text-neutral-400")}>
          <Link href="/me">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
