import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (you can generate these with `supabase gen types typescript --project-id your-project-id`)
export type Database = {
  public: {
    Tables: {
      // Add your table types here as you create them in Supabase
      users: {
        Row: {
          id: string;
          email: string;
          firebase_uid: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          firebase_uid: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          firebase_uid?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add more table types as needed
    };
  };
};
