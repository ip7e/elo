import { getAllGames, getCircleMembers, getStats } from "@/server/queries"
import CircleClient from "./leaderboard"

type Props = { circleId: number }

export default async function CircleServer({ circleId }: Props) {
  const stats = await getStats(circleId)
  const games = await getAllGames(circleId)
  const members = await getCircleMembers(circleId)

  if (!members || !games || !stats) return null

  return <CircleClient members={members} recentGames={games} stats={stats} circleId={circleId} />
}
