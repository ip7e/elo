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
import { inviteMemberAsOwner } from "@/server/actions"
import { useState } from "react"
import { useServerAction } from "zsa-react"

type Props = {
  circleId: number
  memberId: number
}

export default function InviteDialogContent({ circleId, memberId }: Props) {
  const [email, setEmail] = useState("")

  const { isPending, execute, isSuccess } = useServerAction(inviteMemberAsOwner, {
    onSuccess: () => setEmail(""),
  })
  return (
    <DialogContent>
      {!isSuccess && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            execute({ email: email.trim(), circleId, memberId })
          }}
        >
          <DialogHeader>
            <DialogTitle>Invite member as owner</DialogTitle>
            <DialogDescription className="py-4">
              This member will be able to add and remove game sessions, as well as add and remove
              other members (including you)
            </DialogDescription>
          </DialogHeader>

          <div className="my-4">
            <Input
              id="username"
              placeholder="Email"
              className="col-span-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className={cn(isPending && "animate-pulse")}
              disabled={isPending}
              variant={"accent"}
            >
              Invite
            </Button>
          </DialogFooter>
        </form>
      )}

      {isSuccess && (
        <>
          <DialogHeader>
            <DialogTitle>Owner permissions granted</DialogTitle>
            <DialogDescription className="py-4">
              Member simply needs to login to the app to receive owner permissions.
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
