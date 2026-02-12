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
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          subject: string | null
          message: string
          status: string
          is_read: boolean
          read_at: string | null
          replied_at: string | null
          reply_content: string | null
          has_attachments: boolean
          attachment_urls: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject?: string | null
          message: string
          status?: string
          is_read?: boolean
          read_at?: string | null
          replied_at?: string | null
          reply_content?: string | null
          has_attachments?: boolean
          attachment_urls?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string | null
          message?: string
          status?: string
          is_read?: boolean
          read_at?: string | null
          replied_at?: string | null
          reply_content?: string | null
          has_attachments?: boolean
          attachment_urls?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: number
          site_name: string
          site_description: string | null
          site_logo_url: string | null
          site_favicon_url: string | null
          contact_email: string
          smtp_enabled: boolean
          smtp_host: string | null
          smtp_port: number | null
          smtp_secure: boolean
          smtp_user: string | null
          smtp_pass: string | null
          hero_title: string | null
          hero_subtitle: string | null
          meta_keywords: string | null
          meta_author: string | null
          google_analytics_id: string | null
          social_links: Json
          custom_css: string | null
          maintenance_mode: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: number
          site_name?: string
          site_description?: string | null
          site_logo_url?: string | null
          site_favicon_url?: string | null
          contact_email?: string
          smtp_enabled?: boolean
          smtp_host?: string | null
          smtp_port?: number | null
          smtp_secure?: boolean
          smtp_user?: string | null
          smtp_pass?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          meta_keywords?: string | null
          meta_author?: string | null
          google_analytics_id?: string | null
          social_links?: Json
          custom_css?: string | null
          maintenance_mode?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: number
          site_name?: string
          site_description?: string | null
          site_logo_url?: string | null
          site_favicon_url?: string | null
          contact_email?: string
          smtp_enabled?: boolean
          smtp_host?: string | null
          smtp_port?: number | null
          smtp_secure?: boolean
          smtp_user?: string | null
          smtp_pass?: string | null
          hero_title?: string | null
          hero_subtitle?: string | null
          meta_keywords?: string | null
          meta_author?: string | null
          google_analytics_id?: string | null
          social_links?: Json
          custom_css?: string | null
          maintenance_mode?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      admin_activity_log: {
        Row: {
          id: string
          admin_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          details: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string | null
          action?: string
          resource_type?: string
          resource_id?: string | null
          details?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_log_admin_id_fkey"
            columns: ["admin_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_admin_activity: {
        Args: {
          p_admin_id: string
          p_action: string
          p_resource_type: string
          p_resource_id?: string
          p_details?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Custom types for the application
export type ContactMessage = Tables<'contact_messages'>
export type SiteSettings = Tables<'site_settings'>
export type AdminActivityLog = Tables<'admin_activity_log'>

export interface MessageStats {
  total: number
  unread: number
  read: number
  replied: number
  archived: number
}

export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

export interface ReplyFormData {
  to: string
  subject: string
  message: string
  originalMessageId: string
}
