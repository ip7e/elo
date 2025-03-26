import { getAllGames, getCircleBySlug, getMembersWithStatsV2 } from "@/server/queries"
import { notFound } from "next/navigation"
import Dashboard from "./_dashboard/dashboard"

export default async function CirclePage({ params }: { params: { circle: string } }) {
  const circle = await getCircleBySlug(params.circle)

  if (!circle) return notFound()

  const games = await getAllGames(circle.id)

  const [membersWithStats, error] = await getMembersWithStatsV2({ circleId: circle.id })

  if (!membersWithStats || !games) return null

  return <Dashboard recentGames={games} membersWithStats={membersWithStats} circleId={circle.id} />
}
