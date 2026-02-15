import { cn } from "@/utils/tailwind/cn"
import { ReactNode } from "react"
import { ProCelebration } from "../../_components/pro-celebration"

type DashboardLayoutProps = {
  chartSection: ReactNode
  leaderboardSection: ReactNode
  showChartOnMobile?: boolean
}

/**
 * DashboardLayout component handles the responsive layout
 * of the chart and leaderboard sections.
 */
export function DashboardLayout({ chartSection, leaderboardSection, showChartOnMobile }: DashboardLayoutProps) {
  return (
    <div data-dashboard-card className="relative z-10 flex max-w-3xl flex-col-reverse justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2 shadow-sm dark:shadow-accent/3 dark:shadow-2xl sm:flex-row sm:gap-2">
      <ProCelebration />
      <div
        className={cn(
          "relative min-h-16 w-full flex-1 items-start justify-end overflow-hidden",
          showChartOnMobile ? "flex" : "hidden sm:flex",
        )}
      >
        {chartSection}
      </div>

      <div className="flex shrink-0 flex-col py-2 sm:w-64">{leaderboardSection}</div>

    </div>
  )
}
