import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAuthStore } from 'stores/auth-store.js'
import { useToaster } from 'src/composables/userToaster.js'
import supabase from './supabase'

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
    // let subscription = null
    const { showError } = useToaster()

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
    const getHighRiskAuditCount = async() => {
      const { data: highRiskCount, error: highRiskError } = await supabase.rpc(
        'get_high_risk_audit_count'
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
      } else if (patient_audits) {
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
            // console.log('Change received!', payload)
            if (payload.eventType === 'INSERT') {
              if (payload.new) {
                audits.value = [payload.new, ...audits.value]
                // Update high-risk audits if applicable
                // if (payload.new.isHighRisk) {
                //   // highRiskAudits.value = [payload.new, ...highRiskAudits.value]
                // }
              }
            }
            if (payload.eventType === 'UPDATE') {
              console.log('Patient audit updated!')
              const index = audits.value.findIndex((audit) => audit.id === payload.new.id)
              if (index !== -1) {
                audits.value[index] = payload.new
              }
            }
            if (payload.eventType === 'DELETE') {
              console.log('Patient audit deleted!')
              audits.value.splice(payload.old.id, 1)
            }
          }
        )
        .subscribe()
    }

    /*
      Save audit to supabase
    */
    const saveAudit = async(auditData) => {
      const { data, error: saveError } = await supabase
        .from('patient_audits')
        .insert([auditData])
        .select()

      if (saveError) return { success: false }

      if (data) {
        await fetchStats()
        return { success: true }
      }
    }

    /*
      Delete audit from supabase
    */
    const deleteAudit = async(id) => {
      const { error: deleteError } = await supabase
        .from('patient_audits')
        .delete()
        .eq('id', id)

      if (deleteError) {
        return { success: false }
        // throw deleteError
      } else {
        await fetchStats()
        return { success: true }
      }
    }

    /*
      Edit audit in supabase
    */
    const editAudit = async(id, auditData) => {
      // const { data, error: updateError } = await updateAudit(id, auditData)
      const { data, error: updateError } = await supabase
        .from('patient_audits')
        .update(auditData)
        .eq('id', id)
        .select()

      if (updateError) return { success: false }

      if (data) {
        await fetchStats()
        return { success: true }
      }
      // If successful, refresh the audits list
      // await fetchAudits()
    }

    // Refactored loadHighRiskAudits function using executeOperation helper
    const loadHighRiskAudits = async() => {
      const { data, error: fetchError } = await supabase
        .from('patient_audits')
        .select('*')
        .eq('isHighRisk', true)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      if (data) {
        highRiskAudits.value = data || []
      }
    }

    // Refactored fetchStats function using executeOperation helper
    const fetchStats = async() => {
      await getTodayAuditCount()
      await getHighRiskAuditCount()
      await getAuditCount()
      return {}
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
      loadHighRiskAudits,
      fetchStats,
      loadAudits,
      saveAudit,
      editAudit,
      deleteAudit,
      subscribeAudits,
      getTodayAuditCount,
      getHighRiskAuditCount,
      getAuditCount,
      highRiskPercentage
    }
  }
)