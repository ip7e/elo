import { supabase } from "@/supabase"
import calculateElo from "./calculate-elo"

const DEFAULT_ELO = 1100

type NewGameSessionRequest = {
  memberIds: number[]
  winnerIds: number[]
}
const MessageResponse = (status: Number, message: string) =>
  Response.json({ status, body: { message } })

export async function POST(request: Request) {
  const { memberIds, winnerIds } = (await request.json()) as NewGameSessionRequest

  if (!memberIds.length || !winnerIds.length)
    return MessageResponse(400, "missing member ids and/or winner ids")

  const { data: membersElo, error } = await supabase.from("members_elo").select(`*`)

  if (!membersElo) throw new Error("Failed to get members elo")

  const existingEloMap = Object.fromEntries(membersElo.map((member) => [member.id, member.elo]))
  const winnersMap = Object.fromEntries(winnerIds.map((id) => [id, true]))

  const members = memberIds.map((id) => ({
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

  const { data: game } = await supabase.from("games").insert({ circle_id: 1 }).select()

  if (!game?.length) return MessageResponse(500, "Failed to create game")

  await supabase
    .from("game_results")
    .insert(
      Object.entries(newElos).map(([id, result]) => ({
        member_id: +id,
        game_id: game[0].id,
        winner: winnersMap[id],
        elo: result.elo,
      })),
    )
    .select()

  return Response.json({
    status: 200,
    body: {
      message: "Hello World",
    },
  })
}
