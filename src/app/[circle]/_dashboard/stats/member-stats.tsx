"use client"

import { cn } from "@/utils/tailwind/cn"
import { useEffect, useState } from "react"
import NumberShuffler from "../../_components/numbers-shuffler"
import { MemberStatsData } from "./types"

type Props = {
  stats: MemberStatsData
  className?: string
}

function formatJoinDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleDateString("en-US", { month: "short" }).toLowerCase()
  const currentYear = new Date().getFullYear()
  const year = date.getFullYear()

  if (year === currentYear) {
    return `${day} ${month}`
  }
  return `${day} ${month} ${year.toString().slice(-2)}`
}

export function MemberStats({ stats, className }: Props) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-lg border border-neutral-100 px-4 py-4 text-sm dark:border-neutral-800",
        className,
      )}
    >
      <div className="w-full max-w-full space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="truncate text-lg font-medium text-primary">{stats.member.name}</div>
            {stats.recentForm.length > 0 && (
              <div className="flex shrink-0 gap-1 font-mono text-xs">
                {stats.recentForm.map((game) => (
                  <span
                    key={game.gameId}
                    className={cn(
                      !game.participated && "text-muted",
                      game.participated && (game.won ? "text-green-500" : "text-red-500"),
                    )}
                  >
                    {!game.participated ? "x" : game.won ? "w" : "l"}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="shrink-0 text-xs text-secondary">
            joined {formatJoinDate(stats.member.created_at)}
          </div>
        </div>

        <div className="flex justify-between gap-8">
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <span className="text-secondary">games</span>
              <span className="font-mono text-primary">
                <NumberShuffler value={stats.totalGames} spin={false} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">wins</span>
              <span className="font-mono text-primary">
                <span className="text-secondary">{stats.winRate.toFixed(0)}%</span>{" "}
                <NumberShuffler value={stats.wins} spin={false} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">losses</span>
              <span className="font-mono text-primary">
                <span className="text-secondary">{(100 - stats.winRate).toFixed(0)}%</span>{" "}
                <NumberShuffler value={stats.losses} spin={false} />
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <span className="text-secondary">peak</span>
              <span className="font-mono text-primary">
                <NumberShuffler value={Math.round(stats.peakElo)} spin={false} />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">streak</span>
              <span
                className={cn(
                  "font-mono text-primary",
                  stats.streaks.current.type === "win" ? "text-green-500" : "text-red-500",
                )}
              >
                {stats.streaks.current.count}
                {stats.streaks.current.type === "win" ? "w" : "l"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">participation</span>
              <span className="font-mono text-primary">{stats.participationRate.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {stats.easiestOpponent && stats.toughestOpponent && (
          <div className="pt-3">
            <div className="flex items-center gap-1 text-xs">
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <span className="truncate font-mono text-sm text-primary">
                  {stats.easiestOpponent.opponent.name}
                </span>
                <span className="shrink-0 text-secondary">easy</span>
              </div>
              <div className="mx-2 h-3 w-px shrink-0 bg-neutral-200 dark:bg-neutral-700" />
              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <span className="shrink-0 text-secondary">tough</span>
                <span className="truncate font-mono text-sm text-primary">
                  {stats.toughestOpponent.opponent.name}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  spin = false,
  highlight,
  positive,
}: {
  label: string
  value: string | number
  spin?: boolean
  highlight?: boolean
  positive?: boolean
}) {
  const isNumber = typeof value === "number"

  return (
    <div className="flex justify-between gap-4">
      <span className="text-secondary">{label}</span>
      <span
        className={cn(
          "font-mono text-primary",
          highlight && (positive ? "text-green-500" : "text-red-500"),
        )}
      >
        {isNumber ? <NumberShuffler value={value} spin={spin} /> : value}
      </span>
    </div>
  )
}
