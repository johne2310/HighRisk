import { createClient } from '@supabase/supabase-js'
// import { useAuthStore } from '../auth-store.js'

// Supabase configuration
// Replace these with your own Supabase project URL and anon key
// You can find these in your Supabase project settings > API

const supabaseKey = import.meta.env.VITE_SUPABASE_LINK
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

// const authStore = useAuthStore()
// TODO - move to survey store
// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

// Set up real-time subscription functions
export const subscribeToAudits = (callback) => {
  return supabase
    .channel('patient_audits_changes')
    .on(
      //
      'postgres_changes',
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
export const saveAudit = async(auditData) => {
  return supabase.from('patient_audits').insert([auditData])
}

/**
 * Get all patient audits
 * @returns {Promise} - The result of the select operation
 */
export const getAudits = async() => {
  return supabase
    .from('patient_audits')
    .select('*')
    // .eq('user_id', authStore.userDetails.id)
    .order('auditDate', { ascending: false })
}

/**
 * Get high-risk patient audits (patients on 5+ medications)
 * @returns {Promise} - The result of the select operation
 */
export const getHighRiskAudits = async() => {
  return supabase
    .from('patient_audits')
    .select('*')
    .eq('isHighRisk', true)
    .order('auditDate', { ascending: false })
}

/**
 * Update an existing audit
 * @param {string} id - The ID of the audit to update
 * @param {Object} auditData - The updated audit data
 * @returns {Promise} - The result of the update operation
 */
export const updateAudit = async(id, auditData) => {
  return await supabase
    .from('patient_audits')
    .update(auditData)
    .eq('id', id)
    .select()
}

/*
 * Delete an audit
 * @param {string} id - The ID of the audit to delete
 * @returns {Promise} - The result of the delete operation
 */
export const deleteAudit = async(id) => {
  return await supabase.from('patient_audits').delete().eq('id', id)
}

export default supabase
