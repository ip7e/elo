import { supabase } from "@/supabase"

const DEFAULT_ELO = 1100
const ELO_K = 32

type NewGameSessionRequest = {
  memberIds: number[]
  winnerIds: number[]
}
const MessageResponse = (status: Number, message: string) =>
  Response.json({ status, body: { message } })

export async function POST(request: Request) {
  // -- get data first --
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

  let member1: { startElo: any; id?: number; isWinner?: boolean }
  let totalRWR = 0

  // calculate relative win rates
  members.forEach((member) => {
    member1 = member1 || member
    const rwr = Math.pow(10, (member.startElo - member1.startElo) / 400)
    totalRWR += rwr
    member.rwr = rwr
  })

  members.forEach((member) => {
    const probability = member.rwr / totalRWR
    const multiplier = member.isWinner ? 1 : 0
    const eloChange = Math.round(ELO_K * (1 * multiplier - probability))
    member.newElo = member.startElo + eloChange
    member.delta = eloChange
  })

  console.log(members)

  return Response.json({
    status: 200,
    body: {
      message: "Hello World",
    },
  })
}
