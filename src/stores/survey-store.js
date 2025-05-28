import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import supabase from './supabase'
import {
  saveAudit,
  getAudits,
  getHighRiskAudits,
  getAuditStats,
  updateAudit,
  deleteAudit,
  subscribeToAudits,
} from './supabase'

export const useSurveyStore = defineStore('survey', () => {
  // State
  const audits = ref([])
  const highRiskAudits = ref([])
  const stats = ref({
    totalAudits: 0,
    highRiskCount: 0,
    todayCount: 0,
    highRiskPercentage: 0,
  })
  const loading = ref(false)
  const error = ref(null)
  let subscription = null

  // Assuming 'supabase' is your initialized Supabase client

  const getTodayAuditCount = async () => {
    const { data, err } = await supabase.rpc('get_today_audit_count')

    if (err) {
      console.error('Error fetching today audit count:', err)
    } else {
      console.log('Audits today:', data)
    }
  }

  // Getters
  const getAuditById = computed(() => {
    return (id) => audits.value.find((audit) => audit.id === id)
  })

  const getAuditsByHospital = computed(() => {
    return (hospital) => audits.value.filter((audit) => audit.hospital === hospital)
  })

  const getAuditsByWard = computed(() => {
    return (ward) => audits.value.filter((audit) => audit.ward === ward)
  })

  // Real-time subscription
  const subscribeToRealtimeUpdates = () => {
    // Unsubscribe from any existing subscription
    if (subscription) {
      subscription.unsubscribe()
    }

    // Create a new subscription
    subscription = subscribeToAudits((payload) => {
      console.log('Real-time update received:', payload)

      // Handle different types of changes
      const { eventType, new: newRecord, old: oldRecord } = payload

      if (eventType === 'INSERT') {
        // Add the new record to the audits array
        audits.value = [newRecord, ...audits.value]
        // Update high-risk audits if applicable
        if (newRecord.isHighRisk) {
          highRiskAudits.value = [newRecord, ...highRiskAudits.value]
        }
        // Refresh stats
        fetchStats()
      } else if (eventType === 'UPDATE') {
        // Update the existing record in the audits array
        const index = audits.value.findIndex((audit) => audit.id === newRecord.id)
        if (index !== -1) {
          audits.value[index] = newRecord
        }

        // Update high-risk audits if applicable
        const highRiskIndex = highRiskAudits.value.findIndex((audit) => audit.id === newRecord.id)
        if (newRecord.isHighRisk && highRiskIndex === -1) {
          // Add to high-risk if it wasn't there before
          highRiskAudits.value = [newRecord, ...highRiskAudits.value]
        } else if (!newRecord.isHighRisk && highRiskIndex !== -1) {
          // Remove from high-risk if it's no longer high-risk
          highRiskAudits.value.splice(highRiskIndex, 1)
        } else if (newRecord.isHighRisk && highRiskIndex !== -1) {
          // Update existing high-risk record
          highRiskAudits.value[highRiskIndex] = newRecord
        }

        // Refresh stats
        fetchStats()
      } else if (eventType === 'DELETE') {
        // Remove the record from the audits array
        audits.value = audits.value.filter((audit) => audit.id !== oldRecord.id)
        // Remove from high-risk audits if applicable
        highRiskAudits.value = highRiskAudits.value.filter((audit) => audit.id !== oldRecord.id)
        // Refresh stats
        fetchStats()
      }
    })
  }

  // Cleanup function to unsubscribe when the store is no longer needed
  const unsubscribeFromRealtimeUpdates = () => {
    if (subscription) {
      subscription.unsubscribe()
      subscription = null
    }
  }

  // Actions
  const fetchAudits = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await getAudits()

      if (fetchError) throw fetchError

      audits.value = data || []

      // Set up real-time subscription after initial data fetch
      // subscribeToRealtimeUpdates()
    } catch (err) {
      console.error('Error fetching audits:', err)
      error.value = err.message || 'Failed to fetch audits'
    } finally {
      loading.value = false
    }
  }

  const fetchHighRiskAudits = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await getHighRiskAudits()

      if (fetchError) throw fetchError

      highRiskAudits.value = data || []
    } catch (err) {
      console.error('Error fetching high risk audits:', err)
      error.value = err.message || 'Failed to fetch high risk audits'
    } finally {
      loading.value = false
    }
  }

  const fetchStats = async () => {
    loading.value = true
    error.value = null

    try {
      const statsData = await getAuditStats()
      stats.value = statsData
    } catch (err) {
      console.error('Error fetching stats:', err)
      error.value = err.message || 'Failed to fetch stats'
    } finally {
      loading.value = false
    }
  }

  const addAudit = async (auditData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: saveError } = await saveAudit(auditData)

      if (saveError) throw saveError

      // If successful, refresh the audits list
      await fetchAudits()
      await fetchStats()

      return { success: true, data }
    } catch (err) {
      console.error('Error adding audit:', err)
      error.value = err.message || 'Failed to add audit'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const editAudit = async (id, auditData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await updateAudit(id, auditData)

      if (updateError) throw updateError

      // If successful, refresh the audits list
      await fetchAudits()
      await fetchStats()

      return { success: true, data }
    } catch (err) {
      console.error('Error updating audit:', err)
      error.value = err.message || 'Failed to update audit'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const removeAudit = async (id) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await deleteAudit(id)

      if (deleteError) throw deleteError

      // If successful, refresh the audits list
      await fetchAudits()
      await fetchStats()

      return { success: true }
    } catch (err) {
      console.error('Error deleting audit:', err)
      error.value = err.message || 'Failed to delete audit'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    audits,
    highRiskAudits,
    stats,
    loading,
    error,

    // Getters
    getAuditById,
    getAuditsByHospital,
    getAuditsByWard,

    // Actions
    fetchAudits,
    fetchHighRiskAudits,
    fetchStats,
    addAudit,
    editAudit,
    removeAudit,
    subscribeToRealtimeUpdates,
    unsubscribeFromRealtimeUpdates,
    getTodayAuditCount,
  }
})
