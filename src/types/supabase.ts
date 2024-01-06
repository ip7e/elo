export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      circle_members: {
        Row: {
          circle_id: number
          created_at: string
          display_name: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          circle_id: number
          created_at?: string
          display_name?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          circle_id?: number
          created_at?: string
          display_name?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "circle_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      circles: {
        Row: {
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      game_results: {
        Row: {
          created_at: string
          elo: number
          game_id: number
          id: number
          member_id: number
          winner: boolean | null
        }
        Insert: {
          created_at?: string
          elo: number
          game_id: number
          id?: number
          member_id: number
          winner?: boolean | null
        }
        Update: {
          created_at?: string
          elo?: number
          game_id?: number
          id?: number
          member_id?: number
          winner?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "game_results_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_results_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "members_stats"
            referencedColumns: ["first_game"]
          },
          {
            foreignKeyName: "game_results_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "members_stats"
            referencedColumns: ["latest_game"]
          },
          {
            foreignKeyName: "game_results_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "circle_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_results_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members_elo"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "game_results_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members_stats"
            referencedColumns: ["member_id"]
          }
        ]
      }
      games: {
        Row: {
          circle_id: number
          created_at: string
          id: number
          location: string | null
        }
        Insert: {
          circle_id: number
          created_at?: string
          id?: number
          location?: string | null
        }
        Update: {
          circle_id?: number
          created_at?: string
          id?: number
          location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "games_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      members_elo: {
        Row: {
          circle_id: number | null
          display_name: string | null
          elo: number | null
          member_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          }
        ]
      }
      members_stats: {
        Row: {
          circle_id: number | null
          display_name: string | null
          elo: number | null
          first_game: number | null
          latest_game: number | null
          member_id: number | null
          total_games: number | null
          total_wins: number | null
        }
        Relationships: [
          {
            foreignKeyName: "circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
