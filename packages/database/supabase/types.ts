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
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          icon: string
          parent_id: string | null
          seo_title: string
          seo_description: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string
          icon?: string
          parent_id?: string | null
          seo_title?: string
          seo_description?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string
          icon?: string
          parent_id?: string | null
          seo_title?: string
          seo_description?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          slug: string
          name: string
          description: string
          color: string
          usage_count: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string
          color?: string
          usage_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string
          color?: string
          usage_count?: number
          created_at?: string
        }
      }
      mcp_listings: {
        Row: {
          id: string
          slug: string
          title: string
          tagline: string
          description: string
          type: 'server' | 'client'
          category_id: string | null
          author_name: string
          author_email: string
          repository_url: string
          npm_package: string
          website_url: string
          documentation_url: string
          license: string
          version: string
          status: 'pending' | 'approved' | 'rejected'
          featured: boolean
          verified: boolean
          downloads_count: number
          stars_count: number
          view_count: number
          click_count: number
          submitted_by: string | null
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          tagline?: string
          description?: string
          type: 'server' | 'client'
          category_id?: string | null
          author_name?: string
          author_email?: string
          repository_url?: string
          npm_package?: string
          website_url?: string
          documentation_url?: string
          license?: string
          version?: string
          status?: 'pending' | 'approved' | 'rejected'
          featured?: boolean
          verified?: boolean
          downloads_count?: number
          stars_count?: number
          view_count?: number
          click_count?: number
          submitted_by?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          tagline?: string
          description?: string
          type?: 'server' | 'client'
          category_id?: string | null
          author_name?: string
          author_email?: string
          repository_url?: string
          npm_package?: string
          website_url?: string
          documentation_url?: string
          license?: string
          version?: string
          status?: 'pending' | 'approved' | 'rejected'
          featured?: boolean
          verified?: boolean
          downloads_count?: number
          stars_count?: number
          view_count?: number
          click_count?: number
          submitted_by?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      listing_tags: {
        Row: {
          id: string
          listing_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          tag_id: string
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          tag_id?: string
          created_at?: string
        }
      }
      code_examples: {
        Row: {
          id: string
          listing_id: string
          title: string
          description: string
          language: string
          framework: string
          code: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          title: string
          description?: string
          language?: string
          framework?: string
          code: string
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          title?: string
          description?: string
          language?: string
          framework?: string
          code?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      faqs: {
        Row: {
          id: string
          listing_id: string
          question: string
          answer: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          question: string
          answer: string
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          question?: string
          answer?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      use_cases: {
        Row: {
          id: string
          listing_id: string
          title: string
          description: string
          industry: string
          example: string
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          title: string
          description: string
          industry?: string
          example?: string
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          title?: string
          description?: string
          industry?: string
          example?: string
          order?: number
          created_at?: string
        }
      }
      social_links: {
        Row: {
          id: string
          listing_id: string
          platform: string
          url: string
          metrics: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          platform: string
          url: string
          metrics?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          platform?: string
          url?: string
          metrics?: Json
          created_at?: string
          updated_at?: string
        }
      }
      screenshots: {
        Row: {
          id: string
          listing_id: string
          url: string
          alt_text: string
          caption: string
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          url: string
          alt_text?: string
          caption?: string
          order?: number
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          url?: string
          alt_text?: string
          caption?: string
          order?: number
          created_at?: string
        }
      }
      promotions: {
        Row: {
          id: string
          listing_id: string
          type: string
          priority: number
          start_date: string
          end_date: string | null
          badge_text: string
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          type?: string
          priority?: number
          start_date?: string
          end_date?: string | null
          badge_text?: string
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          type?: string
          priority?: number
          start_date?: string
          end_date?: string | null
          badge_text?: string
          created_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          listing_id: string | null
          event_type: string
          event_data: Json
          user_agent: string
          referrer: string
          created_at: string
        }
        Insert: {
          id?: string
          listing_id?: string | null
          event_type: string
          event_data?: Json
          user_agent?: string
          referrer?: string
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string | null
          event_type?: string
          event_data?: Json
          user_agent?: string
          referrer?: string
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type MCPListing = Database['public']['Tables']['mcp_listings']['Row'];
export type MCPListingInsert = Database['public']['Tables']['mcp_listings']['Insert'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type CodeExample = Database['public']['Tables']['code_examples']['Row'];
export type FAQ = Database['public']['Tables']['faqs']['Row'];
export type UseCase = Database['public']['Tables']['use_cases']['Row'];
export type SocialLink = Database['public']['Tables']['social_links']['Row'];
export type Screenshot = Database['public']['Tables']['screenshots']['Row'];
export type Promotion = Database['public']['Tables']['promotions']['Row'];
export type Analytics = Database['public']['Tables']['analytics']['Row'];

export interface MCPListingWithRelations extends MCPListing {
  category?: Category | null;
  tags?: Tag[];
  code_examples?: CodeExample[];
  faqs?: FAQ[];
  use_cases?: UseCase[];
  social_links?: SocialLink[];
  screenshots?: Screenshot[];
  promotions?: Promotion[];
}
