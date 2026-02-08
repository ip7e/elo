"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { CircleWithMyRank } from "@/server/queries"
import { Plus } from "lucide-react"
import { useState } from "react"
import { DotGrid } from "../_components/dot-grid"
import { Card } from "./_components/cards"
import CircleCard from "./_components/circle-card"
import CreateCircleChat from "./_components/create-circle-chat"
import { AnimatePresence } from "framer-motion"

type Props = {
  circles: CircleWithMyRank
}

export default function MyCircles({ circles }: Props) {
  const [isNewCircleDialogOpen, setIsNewCircleDialogOpen] = useState(false)

  return (
    <div className="container mx-auto flex h-full max-w-3xl flex-col">
      <div className="mx-auto mt-5 flex w-full items-center justify-center text-primary"></div>

      <div className={cn("flex flex-col gap-2")}>
        <h2 className="font-sans text-lg font-semibold text-neutral-600">My Circles</h2>
        <DotGrid
          className={cn(
            "grid grid-cols-2 items-center justify-center justify-items-center gap-4 rounded-lg border p-5 sm:grid-cols-3 md:grid-cols-4",
          )}
        >
          {circles.map((circle) => (
            <CircleCard key={circle.id} circle={circle} />
          ))}
          <Dialog onOpenChange={setIsNewCircleDialogOpen}>
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
            {isNewCircleDialogOpen && (
              <CreateCircleChat onCreated={(circle) => {}} />
            )}
          </Dialog>
        </DotGrid>
      </div>
    </div>
  )
}
