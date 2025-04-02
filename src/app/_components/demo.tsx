import { getAllGames, getCircleBySlug, getMembersStats } from "@/server/queries"
import Dashboard from "../[circle]/_dashboard/dashboard"
import notFound from "../not-found"

export default async function Demo() {
  const circle = await getCircleBySlug("demo")

  if (!circle) return notFound()

  const games = await getAllGames(circle.id)

  const [membersWithStats, error] = await getMembersStats({ circleId: circle.id })

  if (!membersWithStats || !games) return null

  return (
    <div className="mt-16 flex flex-col items-center justify-center">
      <Dashboard recentGames={games} membersWithStats={membersWithStats} circleId={circle.id} />
    </div>
  )
}
