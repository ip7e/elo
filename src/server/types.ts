import { Tables } from "@/types/supabase"

export type GameWithResults = Tables<"games"> & {
  game_results: Tables<"game_results">[]
}

export type MembersWithStats = Tables<"circle_members"> & {
  wins: { count: number }
  latest_game: Tables<"game_results">
  first_game: Tables<"game_results">
}

export type Stat = Tables<"members_stats">
export type Member = Tables<"circle_members">
export type Circle = Tables<"circles">
