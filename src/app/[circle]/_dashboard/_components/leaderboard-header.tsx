import { X } from "lucide-react"

type LeaderboardHeaderProps = {
  floatingTitle?: string
  onResetSelectedGame?: () => void
}

export function LeaderboardHeader({
  floatingTitle,
  onResetSelectedGame,
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
    </>
  )
}
