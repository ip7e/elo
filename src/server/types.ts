import { Tables } from "@/types/supabase"

export type GameWithResults = Tables<"games"> & {
  game_results: Tables<"game_results">[]
}

export type Member = Tables<"circle_members">
export type Circle = Tables<"circles">
export type GameResult = Tables<"game_results">

export type CirclePlanStatus = "trial" | "locked" | "pro"

export type CirclePlan = {
  status: CirclePlanStatus
  gamesPlayed: number
  gamesLeft: number
  isClaimable: boolean
}

export type MemberStats = Member & {
  latest_game: GameResult
  first_game: GameResult
  total_wins: number
  total_games: number
  elo: number
  recent_missed_games: number
  isVisible: boolean
}
