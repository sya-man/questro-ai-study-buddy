import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  gemini_api_key?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  file_type?: 'pdf' | 'image';
  file_url?: string;
  created_at: string;
}

export interface MCQQuestion {
  id: string;
  user_id: string;
  session_id?: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
  source_pdf?: string;
  created_at: string;
}