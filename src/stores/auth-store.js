import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import supabase from './supabase'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)

  // Actions
  // Initialize the store by checking for an existing session
  const initialize = async () => {
    loading.value = true
    error.value = null

    try {
      // Get the current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) throw sessionError

      if (session) {
        user.value = session.user
      } else {
        user.value = null
      }
    } catch (err) {
      console.error('Error initializing auth store:', err)
      error.value = err.message
      user.value = null
    } finally {
      loading.value = false
    }

    // Set up auth state change listener
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        console.log('Signed in')
      }
      if (event === 'SIGNED_OUT') {
        console.log('Signed out')
      }
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery')
      }
      if (event === 'EMAIL_VERIFICATION') {
        console.log('Email verification')
      }
      if (session) {
        user.value = session.user
      } else {
        user.value = null
      }
    })
  }

  // Sign in with email and password
  const signIn = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      user.value = data.user
      console.log('User is: ', user)
      return { success: true }
    } catch (err) {
      console.error('Error signing in:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Sign up with email and password
  const signUp = async (email, password) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://www.day41.app/#/login',
        },
      })

      if (signUpError) throw signUpError

      return { success: true, data }
    } catch (err) {
      console.error('Error signing up:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Sign out
  const signOut = async () => {
    loading.value = true
    error.value = null

    try {
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) throw signOutError

      user.value = null
      return { success: true }
    } catch (err) {
      console.error('Error signing out:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    loading.value = true
    error.value = null
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        // redirectTo: 'https://www.day41.app/#/change-password',
        redirectTo: `${window.location.origin}/change-password`,
      })

      if (resetError) throw resetError

      return { success: true }
    } catch (err) {
      console.error('Error resetting password:', err)
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    user,
    loading,
    error,

    // Getters
    isAuthenticated,

    // Actions
    initialize,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
})
