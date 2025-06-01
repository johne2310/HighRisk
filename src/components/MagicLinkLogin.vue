<template>
  <q-form @submit="handleMagicLinkLogin"
          class="q-gutter-md">
    <q-input v-model="email"
             label="Email for Magic Link"
             type="email"
             outlined
             :rules="[(val) => !!val || 'Email is required', isValidEmail]" />
    <div class="q-mt-md">
      <q-btn label="Send Magic Link"
             type="submit"
             color="secondary"
             class="full-width"
             :loading="loading" />
    </div>
  </q-form>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from 'stores/auth-store.js'
import { useToaster } from 'src/composables/userToaster.js'

const authStore = useAuthStore()
const { showSuccess, showError } = useToaster()

const email = ref('')
const loading = computed(() => authStore.loading)

const isValidEmail = (val) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(val) || 'Invalid email format'
}

const handleMagicLinkLogin = async() => {
  const { success, error } = await authStore.signInWithMagicLink(email.value)
  if (error) {
    showError(error.message)
  } else if (success) {
    showSuccess('Magic link sent! Check your email to sign in.')
  }
}
</script>