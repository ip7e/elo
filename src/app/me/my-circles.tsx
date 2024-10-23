"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Circle } from "@/server/types"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DotGrid } from "../_components/dot-grid"
import { Card } from "./_components/cards"
import NewCircleDialogContent from "./_components/new-circle-dialog-content"

type Props = {
  circles: Circle[]
}

export default function MyCircles({ circles: defaultCircles }: Props) {
  const [circles, setCircles] = useState<Circle[]>(defaultCircles)

  return (
    <div className="container mx-auto flex h-full max-w-3xl flex-col">
      <div className="mx-auto mt-5 flex w-full items-center justify-center text-primary"></div>

      <div className={cn("flex flex-col gap-2")}>
        <h2 className="font-sans text-lg font-semibold text-neutral-600">My Circles</h2>
        <DotGrid
          className={cn(
            "grid h-auto grid-cols-4 gap-4 rounded-lg border p-6",
            "bg-[mask-image:radial-gradient(farthest-side_at_50%_50%,black,transparent)] bg-[radial-gradient(rgb(223,223,223)_1px,transparent_0)] bg-[size:12px_12px] dark:bg-[radial-gradient(rgb(40,40,40)_1px,transparent_0)]",
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
              <Card className={cn("group relative cursor-pointer p-[2px]")}>
                <div
                  className={cn(
                    "relative flex size-full flex-col items-center justify-center rounded-md text-center",
                    "text-neutral-400 dark:text-neutral-300",
                  )}
                >
                  <Plus strokeWidth="2" size={16} className="dark:stroke-neutral-500" />
                  <span className="absolute top-1/2 translate-y-2 text-sm opacity-0 group-hover:opacity-100 dark:text-neutral-400">
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
        </DotGrid>
      </div>
    </div>
  )
}
