import { FREE_GAME_LIMIT } from "@/server/constants"
import { MemberStats } from "@/server/types"
import { Lock } from "lucide-react"
import HasAccess from "../../_components/has-access"
import { Plan } from "../../_components/plan"
import { useCirclePlan } from "../../_context/circle-plan-context"
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
  const { gamesLeft } = useCirclePlan()

  return (
    <div className="group -mt-4 flex w-full flex-col items-end pr-[22%] sm:pr-[12%]">
      <div className="translate-y-0 rotate-1 space-y-2 pt-2 transition-transform duration-100 ease-linear group-hover:translate-y-3">
        <div className="flex items-center gap-3">
          <Plan.Active>
            <HasAccess>
              <AddNewGameDialog members={memberStats} circleId={circleId} onSubmitted={onGameSubmitted} />
            </HasAccess>
          </Plan.Active>
          <Plan.Locked>
            <div className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground">
              <Lock size={14} />
              <span>Free limit reached.</span>
              <a
                href={`/api/checkout?circleId=${circleId}`}
                className="font-medium text-accent hover:underline"
              >
                Unlock this circle
              </a>
            </div>
          </Plan.Locked>
        </div>
        <Plan.Trial>
          <span className="text-xs text-muted-foreground">
            {gamesLeft} of {FREE_GAME_LIMIT} free games remaining
          </span>
        </Plan.Trial>
      </div>
    </div>
  )
}
