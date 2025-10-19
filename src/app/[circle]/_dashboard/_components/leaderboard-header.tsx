import { X } from "lucide-react"
import { VisibilityToggle } from "./visibility-toggle"

type LeaderboardHeaderProps = {
  floatingTitle?: string
  onResetSelectedGame?: () => void
  showHidden: boolean
  onToggleShowHidden?: () => void
  hasHiddenMembers: boolean
}

/**
 * LeaderboardHeader component displays the floating title for selected games
 * and the visibility toggle for showing/hiding inactive members.
 */
export function LeaderboardHeader({
  floatingTitle,
  onResetSelectedGame,
  showHidden,
  onToggleShowHidden,
  hasHiddenMembers,
}: LeaderboardHeaderProps) {
  return (
    <>
      {floatingTitle && (
        <div
          className="group absolute -top-12 left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-2 text-nowrap rounded-md border border-border bg-background px-3 py-1.5 shadow-sm"
          onClick={onResetSelectedGame}
        >
          <span className="text-sm font-medium text-muted-foreground">{floatingTitle}</span>
          <X className="h-3 w-3 text-muted group-hover:text-primary" />
        </div>
      )}
      {hasHiddenMembers && onToggleShowHidden && (
        <VisibilityToggle showHidden={showHidden} onToggle={onToggleShowHidden} variant="desktop" />
      )}
    </>
  )
}
