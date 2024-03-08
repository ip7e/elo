"use server"

import { supabase } from "@/supabase"
import CircleClient from "./circle-client"
import { GameWithResults } from "./types"

type Props = { circleId: number }

export default async function CircleServer({ circleId }: Props) {
  const { data: stats, error } = await supabase
    .from("members_stats")
    .select("*")
    .filter("total_games", "gt", 4)
    .eq("circle_id", circleId)
    .order("elo", { ascending: false })

  const { data: recentGames }: { data: GameWithResults[] | null } = await supabase
    .from("games")
    .select("*, game_results(*)")
    .order("created_at", { ascending: false })
    .eq("circle_id", circleId)
    .limit(20)

  const { data: allMembers } = await supabase
    .from("circle_members")
    .select("*")
    .eq("circle_id", circleId)

  if (!allMembers) return null
  if (!recentGames) return null
  if (!stats) return null

  return (
    <CircleClient
      members={allMembers}
      recentGames={recentGames}
      stats={stats}
      circleId={circleId}
    />
  )
}
