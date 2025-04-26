import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  saveAudit,
  getAudits,
  getHighRiskAudits,
  getAuditStats,
  updateAudit,
  deleteAudit,
} from '../supabase'

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

  // Actions
  const fetchAudits = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await getAudits()

      if (fetchError) throw fetchError

      audits.value = data || []
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
  }
})
