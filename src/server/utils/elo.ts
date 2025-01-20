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
  const result: Record<number, Outcome> = {}

  // Count winners and losers
  const winners = members.filter((m) => m.isWinner)
  const losers = members.filter((m) => !m.isWinner)

  // Initialize results
  members.forEach((member) => {
    result[member.id] = {
      elo: member.startElo,
      delta: 0,
    }
  })

  // Each winner competes against each loser once
  winners.forEach((winner) => {
    losers.forEach((loser) => {
      // Calculate expected scores
      const expectedWinnerScore = 1 / (1 + Math.pow(10, (loser.startElo - winner.startElo) / 400))
      const expectedLoserScore = 1 - expectedWinnerScore

      // Calculate Elo changes
      // Normalize by number of winners to prevent multiple penalties
      const delta = Math.round((ELO_K * (1 - expectedWinnerScore)) / winners.length)

      // Apply changes
      result[winner.id].delta += delta
      result[loser.id].delta -= delta
    })
  })

  // Apply accumulated changes
  members.forEach((member) => {
    result[member.id].elo = member.startElo + result[member.id].delta
  })

  return result
}
