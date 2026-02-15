import { getAllGames, getCircleBySlug, getCirclePlan, getMembersStats } from "@/server/queries"
import Dashboard from "../[circle]/_dashboard/dashboard"
import { CirclePlanProvider } from "../[circle]/_context/circle-plan-context"
import notFound from "../not-found"
// import { DemoAnnotations } from "./demo-annotations"

export default async function Demo() {
  const circle = await getCircleBySlug("demo")

  if (!circle) return notFound()

  const [games, [memberStats], plan] = await Promise.all([
    getAllGames(circle.id),
    getMembersStats({ circleId: circle.id }),
    getCirclePlan(circle.id),
  ])

  if (!memberStats || !games) return null

  return (
    <div className="container mx-auto mt-4 flex h-full max-w-3xl flex-col px-8">
      <CirclePlanProvider plan={plan}>
        <div className="relative">
          <Dashboard recentGames={games} memberStats={memberStats} circleId={circle.id} />
          {/* <DemoAnnotations /> */}
        </div>
      </CirclePlanProvider>
    </div>
  )
}
