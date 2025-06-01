<template>
  <q-page padding
          class="flex flex-center">
    <AuthCard @show-signup="showSignUp = true">
      <template #main-content>
        <q-tabs v-model="tab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator>
          <q-tab name="password"
                 label="Email/Password" />
          <q-tab name="magiclink"
                 label="Magic Link" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab"
                      animated>
          <q-tab-panel name="password">
            <LoginForm />
          </q-tab-panel>

          <q-tab-panel name="magiclink">
            <MagicLinkLogin />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </AuthCard>

    <!-- Sign Up Dialog -->
    <q-dialog v-model="showSignUp">
      <q-card style="min-width: 350px">
        <q-card-section class="text-center">
          <div class="text-h6">Create Account</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="handleSignUp"
                  class="q-gutter-md">
            <q-input v-model="signUpEmail"
                     label="Email"
                     type="email"
                     outlined
                     :rules="[(val) => !!val || 'Email is required', isValidEmail]" />

            <q-input v-model="signUpPassword"
                     label="Password"
                     :type="isSignUpPwd ? 'password' : 'text'"
                     outlined
                     :rules="[
                (val) => !!val || 'Password is required',
                (val) => val.length >= 6 || 'Password must be at least 6 characters',
              ]">
              <template v-slot:append>
                <q-icon :name="isSignUpPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isSignUpPwd = !isSignUpPwd" />
              </template>
            </q-input>

            <div class="q-mt-md">
              <q-btn label="Sign Up"
                     type="submit"
                     color="secondary"
                     class="full-width"
                     :loading="loading" />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat
                 label="Cancel"
                 color="primary"
                 v-close-popup
                 :disable="loading" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from 'stores/auth-store.js'
import { useToaster } from 'src/composables/userToaster.js'
import LoginForm from 'src/components/LoginForm.vue'
import MagicLinkLogin from 'src/components/MagicLinkLogin.vue'
import AuthCard from 'src/components/AuthCard.vue'

const authStore = useAuthStore()
const { showSuccess, showError } = useToaster()

const tab = ref('password') // Default to password login
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

// Handle sign up
const handleSignUp = () => {
  console.log('credentials: ', signUpEmail.value, signUpPassword.value)
  const { success, error } = authStore.registerUser({
    email: signUpEmail.value,
    password: signUpPassword.value
  })

  if (success) {
    showSuccess('Sign up successful! Please check your email for verification.')

    showSignUp.value = false
  } else {
    showError(error || 'Sign up failed')
  }
}
</script>

<style scoped>
/* No longer needed here as it's in AuthCard.vue */
</style>