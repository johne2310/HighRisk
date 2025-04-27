import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import supabase from './supabase'

export const useHospitalStore = defineStore('hospital', () => {
  // State
  const hospitals = ref([])
  const wards = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Computed properties
  const getFilteredWards = computed(() => {
    return (hospitalId) => {
      if (!hospitalId) return []
      return wards.value.filter((ward) => ward.hospital_id === hospitalId)
    }
  })

  const getHospitalById = computed(() => {
    return (hospitalId) => hospitals.value.find((h) => h.hospital_id === hospitalId)
  })

  const getWardById = computed(() => {
    return (wardId) => wards.value.find((w) => w.ward_id === wardId)
  })

  // Actions
  const fetchHospitals = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase.from('hospitals').select('*')

      if (fetchError) throw fetchError

      hospitals.value = data || []
      return { success: true, data }
    } catch (err) {
      console.error('Error fetching hospitals:', err)
      error.value = err.message || 'Failed to fetch hospitals'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchWards = async () => {
    loading.value = true
    error.value = null

    try {
      const { data, error: fetchError } = await supabase.from('wards').select('*')

      if (fetchError) throw fetchError

      wards.value = data || []
      return { success: true, data }
    } catch (err) {
      console.error('Error fetching wards:', err)
      error.value = err.message || 'Failed to fetch wards'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Initialize data
  const initializeData = async () => {
    await Promise.all([fetchHospitals(), fetchWards()])
  }

  return {
    // State
    hospitals,
    wards,
    loading,
    error,

    // Getters
    getFilteredWards,
    getHospitalById,
    getWardById,

    // Actions
    fetchHospitals,
    fetchWards,
    initializeData,
  }
})
