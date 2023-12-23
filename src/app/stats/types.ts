import { Tables } from "@/types/supabase"

export type MemberStats = Tables<"members_stats">

export type GameWithGameResults = Tables<"games"> & { game_results: Tables<"game_results">[] }
