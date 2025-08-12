// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      conspiracy_theories: {
        Row: {
          id: string;
          content: string;
          category: string;
          classification: 'TOP SECRET' | 'SECRET' | 'CONFIDENTIAL';
          created_at: string;
          updated_at: string;
          prompt_used: string | null;
          user_id: string | null;
          is_favorite: boolean;
          share_count: number;
        };
        Insert: {
          id?: string;
          content: string;
          category: string;
          classification?: 'TOP SECRET' | 'SECRET' | 'CONFIDENTIAL';
          created_at?: string;
          updated_at?: string;
          prompt_used?: string | null;
          user_id?: string | null;
          is_favorite?: boolean;
          share_count?: number;
        };
        Update: {
          id?: string;
          content?: string;
          category?: string;
          classification?: 'TOP SECRET' | 'SECRET' | 'CONFIDENTIAL';
          created_at?: string;
          updated_at?: string;
          prompt_used?: string | null;
          user_id?: string | null;
          is_favorite?: boolean;
          share_count?: number;
        };
      };
      theory_analytics: {
        Row: {
          id: string;
          theory_id: string;
          event_type: 'generated' | 'shared' | 'saved' | 'copied';
          platform: string | null;
          created_at: string;
          user_id: string | null;
          metadata: Record<string, any> | null;
        };
        Insert: {
          id?: string;
          theory_id: string;
          event_type: 'generated' | 'shared' | 'saved' | 'copied';
          platform?: string | null;
          created_at?: string;
          user_id?: string | null;
          metadata?: Record<string, any> | null;
        };
        Update: {
          id?: string;
          theory_id?: string;
          event_type?: 'generated' | 'shared' | 'saved' | 'copied';
          platform?: string | null;
          created_at?: string;
          user_id?: string | null;
          metadata?: Record<string, any> | null;
        };
      };
    };
  };
}

export type ConspiracyTheoryRow = Database['public']['Tables']['conspiracy_theories']['Row'];
export type ConspiracyTheoryInsert = Database['public']['Tables']['conspiracy_theories']['Insert'];
export type TheoryAnalyticsInsert = Database['public']['Tables']['theory_analytics']['Insert'];