import { supabase } from "@/supabase"

export const getAllMembers = async () =>
  supabase.from("circle_members").select("*")

export const getMembersWithElo = async () =>
  supabase.from("members_with_elo").select(`*`)

export const createGameSession = async (
  memberIds: number[],
  winnerIds: number[],
) => {
  const { data, error } = await fetch("/api/create-game-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ memberIds, winnerIds }),
  }).then((res) => res.json())

  return { data, error }
}
