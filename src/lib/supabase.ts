
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zhhsribtekwpwnnmyoee.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoaHNyaWJ0ZWt3cHdubm15b2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTI4MjIsImV4cCI6MjA2NjU2ODgyMn0.WbHLwBHbONle_m4hSKBt1JL5Yaal_7JBko6UnqUtT4I'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Test {
  id: number
  title: string
  description: string
  created_at: string
  question_count: number
}

export interface Question {
  id: number
  test_id: number
  question_id: number
  image: string
  options: string[]
  correct: string
  subject: string
  type: string
}

export interface PremiumUser {
  id: number
  name: string
  device: string
  expires_at: string
  created_at: string
}
