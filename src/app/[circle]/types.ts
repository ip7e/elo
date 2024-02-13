import { Tables } from "@/types/supabase"

export type MemberStats = Tables<"members_stats">

export type GameWithResults = Tables<"games"> & {
  game_results: Tables<"game_results">[]
}

export type Stat = Tables<"members_stats">
export type Member = Tables<"members">
export type Circle = Tables<"circles">
