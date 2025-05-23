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
import { cn } from "@/lib/utils"
import { renameMember } from "@/server/actions"
import { useState } from "react"
import { useServerAction } from "zsa-react"

type Props = {
  memberId: number
  circleId: number
  currentName: string | null
}

export default function RenameMemberDialogContent({ memberId, circleId, currentName }: Props) {
  const [name, setName] = useState(currentName || "")

  const { isPending, execute, isSuccess } = useServerAction(renameMember, {
    onSuccess: () => setName(""),
  })

  const isValid = name.length > 0 && name.length <= 20

  return (
    <DialogContent>
      {!isSuccess && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!isValid) return
            execute({ id: memberId, circleId, name: name.trim() })
          }}
        >
          <DialogHeader>
            <DialogTitle>Rename member</DialogTitle>
            <DialogDescription className="py-4">Enter a new name for this member</DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <Input
              id="name"
              placeholder="Member name"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className={cn(isPending && "animate-pulse")}
              disabled={isPending || !isValid}
              variant={"accent"}
            >
              Rename
            </Button>
          </DialogFooter>
        </form>
      )}

      {isSuccess && (
        <>
          <DialogHeader>
            <DialogTitle>Member renamed</DialogTitle>
            <DialogDescription className="py-4">
              The member has been renamed successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  )
}
