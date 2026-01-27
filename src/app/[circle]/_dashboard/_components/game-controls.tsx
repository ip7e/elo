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

export function GameControls({
  memberStats,
  circleId,
  hasHiddenMembers,
  showHidden,
  onToggleShowHidden,
  onGameSubmitted,
}: GameControlsProps) {
  return (
    <div className="flex w-full items-center justify-center gap-3 py-8">
      {hasHiddenMembers && (
        <VisibilityToggle showHidden={showHidden} onToggle={onToggleShowHidden} />
      )}
      <HasAccess>
        <AddNewGameDialog members={memberStats} circleId={circleId} onSubmitted={onGameSubmitted} />
      </HasAccess>
    </div>
  )
}
