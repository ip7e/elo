import { getAllGames, getCircleBySlug, getMembersStats } from "@/server/queries"
import Dashboard from "../[circle]/_dashboard/dashboard"
import notFound from "../not-found"

export default async function Demo() {
  const circle = await getCircleBySlug("demo")

  if (!circle) return notFound()

  const games = await getAllGames(circle.id)

  const [memberStats, error] = await getMembersStats({ circleId: circle.id })

  if (!memberStats || !games) return null

  return (
    <div className="mx-auto mt-16 flex max-w-4xl flex-col items-center justify-center overflow-hidden">
      <Dashboard recentGames={games} memberStats={memberStats} circleId={circle.id} />
    </div>
  )
}
