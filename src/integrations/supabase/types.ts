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
      ad_banners: {
        Row: {
          created_at: string
          created_by: string | null
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          link_url: string | null
          position: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string | null
          position?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          link_url?: string | null
          position?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          account_type: string | null
          actor_email: string | null
          actor_name: string | null
          actor_profile_id: string | null
          country: string | null
          created_at: string
          email_sent: boolean
          email_sent_at: string | null
          id: string
          message: string | null
          metadata: Json
          target_id: string | null
          target_url: string | null
          type: Database["public"]["Enums"]["admin_notification_type"]
          video_url: string | null
        }
        Insert: {
          account_type?: string | null
          actor_email?: string | null
          actor_name?: string | null
          actor_profile_id?: string | null
          country?: string | null
          created_at?: string
          email_sent?: boolean
          email_sent_at?: string | null
          id?: string
          message?: string | null
          metadata?: Json
          target_id?: string | null
          target_url?: string | null
          type: Database["public"]["Enums"]["admin_notification_type"]
          video_url?: string | null
        }
        Update: {
          account_type?: string | null
          actor_email?: string | null
          actor_name?: string | null
          actor_profile_id?: string | null
          country?: string | null
          created_at?: string
          email_sent?: boolean
          email_sent_at?: string | null
          id?: string
          message?: string | null
          metadata?: Json
          target_id?: string | null
          target_url?: string | null
          type?: Database["public"]["Enums"]["admin_notification_type"]
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_actor_profile_id_fkey"
            columns: ["actor_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      movement_supporters: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      player_parent_contacts: {
        Row: {
          created_at: string
          parent_email: string | null
          parent_name: string | null
          parent_phone: string | null
          player_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          player_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          parent_email?: string | null
          parent_name?: string | null
          parent_phone?: string | null
          player_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_parent_contacts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
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
          competitions: Json
          created_at: string
          endurance: number | null
          eu_passport: boolean
          finishing: number | null
          game_vision: number | null
          height: string | null
          id: string
          name: string
          native_language: string | null
          other_languages: string[] | null
          photo_url: string | null
          position: string
          preferred_foot: string | null
          profile_id: string
          representation_status: string
          representative_name: string | null
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
          competitions?: Json
          created_at?: string
          endurance?: number | null
          eu_passport?: boolean
          finishing?: number | null
          game_vision?: number | null
          height?: string | null
          id?: string
          name: string
          native_language?: string | null
          other_languages?: string[] | null
          photo_url?: string | null
          position: string
          preferred_foot?: string | null
          profile_id: string
          representation_status?: string
          representative_name?: string | null
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
          competitions?: Json
          created_at?: string
          endurance?: number | null
          eu_passport?: boolean
          finishing?: number | null
          game_vision?: number | null
          height?: string | null
          id?: string
          name?: string
          native_language?: string | null
          other_languages?: string[] | null
          photo_url?: string | null
          position?: string
          preferred_foot?: string | null
          profile_id?: string
          representation_status?: string
          representative_name?: string | null
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
          target_age_max: number | null
          target_age_min: number | null
          target_countries: string[] | null
          target_positions: string[] | null
          updated_at: string
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
          target_age_max?: number | null
          target_age_min?: number | null
          target_countries?: string[] | null
          target_positions?: string[] | null
          updated_at?: string
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
          target_age_max?: number | null
          target_age_min?: number | null
          target_countries?: string[] | null
          target_positions?: string[] | null
          updated_at?: string
          verification_status?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      scouts_private: {
        Row: {
          created_at: string
          references_info: string | null
          scout_id: string
          updated_at: string
          verification_doc_url: string | null
        }
        Insert: {
          created_at?: string
          references_info?: string | null
          scout_id: string
          updated_at?: string
          verification_doc_url?: string | null
        }
        Update: {
          created_at?: string
          references_info?: string | null
          scout_id?: string
          updated_at?: string
          verification_doc_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scouts_private_scout_id_fkey"
            columns: ["scout_id"]
            isOneToOne: true
            referencedRelation: "scouts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_movement_supporters_count: { Args: never; Returns: number }
      get_public_player: {
        Args: { _player_id: string }
        Returns: {
          achievements: string
          age: number
          birth_year: number
          category: string
          city: string
          club: string
          competitions: Json
          created_at: string
          endurance: number
          eu_passport: boolean
          finishing: number
          game_vision: number
          height: string
          id: string
          name: string
          native_language: string
          other_languages: string[]
          photo_url: string
          position: string
          preferred_foot: string
          profile_id: string
          representation_status: string
          representative_name: string
          secondary_position: string
          speed: number
          technique: number
          video_url: string
          weight: string
          years_playing: number
        }[]
      }
      get_public_players: {
        Args: never
        Returns: {
          achievements: string
          age: number
          birth_year: number
          category: string
          city: string
          club: string
          competitions: Json
          created_at: string
          endurance: number
          eu_passport: boolean
          finishing: number
          game_vision: number
          height: string
          id: string
          name: string
          native_language: string
          other_languages: string[]
          photo_url: string
          position: string
          preferred_foot: string
          profile_id: string
          representation_status: string
          representative_name: string
          secondary_position: string
          speed: number
          technique: number
          video_url: string
          weight: string
          years_playing: number
        }[]
      }
      get_public_scouts: {
        Args: never
        Returns: {
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          photo_url: string
          player_type_sought: string
          previous_clubs: string[]
          target_age_max: number
          target_age_min: number
          target_countries: string[]
          target_positions: string[]
          verification_status: string
          years_experience: number
        }[]
      }
      has_club_or_scout_profile: {
        Args: { _user_id: string }
        Returns: boolean
      }
      has_explorer_access: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_club_or_scout: { Args: { _user_id: string }; Returns: boolean }
      is_player_owner: { Args: { _player_id: string }; Returns: boolean }
    }
    Enums: {
      admin_notification_type:
        | "new_player"
        | "new_club"
        | "new_scout"
        | "new_video"
        | "new_contact_request"
      app_role: "admin" | "moderator" | "user"
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
    Enums: {
      admin_notification_type: [
        "new_player",
        "new_club",
        "new_scout",
        "new_video",
        "new_contact_request",
      ],
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
