import { supabase } from "@/supabase"
import Chart from "./chart/chart"
import NewGameOpener from "./new-game/new-game-opener"

export default async function Home() {
  const { data: allMembers } = await supabase.from("circle_members").select("*")
  const { data: leaderBoard } = await supabase
    .from("members_elo")
    .select(`*, stats:members_stats(member_id, *)`)
    .filter("stats.total_games", "gte", 5)
    .order("elo", {
      ascending: false,
    })

  if (!leaderBoard) return null
  if (!allMembers) return null

  const topMembers = leaderBoard.filter((member) => member.stats[0]?.total_games! >= 5)

  return (
    <div className="mt-20">
      <table className="table border-separate border-spacing-x-3 border-spacing-y-2">
        <thead>
          <tr className="text-sm lowercase align-text-top opacity-60">
            <th className="invisible">Rank</th>
            <th className="invisible w-full">Player</th>
            <th className="text-center font-mono font-bold opacity-30 text-lg">elo</th>
            <th className="text-center font-mono font-bold opacity-30 text-lg">%</th>
          </tr>
        </thead>

        <tbody>
          {topMembers?.map(({ display_name, elo, stats }, i) => (
            <tr key={i}>
              <td className="font-mono font-bold text-right text-xl opacity-20">{i + 1}</td>
              <td className="w-full text-lg font-bold">{display_name}</td>
              <td className="font-mono font-bold text-right text-lg ">{elo}</td>
              <td className="font-mono font-bold text-right text-lg opacity-20">
                {Math.round(((stats[0]?.total_wins || 1) / (stats[0]?.total_games || 1)) * 100)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Chart members={topMembers} />

      <div className="mt-20">
        <NewGameOpener members={allMembers} />
      </div>
    </div>
  )
}
