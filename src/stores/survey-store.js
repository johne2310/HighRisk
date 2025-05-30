import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from 'stores/supabase/auth-store.js'
import { useToaster } from 'src/composables/userToaster.js'
import supabase from './supabase'
import {
  // saveAudit, //todo - remove once new code in place
  // getAudits, //todo - remove once new code in place
  getHighRiskAudits,
  // getAuditStats, //todo - remove once new code in place
  updateAudit,
  deleteAudit,
  subscribeToAudits
} from './supabase'

export const useSurveyStore = defineStore('survey', () => {
  // State
  const audits = ref([])
  const highRiskAudits = ref([])
  const stats = ref({
    totalAudits: 0,
    highRiskCount: 0,
    todayCount: 0,
    highRiskPercentage: 0
  })
  const loading = ref(false)
  const error = ref(null)
  let subscription = null
  const { showError, showInfo } = useToaster()

  // ******************
  // GET KEY STATISTICS
  // ******************

  /*********************************************
   Run Supabase RPC to get today's audit count'
   **********************************************/
  const getTodayAuditCount = async() => {
    const { data: todayAuditCount, error: todayCountError } =
      await supabase.rpc('get_today_audit_count')

    if (todayCountError) {
      // showError(todayCountError || 'Error fetching today audit count')
      console.error('Error fetching today audit count', todayCountError)
    } else {
      stats.value.todayCount = todayAuditCount
    }
  }

  /*
    Get high risk audits from stats table
  */
  const getHighRiskAuditsFromStats = async() => {
    const { data: highRiskCount, error: highRiskError } = await supabase.rpc(
      'get_highrisk_audit_count'
    )
    if (highRiskError) {
      console.error('Error fetching high risk audits:', highRiskError)
    } else {
      stats.value.highRiskCount = highRiskCount
    }
  }

  /*
    get total audit count from patient_audits
  */
  const getAuditCount = async() => {
    const { data: auditCount, error: auditCountError } = await supabase.rpc(
      'get_total_patient_audits_count'
    )
    if (auditCountError) {
      console.error('Error fetching audit count:', auditCountError)
    } else {
      stats.value.totalAudits = auditCount
    }
  }

  /*
    Calculate high risk patient percentage
  */
  const highRiskPercentage = () => {
    const highRiskPercentage =
      stats.value.totalAudits === 0
        ? 0
        : (stats.value.highRiskCount / stats.value.totalAudits) * 100
    stats.value.highRiskPercentage = Math.round(highRiskPercentage)
    console.log('high riks %: ', stats.value.highRiskPercentage)
  }

  /*
    Getters
  */
  const getAuditById = computed(() => {
    return (id) => audits.value.find((audit) => audit.id === id)
  })

  const getAuditsByHospital = computed(() => {
    return (hospital) => audits.value.filter((audit) => audit.hospital === hospital)
  })

  const getAuditsByWard = computed(() => {
    return (ward) => audits.value.filter((audit) => audit.ward === ward)
  })

  //todo - refactor get audts from supabase file to survey store

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
  const loadAudits = async() => {
    const authStore = useAuthStore()

    let { data: patient_audits, error } = await supabase
      .from('patient_audits')
      .select('*')
      .eq('user_id', authStore.userDetails.id)
      .order('created_at', { ascending: false })

    if (error) {
      showError(error.message)
      console.error('Error fetching patient_audits:', error)
    } else if (patient_audits) {
      showInfo('Patient audits loaded successfully') //todo - delete for final version
      audits.value = patient_audits
      await subscribeAudits()
    }
  }

  const subscribeAudits = async() => {

    supabase.channel('patient_audit_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'patient_audits' },
        (payload) => {
          console.log('Change received!', payload)
          if (payload.event === 'INSERT') {
            console.log('New patient audit added!')
            audits.value = [payload.new, ...audits.value]
          } else if (payload.event === 'UPDATE') {
            console.log('Patient audit updated!')
            const index = audits.value.findIndex((audit) => audit.id === payload.new.id)
            if (index !== -1) {
              audits.value[index] = payload.new
            }
          } else if (payload.event === 'DELETE') {
            console.log('Patient audit deleted!')
            audits.value = audits.value.filter((audit) => audit.id !== payload.old.id)
          }
        }
      )
      .subscribe()
  }

  const saveAudit = async(auditData) => {
    const { data, error } = await supabase.from('patient_audits').insert([auditData])

    if (error) {
      showError(error.message)
      console.error('Error saving audit:', error)
    } else if (data) {
      showInfo('Audit saved successfully')
      audits.value = [data[0], ...audits.value]
      await subscribeAudits()
    }
  }

  const fetchAudits = async() => {

  }

  const fetchHighRiskAudits = async() => {
    loading.value = true
    error.value = null
    console.log('running fetch high audit data: ')
    try {
      const { data, error: fetchError } = await getHighRiskAudits()

      console.log('high risk audit data: ', data)
      if (fetchError) throw fetchError
      highRiskAudits.value = data || []
    }
    catch (err) {
      console.error('Error fetching high risk audits:', err)
      error.value = err.message || 'Failed to fetch high risk audits'
    }
    finally {
      loading.value = false
    }
  }

  /*
    Load key statistics for the dashboard
  */
  const fetchStats = async() => {
    loading.value = true
    error.value = null

    try {
      await getTodayAuditCount()
      await getHighRiskAuditsFromStats()
      await getAuditCount()
      await highRiskPercentage()
    }
    catch (err) {
      console.error('Error fetching stats:', err)
      error.value = err.message || 'Failed to fetch stats'
    }
    finally {
      loading.value = false
    }
  }

  const addAudit = async(auditData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: saveError } = await saveAudit(auditData)

      if (saveError) throw saveError

      // If successful, refresh the audits list
      await fetchAudits()
      await fetchStats()

      return { success: true, data }
    }
    catch (err) {
      console.error('Error adding audit:', err)
      error.value = err.message || 'Failed to add audit'
      return { success: false, error: error.value }
    }
    finally {
      loading.value = false
    }
  }

  const editAudit = async(id, auditData) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: updateError } = await updateAudit(id, auditData)

      if (updateError) throw updateError

      // If successful, refresh the audits list
      await fetchAudits()
      await fetchStats()

      return { success: true, data }
    }
    catch (err) {
      console.error('Error updating audit:', err)
      error.value = err.message || 'Failed to update audit'
      return { success: false, error: error.value }
    }
    finally {
      loading.value = false
    }
  }

  const removeAudit = async(id) => {
    loading.value = true
    error.value = null

    try {
      const { error: deleteError } = await deleteAudit(id)

      if (deleteError) throw deleteError

      // If successful, refresh the audits list
      await fetchAudits()
      await fetchStats()

      return { success: true }
    }
    catch (err) {
      console.error('Error deleting audit:', err)
      error.value = err.message || 'Failed to delete audit'
      return { success: false, error: error.value }
    }
    finally {
      loading.value = false
    }
  }

  return {
    // State
    audits,
    stats,
    loading,
    error,
    highRiskAudits,

    // Getters
    getAuditById,
    getAuditsByHospital,
    getAuditsByWard,

    // Actions
    fetchAudits,
    fetchHighRiskAudits,
    fetchStats,
    loadAudits,
    addAudit, //todo - remove once new code in place
    saveAudit,
    editAudit,
    removeAudit,
    subscribeAudits,
    subscribeToRealtimeUpdates,
    unsubscribeFromRealtimeUpdates,
    getTodayAuditCount,
    getHighRiskAuditsFromStats,
    getAuditCount,
    highRiskPercentage
  }
})
