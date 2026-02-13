import { X, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useServerAction } from "zsa-react"
import { deleteLastGame } from "@/server/actions"
import HasAccess from "../../_components/has-access"

type LeaderboardHeaderProps = {
  floatingTitle?: string
  onResetSelectedGame?: () => void
  canDelete?: boolean
  circleId: number
}

export function LeaderboardHeader({
  floatingTitle,
  onResetSelectedGame,
  canDelete,
  circleId,
}: LeaderboardHeaderProps) {
  const { isPending, execute } = useServerAction(deleteLastGame)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const confirm = window.confirm("Are you sure you want to delete the last game?")
    if (!confirm) return
    const [data, error] = await execute({ circleId })
    if (error) alert("Something went wrong")
    else onResetSelectedGame?.()
  }

  return (
    <>
      {floatingTitle && (
        <div
          className="group absolute -top-12 left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-2 text-nowrap rounded-md border border-border bg-background px-3 py-1.5 shadow-sm"
          onClick={onResetSelectedGame}
        >
          <span className="text-sm font-medium text-muted-foreground">{floatingTitle}</span>
          <X className="h-3 w-3 text-muted group-hover:text-primary" />
          <HasAccess>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  className="absolute left-full ml-1.5 flex h-8 w-8 items-center justify-center rounded-md border bg-background shadow-sm transition-colors disabled:opacity-50"
                  style={canDelete ? undefined : { pointerEvents: "auto" }}
                  onClick={canDelete ? handleDelete : (e) => e.stopPropagation()}
                  disabled={isPending}
                >
                  <Trash2 className={`h-3.5 w-3.5 ${canDelete ? "text-destructive" : "text-muted"}`} />
                </button>
              </TooltipTrigger>
              {!canDelete && (
                <TooltipContent>You can only delete the latest game</TooltipContent>
              )}
            </Tooltip>
          </HasAccess>
        </div>
      )}
    </>
  )
}
