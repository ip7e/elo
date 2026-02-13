import { FREE_GAME_LIMIT } from "@/server/constants"
import { MemberStats } from "@/server/types"
import { Lock } from "lucide-react"
import HasAccess from "../../_components/has-access"
import { Plan } from "../../_components/plan"
import { useCirclePlan } from "../../_context/circle-plan-context"
import { AddNewGameDialog } from "./add-new-game-dialog"

type GameControlsProps = {
  memberStats: MemberStats[]
  circleId: number
  onGameSubmitted: (ids: number[]) => void
}

export function GameControls({
  memberStats,
  circleId,
  onGameSubmitted,
}: GameControlsProps) {
  const { gamesLeft } = useCirclePlan()

  return (
    <div className="flex w-full flex-col items-center sm:items-end sm:pr-[75px]">
      <Plan.Active>
        <div className="group mt-2 sm:-mt-4">
          <div className="translate-y-0 space-y-2 pt-2 transition-transform duration-100 ease-linear sm:rotate-1 group-hover:sm:translate-y-3">
            <HasAccess>
              <AddNewGameDialog members={memberStats} circleId={circleId} onSubmitted={onGameSubmitted} />
            </HasAccess>
            <Plan.Trial>
              <div className="flex flex-col items-center gap-1 text-center text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 sm:-translate-x-2">
                <span>{gamesLeft} free games remaining</span>
                <a
                  href={`/api/checkout?circleId=${circleId}`}
                  className="font-medium text-accent hover:underline"
                >
                  Unlock for $5 once
                </a>
              </div>
            </Plan.Trial>
          </div>
        </div>
      </Plan.Active>
      <Plan.Locked>
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground sm:mt-3 sm:translate-x-8 sm:rotate-1">
          <Lock size={14} />
          <span>Free limit reached.</span>
          <a
            href={`/api/checkout?circleId=${circleId}`}
            className="font-medium text-accent hover:underline"
          >
            Unlock for $5 once
          </a>
        </div>
      </Plan.Locked>
    </div>
  )
}
