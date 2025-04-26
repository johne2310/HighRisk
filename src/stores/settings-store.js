import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// Helper function to check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export const useSettingsStore = defineStore('settings', () => {
  // State
  const userSettings = ref({
    defaultName: '',
    defaultHospital: null,
    defaultWard: null,
    rememberSettings: true,
  })

  const appSettings = ref({
    theme: 'blue',
    dateFormat: 'YYYY-MM-DD',
    notifications: true,
    autoSave: true,
  })

  const loading = ref(false)
  const error = ref(null)

  // Load settings from localStorage
  const loadSettings = () => {
    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available')
      return
    }

    try {
      const savedUserSettings = localStorage.getItem('userSettings')
      const savedAppSettings = localStorage.getItem('appSettings')

      if (savedUserSettings) {
        userSettings.value = JSON.parse(savedUserSettings)
      }

      if (savedAppSettings) {
        appSettings.value = JSON.parse(savedAppSettings)
      }
    } catch (err) {
      console.error('Error loading settings from localStorage:', err)
      error.value = err.message || 'Failed to load settings'
    }
  }

  // Initialize by loading saved settings if localStorage is available
  if (typeof window !== 'undefined' && isLocalStorageAvailable()) {
    loadSettings()
  }

  // Set up watchers for auto-save if enabled and localStorage is available
  watch(
    () => appSettings.value.autoSave,
    (newValue) => {
      if (newValue && typeof window !== 'undefined' && isLocalStorageAvailable()) {
        // If auto-save is enabled and localStorage is available, set up watchers for settings
        setupAutoSave()
      }
    },
    { immediate: true },
  )

  // Function to set up auto-save watchers
  function setupAutoSave() {
    if (appSettings.value.autoSave && isLocalStorageAvailable()) {
      // Watch for changes in userSettings and save automatically
      watch(
        userSettings,
        () => {
          if (appSettings.value.autoSave && isLocalStorageAvailable()) {
            saveUserSettings()
          }
        },
        { deep: true },
      )

      // Watch for changes in appSettings and save automatically
      watch(
        appSettings,
        () => {
          if (appSettings.value.autoSave && isLocalStorageAvailable()) {
            saveAppSettings()
          }
        },
        { deep: true },
      )
    }
  }

  // Save settings to localStorage
  const saveUserSettings = () => {
    loading.value = true
    error.value = null

    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available')
      return { success: false, error: 'localStorage is not available' }
    }

    try {
      localStorage.setItem('userSettings', JSON.stringify(userSettings.value))
      return { success: true }
    } catch (err) {
      console.error('Error saving user settings:', err)
      error.value = err.message || 'Failed to save user settings'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const saveAppSettings = () => {
    loading.value = true
    error.value = null

    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available')
      return { success: false, error: 'localStorage is not available' }
    }

    try {
      localStorage.setItem('appSettings', JSON.stringify(appSettings.value))
      return { success: true }
    } catch (err) {
      console.error('Error saving app settings:', err)
      error.value = err.message || 'Failed to save app settings'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const resetAppSettings = () => {
    appSettings.value = {
      theme: 'blue',
      dateFormat: 'YYYY-MM-DD',
      notifications: true,
      autoSave: true,
    }

    if (!isLocalStorageAvailable()) {
      console.warn('localStorage is not available')
      return { success: true, warning: 'Settings reset but not saved to localStorage' }
    }

    return saveAppSettings()
  }

  return {
    // State
    userSettings,
    appSettings,
    loading,
    error,

    // Actions
    loadSettings,
    saveUserSettings,
    saveAppSettings,
    resetAppSettings,
  }
})
