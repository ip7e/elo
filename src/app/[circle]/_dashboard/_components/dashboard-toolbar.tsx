"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import EditCircleDialogContent from "@/app/me/_components/edit-circle-dialog-content"
import HasAccess from "../../_components/has-access"
import { useHasAccess } from "../../_context/access-context"
import { Eye, EyeOff, Settings } from "lucide-react"
import { useState } from "react"

type DashboardToolbarProps = {
  hasHiddenMembers: boolean
  showHidden: boolean
  onToggleShowHidden: () => void
}

export function DashboardToolbar({
  hasHiddenMembers,
  showHidden,
  onToggleShowHidden,
}: DashboardToolbarProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const { circle } = useHasAccess()

  return (
    <div className="-mb-3 flex w-full items-end justify-end gap-1 pr-4 sm:pr-6">
      {hasHiddenMembers && (
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" className="h-7 w-7 -rotate-1 text-muted-foreground transition-transform duration-100 ease-linear hover:-translate-y-1 hover:bg-transparent hover:text-foreground" onClick={onToggleShowHidden}>
              {showHidden ? <Eye size={14} /> : <EyeOff size={14} />}
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
                  <Button variant="outline" size="icon" className="h-7 w-7 rotate-1 text-muted-foreground transition-transform duration-100 ease-linear hover:-translate-y-1 hover:bg-transparent hover:text-foreground">
                    <Settings size={14} />
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
