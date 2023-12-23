import { supabase } from "@/supabase"
import NewGameOpener from "./new-game/new-game-opener"
import StatsServer from "./stats/stats-server"

export default async function Home() {
  const { data: allMembers } = await supabase.from("circle_members").select("*")
  if (!allMembers) return null
  return (
    <div className="mt-20">
      <StatsServer />

      <div className="mt-20">
        <NewGameOpener members={allMembers} />
      </div>
    </div>
  )
}
