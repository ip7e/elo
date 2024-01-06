import { supabase } from "@/supabase"
import NewGameOpener from "./new-game/new-game-opener"
import StatsServer from "./stats/stats-server"

export default async function CirclePage({ params }: { params: { circle: string } }) {
  const { data: circle } = await supabase
    .from("circles")
    .select("*")
    .eq("slug", params.circle)
    .single()

  if (!circle) return null

  const { data: allMembers } = await supabase
    .from("circle_members")
    .select("*")
    .eq("circle_id", circle.id)

  if (!allMembers) return null

  return (
    <div className="mt">
      <StatsServer circleId={circle.id} />

      <div className="mt-20">
        <NewGameOpener members={allMembers} circleId={circle.id} />
      </div>
    </div>
  )
}
