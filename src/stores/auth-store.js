import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import supabase from './supabase'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

export const useAuthStore = defineStore('auth', () => {
  // State

  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const userDetailsDefault = {
    id: null,
    email: null,
  }
  const userDetails = reactive({
    ...userDetailsDefault,
  })
  const $q = useQuasar()

  // Getters

  // Actions
  // Initialize the store by checking for an existing session
  const initialize = async () => {
    // loading.value = true
    // error.value = null
    console.log('Running initialize function')
    const router = useRouter()
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session !== null) {
          userDetails.id = session.user.id
          userDetails.email = session.user.email
          console.log('User details: ', userDetails)
          router.push('/dashboard')
        }
      } else if (event === 'SIGNED_OUT') {
        Object.assign(userDetails, userDetailsDefault)
        console.log('User is signed out')
        router.replace('/login')
      }
    })
  }

  //sign in using magic link
  async function signInWithMagicLink(email) {
    try {
      console.log('magic email: ', email)
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          // Set to true if you want to redirect the user to an app screen rather than the "auth/v1/verify" page
          shouldCreateUser: true,
          // If `localhost` is verified, the email won't be sent, and the user will be automatically signed in.
          // This is intended for testing purposes.
          // The router will handle the magic link parameters and redirect to the dashboard
          // emailRedirectTo: 'http://localhost:9000/#/dashboard',
          emailRedirectTo: 'https://www.day41.app/#/dashboard',
        },
      })

      if (error) {
        console.error('Error sending magic link:', error.message)
        return { success: false, error: error.message }
      }

      console.log('Magic link sent successfully! Refer email to sign in.')
      return { success: true, data: data }
    } catch (error) {
      console.error('Unexpected error:', error.message)
      return { success: false, error: error.message }
    }
  }

  // Sign in with email and password
  const loginUser = async ({ email, password }) => {
    console.log('Login details: ', email, password)
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Error signing in:', error.message)
      $q.notify({
        color: 'negative',
        message: error.message,
        icon: 'error',
      })
    }
    if (data.session !== null) {
      console.log('data: ', data)

      // Successful login
      $q.notify({
        color: 'positive',
        message: 'Login successful',
        icon: 'check_circle',
      })
    }
  }

  // Sign up with email and password
  const registerUser = async (email, password) => {
    console.log('Register user with credentials: ', email, password)
    let { data, error } = await supabase.auth.signUp({
      email: 'audit2@test.com',
      password: '123456',
    })
    if (error) {
      console.error('Error signing up:', error.message)
    }
    if (data) {
      console.log('User data: ', data)
    }
  }

  // Sign out
  const logoutUser = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error.message)
    } else {
      $q.notify({
        color: 'positive',
        message: 'Logout successful',
        icon: 'check_circle',
      })
    }
  }
  // Reset password
  const resetPassword = async (email) => {
    loading.value = true
    error.value = null
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://www.day41.app/#/change-password',
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
    userDetails,

    // Getters
    // isAuthenticated,

    // Actions
    initialize,
    // signIn,
    registerUser,
    logoutUser,
    loginUser,
    resetPassword,
    signInWithMagicLink,
  }
})
