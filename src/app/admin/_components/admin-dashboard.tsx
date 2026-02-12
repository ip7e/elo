"use client"

import { AdminCircleRow, AdminStats } from "@/server/admin-queries"
import { CirclesTable } from "./circles-table"

type Props = {
  stats: AdminStats
  circles: AdminCircleRow[]
}

export default function AdminDashboard({ stats, circles }: Props) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Total Circles" value={stats.totalCircles} />
        <StatCard label="Circles (7d)" value={stats.circlesLast7Days} />
        <StatCard label="Circles (30d)" value={stats.circlesLast30Days} />
        <StatCard label="Total Games" value={stats.totalGames} />
        <StatCard label="Pro Circles" value={stats.unlockedCircles} />
        <StatCard label="Free Circles" value={stats.freeCircles} />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Circles</h2>
        <CirclesTable circles={circles} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-mono text-2xl font-bold">{value.toLocaleString()}</span>
    </div>
  )
}
