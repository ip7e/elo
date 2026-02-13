"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import EditCircleDialogContent from "@/app/me/_components/edit-circle-dialog-content"
import HasAccess from "../../_components/has-access"
import { useHasAccess } from "../../_context/access-context"
import { Eye, EyeOff, Settings, UserPlus } from "lucide-react"
import { useState } from "react"
import { cn } from "@/utils/tailwind/cn"

type DashboardToolbarProps = {
  hasHiddenMembers: boolean
  showHidden: boolean
  onToggleShowHidden: () => void
  hidden?: boolean
  onAddMember?: () => void
}

export function DashboardToolbar({
  hasHiddenMembers,
  showHidden,
  onToggleShowHidden,
  hidden,
  onAddMember,
}: DashboardToolbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { circle } = useHasAccess()

  return (
    <div className={cn("mb-2 flex w-full items-end justify-end gap-1.5 pr-4 sm:-mb-3 sm:gap-1 sm:pr-6", hidden && "invisible")}>
      <HasAccess>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-muted-foreground transition-transform duration-100 ease-linear hover:bg-transparent hover:text-foreground sm:h-7 sm:w-7 sm:-rotate-2 sm:hover:-translate-y-1"
              onClick={onAddMember}
            >
              <UserPlus size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add member</TooltipContent>
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
