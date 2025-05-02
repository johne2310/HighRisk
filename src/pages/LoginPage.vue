<template>
  <q-page padding class="flex flex-center">
    <q-card class="auth-card">
      <q-card-section class="text-center">
        <div class="text-h4 text-primary q-mb-md">High Risk Patient Medication Audit</div>
        <div class="text-subtitle1 q-mb-lg">Please sign in to continue</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleLogin" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            :rules="[(val) => !!val || 'Email is required', isValidEmail]"
          />

          <!--          <q-input
            v-model="password"
            label="Password"
            :type="isPwd ? 'password' : 'text'"
            outlined
            :rules="[(val) => !!val || 'Password is required']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
               />
            </template>
          </q-input>-->

          <div class="q-mt-md">
            <q-btn
              label="Sign In"
              type="submit"
              color="primary"
              class="full-width"
              :loading="loading"
            />
          </div>

          <div class="text-center q-mt-sm">
            <q-btn
              flat
              color="primary"
              label="Forgot Password?"
              @click="gotoResetPassword"
              :disable="loading"
            />
          </div>

          <q-separator class="q-my-md" />

          <div class="text-center">
            <p class="text-grey-8">Don't have an account?</p>
            <q-btn
              outline
              color="secondary"
              label="Sign Up"
              class="full-width"
              @click="showSignUp = true"
              :disable="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Sign Up Dialog -->
    <q-dialog v-model="showSignUp">
      <q-card style="min-width: 350px">
        <q-card-section class="text-center">
          <div class="text-h6">Create Account</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleSignUp" class="q-gutter-md">
            <q-input
              v-model="signUpEmail"
              label="Email"
              type="email"
              outlined
              :rules="[(val) => !!val || 'Email is required', isValidEmail]"
            />

            <q-input
              v-model="signUpPassword"
              label="Password"
              :type="isSignUpPwd ? 'password' : 'text'"
              outlined
              :rules="[
                (val) => !!val || 'Password is required',
                (val) => val.length >= 6 || 'Password must be at least 6 characters',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isSignUpPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isSignUpPwd = !isSignUpPwd"
                />
              </template>
            </q-input>

            <div class="q-mt-md">
              <q-btn
                label="Sign Up"
                type="submit"
                color="secondary"
                class="full-width"
                :loading="loading"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup :disable="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()

// Login form
const email = ref('')
// const password = ref('')
// const isPwd = ref(true)
const loading = computed(() => authStore.loading)

// Sign up form
const showSignUp = ref(false)
const signUpEmail = ref('')
const signUpPassword = ref('')
const isSignUpPwd = ref(true)

// Email validation
const isValidEmail = (val) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(val) || 'Invalid email format'
}

//go to password reset page
const gotoResetPassword = () => {
  router.push('/reset-password')
}

// Handle login
const handleLogin = async () => {
  const { success, error } = await authStore.signInWithMagicLink(email.value)

  if (success) {
    // Successful login
    $q.notify({
      color: 'positive',
      message: 'Login successful',
      icon: 'check_circle',
    })

    // Redirect to home page
    await router.push('/dashboard')
  } else {
    // Login failed
    $q.notify({
      color: 'negative',
      message: error || 'Login failed',
      icon: 'error',
    })
  }
}

// Handle sign up
const handleSignUp = async () => {
  const { success, error } = await authStore.signUp(signUpEmail.value, signUpPassword.value)

  if (success) {
    $q.notify({
      color: 'positive',
      message: 'Sign up successful! Please check your email for verification.',
      icon: 'check_circle',
    })

    showSignUp.value = false
  } else {
    $q.notify({
      color: 'negative',
      message: error || 'Sign up failed',
      icon: 'error',
    })
  }
}

// Handle password reset
// const resetPassword = async () => {
//   if (!email.value) {
//     $q.notify({
//       color: 'warning',
//       message: 'Please enter your email address',
//       icon: 'warning',
//     })
//     return
//   }
//
//   const { success, error } = await authStore.resetPassword(email.value)
//
//   if (success) {
//     $q.notify({
//       color: 'positive',
//       message: 'Password reset email sent. Please check your inbox.',
//       icon: 'check_circle',
//     })
//   } else {
//     $q.notify({
//       color: 'negative',
//       message: error || 'Failed to send reset email',
//       icon: 'error',
//     })
//   }
// }
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 400px;
}
</style>
