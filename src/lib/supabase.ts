import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from './supabase-config';

export const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

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