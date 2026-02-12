"use client"

import { Button } from "@/components/ui/button"
import { AdminCircleRow } from "@/server/admin-queries"
import { lockCircle, unlockCircle } from "@/server/admin-actions"
import Link from "next/link"
import { useTransition } from "react"

export function CirclesTable({ circles }: { circles: AdminCircleRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Slug</th>
            <th className="px-4 py-3 text-right font-medium">Members</th>
            <th className="px-4 py-3 text-right font-medium">Games</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Created</th>
            <th className="px-4 py-3 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {circles.map((circle) => (
            <CircleRow key={circle.id} circle={circle} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CircleRow({ circle }: { circle: AdminCircleRow }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(async () => {
      if (circle.is_unlocked) {
        await lockCircle({ circleId: circle.id })
      } else {
        await unlockCircle({ circleId: circle.id })
      }
    })
  }

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3 font-medium">{circle.name}</td>
      <td className="px-4 py-3">
        <Link href={`/${circle.slug}`} className="text-accent hover:underline">
          {circle.slug}
        </Link>
      </td>
      <td className="px-4 py-3 text-right font-mono">{circle.memberCount}</td>
      <td className="px-4 py-3 text-right font-mono">{circle.gameCount}</td>
      <td className="px-4 py-3">
        <span className={circle.is_unlocked ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}>
          {circle.is_unlocked ? "Pro" : "Free"}
        </span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{new Date(circle.created_at).toLocaleDateString()}</td>
      <td className="px-4 py-3 text-right">
        <Button size="sm" variant={circle.is_unlocked ? "outline" : "default"} disabled={isPending} onClick={handleToggle}>
          {isPending ? "..." : circle.is_unlocked ? "Lock" : "Unlock"}
        </Button>
      </td>
    </tr>
  )
}
