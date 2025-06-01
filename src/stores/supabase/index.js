import { createClient } from '@supabase/supabase-js'
// import { useAuthStore } from '../auth-store.js'

// Supabase configuration
// Replace these with your own Supabase project URL and anon key
// You can find these in your Supabase project settings > API

const supabaseKey = import.meta.env.VITE_SUPABASE_LINK
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Get high-risk patient audits (patients on 5+ medications)
 * @returns {Promise} - The result of the select operation
 */
export const getHighRiskAudits = async() => {
  return supabase
    .from('patient_audits')
    .select('*')
    .eq('isHighRisk', true)
    .order('created_at', { ascending: false })
}

export default supabase
