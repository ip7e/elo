import { getAllGames, getCircleBySlug, getCircleMembers, getStats } from "@/server/queries"
import CircleClient from "./circle-client"
import NewGameOpener from "./_components/new-game/new-game-opener"
import HasAccess from "./_components/has-access"

export default async function CirclePage({ params }: { params: { circle: string } }) {
  const circle = await getCircleBySlug(params.circle)

  if (!circle) return null

  const stats = await getStats(circle.id)
  const games = await getAllGames(circle.id)
  const members = await getCircleMembers(circle.id)

  if (!members || !games || !stats) return null

  return (
    <div className="flex h-full flex-col justify-center">
      <CircleClient recentGames={games} stats={stats} circleId={circle.id} />

      <div className="my-8 min-h-10">
        <HasAccess>
          <NewGameOpener members={members} circleId={circle.id} />
        </HasAccess>
      </div>
    </div>
  )
}
