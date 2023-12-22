import { Tables } from "@/types/supabase"

export type MemberStatsWithElo = Tables<"members_stats"> & { elo: number }

export type GameWithGameResults = Tables<"games"> & { game_results: Tables<"game_results">[] }
