type MemberInfo = {
  id: number
  startElo: number
  isWinner: boolean
}

type Outcome = {
  elo: number
  delta: number
}

const ELO_K = 32
export const DEFAULT_ELO = 1100

export default function calculateElo(
  startingData: Record<number, MemberInfo>,
): Record<number, Outcome> {
  const members = Object.values(startingData)
  const rwrMap: Record<number, number> = {}
  const result: Record<number, Outcome> = {}

  let member1: { startElo: any; id?: number; isWinner?: boolean }
  let totalRWR = 0

  // calculate relative win rates
  members.forEach((member) => {
    member1 = member1 || member
    const rwr = Math.pow(10, (member.startElo - member1.startElo) / 400)
    totalRWR += rwr
    rwrMap[member.id] = rwr
  })

  members.forEach((member) => {
    const probability = rwrMap[member.id] / totalRWR
    const multiplier = member.isWinner ? 1 : 0
    const eloChange = Math.round(ELO_K * (1 * multiplier - probability))
    result[member.id] = {
      elo: member.startElo + eloChange,
      delta: eloChange,
    }
  })

  return result
}
