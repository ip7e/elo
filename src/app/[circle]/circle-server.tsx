"use server"

import { createServerClient } from "@/utils/supabase/server"
import { GameWithResults } from "./types"
import CircleClient from "./circle-client"

type Props = { circleId: number }

export default async function CircleServer({ circleId }: Props) {
  const supabase = createServerClient()

  const { data: stats, error } = await supabase
    .from("members_stats")
    .select("*")
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
