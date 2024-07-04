import { supabase } from "@/supabase"
import calculateElo from "./calculate-elo"
import { revalidatePath } from "next/cache"

const DEFAULT_ELO = 1100

type NewGameSessionRequest = {
  loserIds: number[]
  winnerIds: number[]
  circleId: number
}
const MessageResponse = (status: Number, message: string) =>
  Response.json({ status, body: { message } })

export async function POST(request: Request) {
  const { loserIds, winnerIds, circleId } = (await request.json()) as NewGameSessionRequest

  if (!loserIds.length || !winnerIds.length)
    return MessageResponse(400, "missing member ids and/or winner ids")

  const { data: membersStats, error } = await supabase
    .from("members_stats")
    .select(`*`)
    .eq("circle_id", circleId)

  const { data: circle } = await supabase.from("circles").select().eq("id", circleId).single()

  if (!membersStats) throw new Error("Failed to get members elo")

  const existingEloMap = Object.fromEntries(
    membersStats.map((member) => [member.member_id, member.elo]),
  )
  const winnersMap = Object.fromEntries(winnerIds.map((id) => [id, true]))

  const members = [...loserIds, ...winnerIds].map((id) => ({
    id,
    startElo: existingEloMap[id] || DEFAULT_ELO,
    isWinner: !!winnersMap[id],
    rwr: 0,
    newElo: 0,
    delta: 0,
  }))

  const newElos = calculateElo(
    members.map((member) => ({
      id: member.id,
      startElo: member.startElo,
      isWinner: member.isWinner,
    })),
  )

  const { data: game } = await supabase.from("games").insert({ circle_id: circleId }).select()

  if (!game?.length) return MessageResponse(500, "Failed to create game")

  await supabase
    .from("game_results")
    .insert(
      Object.entries(newElos).map(([id, result]) => ({
        member_id: +id,
        game_id: game[0].id,
        winner: winnersMap[id],
        elo: result.elo,
        previous_elo: existingEloMap[id] || DEFAULT_ELO,
      })),
    )
    .select()

  console.log(`/${circle?.slug}`)
  revalidatePath(`/`, "layout")

  return Response.json({
    status: 200,
    body: {
      message: "Hello World",
    },
  })
}
