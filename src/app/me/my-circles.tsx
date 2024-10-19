"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Circle } from "@/server/types"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Card } from "./_components/cards"
import NewCircleDialogContent from "./_components/new-circle-dialog-content"

type Props = {
  circles: Circle[]
}

export default function MyCircles({ circles: defaultCircles }: Props) {
  const [circles, setCircles] = useState<Circle[]>(defaultCircles)

  return (
    <div className="container mx-auto flex h-full max-w-3xl flex-col">
      <div className="mx-auto mt-5 flex w-full items-center justify-center"></div>

      <div
        className={cn(
          "grid h-auto grid-cols-4 gap-4 rounded-lg p-4",
          "bg-neutral-50 dark:bg-neutral-700",
        )}
      >
        {circles.map((circle) => (
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
        <Dialog>
          <DialogTrigger className="outline-none">
            <Card className={cn("group cursor-pointer p-[2px]")}>
              <div
                className={cn(
                  "relative flex size-full flex-col items-center justify-center rounded-md text-center",
                  "bg-neutral-100/80",
                  "text-neutral-400",
                )}
              >
                <Plus strokeWidth="2" size={16} />
                <span className="absolute top-1/2 translate-y-2 text-sm opacity-0 group-hover:opacity-100">
                  create new
                </span>
              </div>
            </Card>
          </DialogTrigger>
          <NewCircleDialogContent
            onCreated={(circle) => {
              setCircles([...circles, circle])
            }}
          ></NewCircleDialogContent>
        </Dialog>
      </div>
    </div>
  )
}
