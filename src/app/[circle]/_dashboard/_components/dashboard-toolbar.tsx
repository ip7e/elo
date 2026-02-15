"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import EditCircleDialogContent from "@/app/me/_components/edit-circle-dialog-content"
import HasAccess from "../../_components/has-access"
import { useHasAccess } from "../../_context/access-context"
import { Eye, EyeOff, Settings, UserPlus } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/utils/tailwind/cn"

type DashboardToolbarProps = {
  hasHiddenMembers: boolean
  showHidden: boolean
  onToggleShowHidden: () => void
  hidden?: boolean
  onAddMember?: () => void
  memberCount: number
}

export function DashboardToolbar({
  hasHiddenMembers,
  showHidden,
  onToggleShowHidden,
  hidden,
  onAddMember,
  memberCount,
}: DashboardToolbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const isSoleMember = memberCount <= 1
  const [showAddHint, setShowAddHint] = useState(isSoleMember)
  const { circle } = useHasAccess()

  useEffect(() => {
    if (isSoleMember) setShowAddHint(true)
  }, [isSoleMember])

  return (
    <div className={cn("mb-2 flex w-full items-end justify-end gap-1.5 pr-4 sm:-mb-3 sm:gap-1 sm:pr-6", hidden && "invisible")}>
      <HasAccess>
        <Tooltip delayDuration={0} open={showAddHint || undefined}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground transition-transform duration-100 ease-linear hover:bg-transparent hover:text-foreground sm:h-7 sm:w-7 sm:-rotate-2 sm:hover:-translate-y-1"
              onClick={() => {
                setShowAddHint(false)
                onAddMember?.()
              }}
            >
              <UserPlus size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isSoleMember ? "Add your friends to get started" : "Add member"}</TooltipContent>
        </Tooltip>
      </HasAccess>
      {hasHiddenMembers && (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground transition-transform duration-100 ease-linear hover:bg-transparent hover:text-foreground sm:h-7 sm:w-7 sm:-rotate-1 sm:hover:-translate-y-1" onClick={onToggleShowHidden}>
              {showHidden ? <Eye size={16} /> : <EyeOff size={16} />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{showHidden ? "Hide inactive" : "Show inactive"}</TooltipContent>
        </Tooltip>
      )}
      <HasAccess>
        {circle && (
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 text-muted-foreground transition-transform duration-100 ease-linear hover:bg-transparent hover:text-foreground sm:h-7 sm:w-7 sm:rotate-1 sm:hover:-translate-y-1">
                    <Settings size={16} />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
            <EditCircleDialogContent circle={circle} />
          </Dialog>
        )}
      </HasAccess>
    </div>
  )
}
