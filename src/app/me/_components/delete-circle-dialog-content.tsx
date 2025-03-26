"use client"
import { DialogContent, DialogTitle } from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { DialogClose, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { deleteCircle } from "@/server/actions"
import { Circle } from "@/server/types"
import { TriangleAlert } from "lucide-react"
import { useState } from "react"
import { useServerAction } from "zsa-react"

type Props = {
  circle: Circle
}

export default function EditCircleDialogContent({ circle }: Props) {
  const [name, setName] = useState<string>()

  const { isPending, execute, isSuccess, isError, error, data } = useServerAction(deleteCircle, {})

  const isValid = circle.name === name
  return (
    <DialogContent className="border-destructive">
      {!isSuccess && (
        <form
          onSubmit={(e) => {
            e.preventDefault()

            if (!isValid) return
            execute({
              circleId: circle.id,
              confirmName: name,
            })
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <TriangleAlert className="mr-2 inline-block text-destructive" size={18} />
              Confirm Circle Deletion
            </DialogTitle>
          </DialogHeader>

          <div className="bg my-6 grid gap-6">
            <p className="">
              You are about to permanently delete the circle &quot;{circle.name}&quot;.
            </p>

            <div className="grid gap-2">
              <Label htmlFor="circle">Please type the circle name to confirm</Label>
              <Input
                id="circle"
                type="text"
                className="w-full"
                defaultValue={name}
                onChange={(e) => setName(e.target.value)}
              />
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
              variant={"destructive"}
            >
              Delete Circle
            </Button>
          </DialogFooter>
        </form>
      )}

      {isSuccess && (
        <>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription className="flex flex-col gap-2 py-4">
              <p>Circle has been deleted!</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={"ghost"}>Close</Button>
            </DialogClose>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  )
}
