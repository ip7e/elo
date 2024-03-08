import { supabase } from "@/supabase"
import HistoryClient from "./history-client"

type Props = {
  circleId: number
}

export default async function HistoryServer({ circleId }: Props) {
  const { data: history } = await supabase
    .from("games")
    .select("*, game_results(*) ")
    .eq("circle_id", circleId)
    .order("created_at", { ascending: false })

  const { data: members } = await supabase
    .from("circle_members")
    .select("*")
    .eq("circle_id", circleId)

  if (!history) return null
  if (!members) return null

  return <HistoryClient games={history} members={members} />
}
