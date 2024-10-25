"use client"
import { DialogContent, DialogTitle } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { DialogClose, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { editCircle } from "@/server/actions"
import { Circle } from "@/server/types"
import Link from "next/link"
import { useState } from "react"
import { useServerAction } from "zsa-react"

type Props = {
  circle: Circle
}

export default function EditCircleDialogContent({ circle }: Props) {
  const [name, setName] = useState(circle.name)
  const [slug, setSlug] = useState<string>(circle.slug)

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
              Edit
            </Button>
          </DialogFooter>
        </form>
      )}

      {isSuccess && (
        <>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription className="flex flex-col gap-2 py-4">
              <p>Circle name and link has been updated!</p>
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
