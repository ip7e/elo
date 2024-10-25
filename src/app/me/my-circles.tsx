"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Circle } from "@/server/types"
import { Plus } from "lucide-react"
import { useState } from "react"
import { DotGrid } from "../_components/dot-grid"
import { Card } from "./_components/cards"
import CircleCard from "./_components/circle-card"
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
        <DotGrid className={cn("flex flex-wrap gap-7 rounded-lg border p-5")}>
          {circles.map((circle) => (
            <CircleCard key={circle.id} circle={circle} />
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
