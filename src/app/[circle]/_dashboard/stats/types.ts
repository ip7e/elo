import { Member } from "@/server/types"

export type OpponentRecord = {
  opponent: Member
  wins: number
  losses: number
  totalGames: number
  winRate: number
}

export type StreakInfo = {
  current: { type: 'win' | 'loss'; count: number }
  longestWin: number
  longestLoss: number
}

export type MemberStatsData = {
  member: Member

  totalGames: number
  wins: number
  losses: number
  winRate: number

  currentElo: number
  peakElo: number
  lowestElo: number
  totalEloChange: number
  avgEloChangePerGame: number

  opponentRecords: OpponentRecord[]
  easiestOpponent: OpponentRecord | null
  toughestOpponent: OpponentRecord | null
  mostFrequentOpponent: OpponentRecord | null

  streaks: StreakInfo

  recentForm: Array<{ participated: boolean; won: boolean; gameId: number }>

  participationRate: number
}
