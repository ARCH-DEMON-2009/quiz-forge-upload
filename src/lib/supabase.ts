
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zhhsribtekwpwnnmyoee.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoaHNyaWJ0ZWt3cHdubm15b2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5OTI4MjIsImV4cCI6MjA2NjU2ODgyMn0.WbHLwBHbONle_m4hSKBt1JL5Yaal_7JBko6UnqUtT4I'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types matching your actual schema
export interface Test {
  id: string
  title: string
  description: string
  created_at: string
  total_questions: number
}

export interface Question {
  id: string
  test_id: string
  image: string
  options: string[]
  correct: string
  subject: string
  type: string
}

export interface PremiumUser {
  id: string
  name: string
  device_id: string
  expires_at: string
  purchased_at: string
  payment_id: string
}

export interface UserTrial {
  device_id: string
  trial_start: string
  delete_trial?: string // New field for admin trial deletion
}
