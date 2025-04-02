import { getAllGames, getCircleBySlug, getMembersStats } from "@/server/queries"
import { notFound } from "next/navigation"
import Dashboard from "./_dashboard/dashboard"

export default async function CirclePage({ params }: { params: { circle: string } }) {
  const circle = await getCircleBySlug(params.circle)

  if (!circle) return notFound()

  const games = await getAllGames(circle.id)

  const [memberStats, error] = await getMembersStats({ circleId: circle.id })

  if (!memberStats || !games) return null

  return <Dashboard recentGames={games} memberStats={memberStats} circleId={circle.id} />
}
