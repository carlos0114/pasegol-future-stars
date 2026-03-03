export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          metadata: Json | null
          profile_id: string
          target_id: string | null
          target_type: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          metadata?: Json | null
          profile_id: string
          target_id?: string | null
          target_type: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          profile_id?: string
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      club_scouts: {
        Row: {
          club_id: string
          id: string
          joined_at: string
          role: string | null
          scout_id: string
        }
        Insert: {
          club_id: string
          id?: string
          joined_at?: string
          role?: string | null
          scout_id: string
        }
        Update: {
          club_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          scout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_scouts_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "club_scouts_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: false
            referencedRelation: "scouts"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          address: string | null
          categories: string[] | null
          city: string | null
          club_type: string | null
          competitive_level: string | null
          contact_person: string | null
          contact_role: string | null
          country: string
          created_at: string
          founded_year: number | null
          id: string
          institutional_email: string | null
          league: string | null
          logo_url: string | null
          official_name: string
          phone: string | null
          profile_id: string
          social_facebook: string | null
          social_instagram: string | null
          social_twitter: string | null
          updated_at: string
          verification_doc_url: string | null
          verification_status: string
          website: string | null
        }
        Insert: {
          address?: string | null
          categories?: string[] | null
          city?: string | null
          club_type?: string | null
          competitive_level?: string | null
          contact_person?: string | null
          contact_role?: string | null
          country?: string
          created_at?: string
          founded_year?: number | null
          id?: string
          institutional_email?: string | null
          league?: string | null
          logo_url?: string | null
          official_name: string
          phone?: string | null
          profile_id: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          updated_at?: string
          verification_doc_url?: string | null
          verification_status?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          categories?: string[] | null
          city?: string | null
          club_type?: string | null
          competitive_level?: string | null
          contact_person?: string | null
          contact_role?: string | null
          country?: string
          created_at?: string
          founded_year?: number | null
          id?: string
          institutional_email?: string | null
          league?: string | null
          logo_url?: string | null
          official_name?: string
          phone?: string | null
          profile_id?: string
          social_facebook?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          updated_at?: string
          verification_doc_url?: string | null
          verification_status?: string
          website?: string | null
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          created_at: string
          id: string
          message: string
          player_id: string
          sender_profile_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          player_id: string
          sender_profile_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          player_id?: string
          sender_profile_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_sender_profile_id_fkey"
            columns: ["sender_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          player_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          player_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          player_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          achievements: string | null
          age: number
          birth_year: number | null
          category: string | null
          city: string | null
          club: string | null
          created_at: string
          endurance: number | null
          finishing: number | null
          game_vision: number | null
          height: string | null
          id: string
          name: string
          parent_email: string | null
          parent_name: string | null
          parent_phone: string | null
          photo_url: string | null
          position: string
          preferred_foot: string | null
          profile_id: string
          secondary_position: string | null
          speed: number | null
          technique: number | null
          updated_at: string
          video_url: string | null
          weight: string | null
          years_playing: number | null
        }
        Insert: {
          achievements?: string | null
          age: number
          birth_year?: number | null
          category?: string | null
          city?: string | null
          club?: string | null
          created_at?: string
          endurance?: number | null
          finishing?: number | null
          game_vision?: number | null
          height?: string | null
          id?: string
          name: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          photo_url?: string | null
          position: string
          preferred_foot?: string | null
          profile_id: string
          secondary_position?: string | null
          speed?: number | null
          technique?: number | null
          updated_at?: string
          video_url?: string | null
          weight?: string | null
          years_playing?: number | null
        }
        Update: {
          achievements?: string | null
          age?: number
          birth_year?: number | null
          category?: string | null
          city?: string | null
          club?: string | null
          created_at?: string
          endurance?: number | null
          finishing?: number | null
          game_vision?: number | null
          height?: string | null
          id?: string
          name?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          photo_url?: string | null
          position?: string
          preferred_foot?: string | null
          profile_id?: string
          secondary_position?: string | null
          speed?: number | null
          technique?: number | null
          updated_at?: string
          video_url?: string | null
          weight?: string | null
          years_playing?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "players_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_type: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
          user_type?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      scouts: {
        Row: {
          account_status: string
          city: string | null
          country: string
          created_at: string
          full_name: string
          id: string
          photo_url: string | null
          player_type_sought: string | null
          previous_clubs: string[] | null
          professional_id: string | null
          profile_id: string
          references_info: string | null
          target_age_max: number | null
          target_age_min: number | null
          target_countries: string[] | null
          target_positions: string[] | null
          updated_at: string
          verification_doc_url: string | null
          verification_status: string
          years_experience: number | null
        }
        Insert: {
          account_status?: string
          city?: string | null
          country?: string
          created_at?: string
          full_name: string
          id?: string
          photo_url?: string | null
          player_type_sought?: string | null
          previous_clubs?: string[] | null
          professional_id?: string | null
          profile_id: string
          references_info?: string | null
          target_age_max?: number | null
          target_age_min?: number | null
          target_countries?: string[] | null
          target_positions?: string[] | null
          updated_at?: string
          verification_doc_url?: string | null
          verification_status?: string
          years_experience?: number | null
        }
        Update: {
          account_status?: string
          city?: string | null
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          photo_url?: string | null
          player_type_sought?: string | null
          previous_clubs?: string[] | null
          professional_id?: string | null
          profile_id?: string
          references_info?: string | null
          target_age_max?: number | null
          target_age_min?: number | null
          target_countries?: string[] | null
          target_positions?: string[] | null
          updated_at?: string
          verification_doc_url?: string | null
          verification_status?: string
          years_experience?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_player_owner: { Args: { _player_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
