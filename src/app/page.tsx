import { getMyCircles } from "@/server/queries"
import Link from "next/link"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Card } from "./_components/cards"

export default async function Page() {
  const [circles, error] = await getMyCircles()

  if (!circles) return null

  const testCircles = [
    {
      id: 1,
      name: "Meeple Madness",
      slug: "meeple-madness",
    },
    {
      id: 2,
      name: "Gem Collectors",
      slug: "gem-collectors",
    },
    {
      id: 3,
      name: "Paddle Pals",
      slug: "paddle-pals",
    },
    {
      id: 4,
      name: "Dice Rollers",
      slug: "dice-rollers",
    },
    {
      id: 5,
      name: "Card Sharks",
      slug: "card-sharks",
    },
    {
      id: 6,
      name: "Puzzle Wizards",
      slug: "puzzle-wizards",
    },
  ]

  return (
    <div className="container mx-auto flex h-full max-w-3xl flex-col">
      <div className="mx-auto mt-5 flex w-full items-center justify-center"></div>

      <div
        className={cn(
          "grid h-auto grid-cols-4 gap-4 rounded-lg p-4",
          "bg-neutral-100 dark:bg-neutral-700",
        )}
      >
        {testCircles.map((circle) => (
          <Link href={`/${circle.slug}`} key={circle.id}>
            <Card>
              <div className="text-base font-semibold text-accent">{circle.name}</div>

              <div className="flex flex-col gap-0 text-base">
                <div className="font-mono font-extrabold">
                  <span className="dark:text-neutral-100">#1</span>
                  <span className="text-neutral-300 dark:text-neutral-600">/6</span>
                </div>
                <div
                  className={cn(
                    "leading-0 text-sm leading-3",
                    "text-neutral-300 dark:text-neutral-600",
                  )}
                >
                  your rank
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
