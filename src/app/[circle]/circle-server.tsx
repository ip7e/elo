"use server"

import useSupabase from "../use-supabase"
import useUser from "../use-user"
import CircleClient from "./circle-client"
import { GameWithResults } from "./types"
import useIsAdmin from "./use-is-admin"

type Props = { circleId: number }

export default async function CircleServer({ circleId }: Props) {
  const supabase = await useSupabase()

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

  const isAdmin = await useIsAdmin(circleId)

  if (!allMembers) return null
  if (!recentGames) return null
  if (!stats) return null

  return (
    <CircleClient
      members={allMembers}
      recentGames={recentGames}
      stats={stats}
      isAdmin={isAdmin}
      circleId={circleId}
    />
  )
}
