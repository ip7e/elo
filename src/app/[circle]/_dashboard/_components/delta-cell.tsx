import { TableCell } from "./table"
import { cn } from "@/utils/tailwind/cn"

type DeltaCellProps = {
  delta: number | undefined
}

/**
 * DeltaCell component displays the ELO change (delta) for a specific game.
 * Shows positive deltas in green and negative deltas in red.
 */
export function DeltaCell({ delta }: DeltaCellProps) {
  if (!delta) return null

  return (
    <TableCell className="text-right">
      <span
        className={cn(
          "rounded-md border border-border bg-muted px-1 py-0.5 text-sm font-medium text-muted-foreground",
          delta > 0
            ? "border-green-500 bg-green-500/10 text-green-500"
            : "border-red-500 bg-red-500/10 text-red-500",
        )}
      >
        {delta < 0 ? delta : `+${delta}`}
      </span>
    </TableCell>
  )
}
