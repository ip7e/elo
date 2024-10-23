import { getAllGames, getCircleBySlug, getMembers, getStats } from "@/server/queries"
import { notFound } from "next/navigation"
import Dashboard from "./_dashboard/dashboard"

export default async function CirclePage({ params }: { params: { circle: string } }) {
  const circle = await getCircleBySlug(params.circle)

  if (!circle) return notFound()

  const stats = await getStats(circle.id)
  const games = await getAllGames(circle.id)
  const [members] = await getMembers({ circleId: circle.id })

  if (!members || !games || !stats) return null

  return <Dashboard recentGames={games} stats={stats} circleId={circle.id} members={members} />
}
