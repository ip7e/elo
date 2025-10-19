import { cn } from "@/utils/tailwind/cn"
import { MemberStats } from "@/server/types"
import HasAccess from "../../_components/has-access"
import { AddNewGameDialog } from "./add-new-game-dialog"
import { VisibilityToggle } from "./visibility-toggle"

type GameControlsProps = {
  memberStats: MemberStats[]
  circleId: number
  hasHiddenMembers: boolean
  showHidden: boolean
  onToggleShowHidden: () => void
  onGameSubmitted: (ids: number[]) => void
}

/**
 * GameControls component displays the controls for adding new games
 * and toggling visibility of inactive members (mobile view).
 */
export function GameControls({
  memberStats,
  circleId,
  hasHiddenMembers,
  showHidden,
  onToggleShowHidden,
  onGameSubmitted,
}: GameControlsProps) {
  return (
    <HasAccess>
      <div
        className={cn(
          "flex w-full items-center justify-end gap-2 py-8 sm:order-1 sm:justify-center sm:py-16",
          "-order-1",
        )}
      >
        {hasHiddenMembers && (
          <VisibilityToggle
            showHidden={showHidden}
            onToggle={onToggleShowHidden}
            variant="mobile"
          />
        )}
        <AddNewGameDialog members={memberStats} circleId={circleId} onSubmitted={onGameSubmitted} />
      </div>
    </HasAccess>
  )
}
