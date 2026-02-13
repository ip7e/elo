"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/utils/tailwind/cn"
import { EllipsisVertical, Loader2, ShieldCheck, Trash2 } from "lucide-react"
import { MemberStats } from "@/server/types"
import { useMemberActions } from "../_hooks/useMemberActions"
import InviteDialogContent from "./invite-dialog-content"
import RenameMemberDialogContent from "./rename-member-dialog-content"

type MemberActionsMenuProps = {
  member: MemberStats
}

/**
 * MemberActionsMenu component displays a dropdown menu with actions
 * for a member (rename, invite, hide/unhide, delete).
 */
export function MemberActionsMenu({ member }: MemberActionsMenuProps) {
  const {
    dialogContentType,
    setDialogContentType,
    isKickPending,
    isVisibilityPending,
    isAdmin,
    isNew,
    isHidden,
    handleToggleVisibility,
    handleKick,
  } = useMemberActions(member)

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger
          tabIndex={-1}
          className={cn(
            "group-hover:opacity-100 sm:opacity-0",
            "hover:text-primary data-[state=open]:text-primary data-[state=open]:opacity-100",
          )}
        >
          <EllipsisVertical size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end" onClick={(e) => e.stopPropagation()}>
          {isAdmin && (
            <DropdownMenuItem className="flex items-center gap-2 text-muted-foreground" disabled>
              <ShieldCheck size={14} />
              Circle Owner
            </DropdownMenuItem>
          )}

          <DialogTrigger asChild>
            <DropdownMenuItem onClick={() => setDialogContentType("rename")}>
              Rename
            </DropdownMenuItem>
          </DialogTrigger>

          {!isAdmin && !isNew && (
            <DialogTrigger asChild>
              <DropdownMenuItem onClick={() => setDialogContentType("invite")}>
                Invite as owner
              </DropdownMenuItem>
            </DialogTrigger>
          )}

          <DropdownMenuItem onClick={handleToggleVisibility} disabled={isVisibilityPending}>
            {isHidden ? "Unhide" : "Hide"}
          </DropdownMenuItem>

          {isNew && !isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleKick}
                disabled={isKickPending}
              >
                {isKickPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContentType === "invite" && (
        <InviteDialogContent circleId={member.circle_id} memberId={member.id} />
      )}
      {dialogContentType === "rename" && member && (
        <RenameMemberDialogContent
          memberId={member.id}
          circleId={member.circle_id}
          currentName={member.name}
        />
      )}
    </Dialog>
  )
}
