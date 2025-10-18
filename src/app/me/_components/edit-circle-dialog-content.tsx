"use client"
import { DialogContent, DialogTitle } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { DialogClose, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { editCircle } from "@/server/actions"
import { Circle } from "@/server/types"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useServerAction } from "zsa-react"

type Props = {
  circle: Circle
}

export default function EditCircleDialogContent({ circle }: Props) {
  const [name, setName] = useState(circle.name)
  const [slug, setSlug] = useState<string>(circle.slug)
  const [autoHideAfterGames, setAutoHideAfterGames] = useState(circle.auto_hide_after_games)
  const [showMore, setShowMore] = useState(false)

  const { isPending, execute, isSuccess, isError, error, data } = useServerAction(editCircle, {})

  const isValid = Boolean(name && slug)

  return (
    <DialogContent>
      {!isSuccess && (
        <form
          onSubmit={(e) => {
            e.preventDefault()

            if (!isValid) return
            execute({
              circleId: circle.id,
              name,
              slug,
              autoHideAfterGames,
            })
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit Circle</DialogTitle>
          </DialogHeader>

          <div className="my-10 grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="circle">Circle Name</Label>
              <Input
                id="circle"
                type="text"
                className="w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Link</Label>
              <div className="relative">
                <span
                  className={cn(
                    "pointer-events-none absolute left-2 top-1 flex h-8 items-center rounded-md py-2 pl-2 pr-1",
                    "text-neutral-300",
                  )}
                >
                  shmelo.io/
                </span>
                <Input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full pl-[92px]"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
              >
                {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                More
              </button>

              {showMore && (
                <div className="grid gap-2 pt-2">
                  <Label htmlFor="autoHide">Auto-hide inactive members after</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="autoHide"
                      type="number"
                      min="1"
                      max="100"
                      className="w-20"
                      value={autoHideAfterGames}
                      onChange={(e) => setAutoHideAfterGames(Number(e.target.value))}
                    />
                    <span className="text-sm text-muted-foreground">missed games</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Inactive members are hidden from the leaderboard but can be shown with the eye
                    icon.
                  </p>
                </div>
              )}
            </div>

            {isError && (
              <div className="rounded bg-destructive p-2 text-destructive-foreground">
                <p className="">{error?.message}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className={cn(isPending && "animate-pulse")}
              disabled={isPending || !isValid}
              variant={"accent"}
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      )}

      {isSuccess && (
        <>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription className="flex flex-col gap-2 py-4">
              Circle name and link has been updated!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"ghost"}>Close</Button>
            </DialogClose>
            <Link href={data.circle.slug}>
              <Button variant="accent">Open {data.circle.name}</Button>
            </Link>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  )
}
