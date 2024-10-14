"use client"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { createCircle, inviteMemberAsOwner } from "@/server/actions"
import { Circle } from "@/server/types"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useServerAction } from "zsa-react"

type Props = {
  onCreated?: (circle: Circle) => void
}

export default function NewCircleDialogContent({ onCreated }: Props) {
  const [name, setName] = useState("")
  const [customSlug, setCustomSlug] = useState<string | null>(null)
  const [defaultSlug, setDefaultSlug] = useState("")
  const [nickname, setNickname] = useState("")
  const [members, setMembers] = useState("")

  useEffect(() => {
    if (customSlug) return

    // convert name to slug
    const nameToSlug = name.toLowerCase().replaceAll(" ", "-")
    setDefaultSlug(nameToSlug)
  }, [name, customSlug])

  const { isPending, execute, isSuccess, isError, error, data } = useServerAction(createCircle, {
    onSuccess: ({ data }) => {
      onCreated?.(data.circle)
      reset()
    },
  })

  const reset = () => {
    setName("")
    setCustomSlug(null)
    setMembers("")
  }

  const slug = customSlug || defaultSlug
  const isValid = Boolean(name && slug && nickname)

  return (
    <DialogContent>
      {!isSuccess && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            execute({
              name: name,
              slug: slug,
              nickname,
              members,
            })
          }}
        >
          <DialogHeader>
            <DialogTitle>Create new Circle</DialogTitle>
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
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="w-full pl-[92px]"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nickname">Your Nickname</Label>
              <Input
                id="nickname"
                type="text"
                className="w-full"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="members">
                Other Members <span className="text-neutral-300">(Optional)</span>
              </Label>
              <Input
                id="members"
                type="text"
                className="w-full"
                value={members}
                onChange={(e) => setMembers(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple members with a comma. You can also do this later.
              </p>
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
              Create
            </Button>
          </DialogFooter>
        </form>
      )}

      {isSuccess && (
        <>
          <DialogHeader>
            <DialogTitle>Awesome</DialogTitle>
            <DialogDescription className="flex flex-col gap-2 py-4">
              <p>You just created a new circle!</p>
              <p>Head over to the circle page and start tracking your wins!</p>
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
