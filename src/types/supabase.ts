export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      circle_members: {
        Row: {
          circle_id: number
          created_at: string
          id: number
          name: string | null
          user_id: string | null
          visibility: Database["public"]["Enums"]["visibility_state"]
        }
        Insert: {
          circle_id: number
          created_at?: string
          id?: number
          name?: string | null
          user_id?: string | null
          visibility?: Database["public"]["Enums"]["visibility_state"]
        }
        Update: {
          circle_id?: number
          created_at?: string
          id?: number
          name?: string | null
          user_id?: string | null
          visibility?: Database["public"]["Enums"]["visibility_state"]
        }
        Relationships: [
          {
            foreignKeyName: "public_circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
        ]
      }
      circles: {
        Row: {
          auto_hide_after_games: number
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          auto_hide_after_games?: number
          created_at?: string
          id?: number
          name: string
          slug: string
        }
        Update: {
          auto_hide_after_games?: number
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
          previous_elo: number
          winner: boolean | null
        }
        Insert: {
          created_at?: string
          elo: number
          game_id: number
          id?: number
          member_id: number
          previous_elo: number
          winner?: boolean | null
        }
        Update: {
          created_at?: string
          elo?: number
          game_id?: number
          id?: number
          member_id?: number
          previous_elo?: number
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
            foreignKeyName: "public_game_results_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "circle_members"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          circle_id: number
          comment: string | null
          created_at: string
          id: number
        }
        Insert: {
          circle_id: number
          comment?: string | null
          created_at?: string
          id?: number
        }
        Update: {
          circle_id?: number
          comment?: string | null
          created_at?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_games_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
        ]
      }
      member_invitations: {
        Row: {
          created_at: string
          email: string
          id: number
          invited_by: number
          member_id: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          invited_by: number
          member_id: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          invited_by?: number
          member_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_member_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "circle_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_member_invitations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "circle_members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      visibility_state: "auto" | "always_visible" | "always_hidden"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

