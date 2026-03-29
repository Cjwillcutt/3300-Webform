import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SurveyResponse = {
  id?: number;
  after_class_activity: string;
  state: string;
  year_in_college: string;
  activities: string[];
  other_activity?: string | null;
  study_hours: string;
  study_preference: string;
  created_at?: string;
};
