import { cn } from "@/utils/tailwind/cn"
import { ReactNode } from "react"

type DashboardLayoutProps = {
  chartSection: ReactNode
  leaderboardSection: ReactNode
}

/**
 * DashboardLayout component handles the responsive layout
 * of the chart and leaderboard sections.
 */
export function DashboardLayout({ chartSection, leaderboardSection }: DashboardLayoutProps) {
  return (
    <div className="flex flex-col-reverse justify-center gap-10 rounded-lg sm:flex-row sm:gap-4 sm:px-4">
      <div
        className={cn(
          "relative flex min-h-16 w-full flex-1 items-start justify-end overflow-hidden",
        )}
      >
        {chartSection}
      </div>

      <div className="flex flex-col py-2 sm:w-64">{leaderboardSection}</div>
    </div>
  )
}
