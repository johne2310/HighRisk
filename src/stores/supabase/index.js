import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Replace these with your own Supabase project URL and anon key
// You can find these in your Supabase project settings > API


console.log('Supabase URL: ', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase KEY: ', import.meta.env.VITE_SUPABASE_KEY)

const supabaseKey = process.env.VITE_SUPABASE_KEY
const supabaseUrl = process.env.VITE_SUPABASE_URL


// const supabaseUrl = 'https://lmvvkbraxtmilcpxbijt.supabase.co' // e.g., 'https://yourproject.supabase.co'
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdnZrYnJheHRtaWxjcHhiaWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NjQ2MTQsImV4cCI6MjA2MTE0MDYxNH0.xZKZFRFdmKB97sI6t7ygmwg3N1P-RUMUtsydLnopVwY' // Your project's anon/public key

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)
console.log('Supabase client initialized')


// Set up real-time subscription functions
export const subscribeToAudits = (callback) => {
  return supabase
    .channel('patient_audits_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'patient_audits' 
      }, 
      (payload) => {
        callback(payload)
      }
    )
    .subscribe()
}

/**
 * Save a patient audit to Supabase
 * @param {Object} auditData - The audit data to save
 * @returns {Promise} - The result of the insert operation
 */
export const saveAudit = async (auditData) => {
  return await supabase.from('patient_audits').insert([auditData])
}

/**
 * Get all patient audits
 * @returns {Promise} - The result of the select operation
 */
export const getAudits = async () => {
  return await supabase.from('patient_audits').select('*').order('auditDate', { ascending: false })
}

/**
 * Get high-risk patient audits (patients on 5+ medications)
 * @returns {Promise} - The result of the select operation
 */
export const getHighRiskAudits = async () => {
  return await supabase
    .from('patient_audits')
    .select('*')
    .eq('isHighRisk', true)
    .order('auditDate', { ascending: false })
}

/**
 * Get audit statistics
 * @returns {Promise} - Object containing statistics
 */
export const getAuditStats = async () => {
  const { data: allAudits, error: allError } = await supabase.from('patient_audits').select('*')

  const { data: highRiskAudits, error: highRiskError } = await supabase
    .from('patient_audits')
    .select('*')
    .eq('isHighRisk', true)

  const today = new Date().toISOString().substr(0, 10)
  const { data: todayAudits, error: todayError } = await supabase
    .from('patient_audits')
    .select('*')
    .eq('auditDate', today)

  if (allError || highRiskError || todayError) {
    console.error('Error fetching stats:', { allError, highRiskError, todayError })
    return {
      totalAudits: 0,
      highRiskCount: 0,
      todayCount: 0,
      highRiskPercentage: 0,
    }
  }

  const totalAudits = allAudits ? allAudits.length : 0
  const highRiskCount = highRiskAudits ? highRiskAudits.length : 0
  const todayCount = todayAudits ? todayAudits.length : 0
  const highRiskPercentage = totalAudits > 0 ? (highRiskCount / totalAudits) * 100 : 0

  return {
    totalAudits,
    highRiskCount,
    todayCount,
    highRiskPercentage: Math.round(highRiskPercentage),
  }
}

/**
 * Update an existing audit
 * @param {string} id - The ID of the audit to update
 * @param {Object} auditData - The updated audit data
 * @returns {Promise} - The result of the update operation
 */
export const updateAudit = async (id, auditData) => {
  return await supabase.from('patient_audits').update(auditData).eq('id', id)
}

/**
 * Delete an audit
 * @param {string} id - The ID of the audit to delete
 * @returns {Promise} - The result of the delete operation
 */
export const deleteAudit = async (id) => {
  return await supabase.from('patient_audits').delete().eq('id', id)
}

export default supabase
