<template>
  <q-form @submit="handleLogin"
          class="q-gutter-md">
    <q-input v-model="credentials.email"
             label="Email"
             type="email"
             outlined
             :rules="[(val) => !!val || 'Email is required', isValidEmail]" />

    <q-input v-model="credentials.password"
             label="Password"
             :type="isPwd ? 'password' : 'text'"
             outlined
             :rules="[(val) => !!val || 'Password is required']">
      <template v-slot:append>
        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd" />
      </template>
    </q-input>

    <div class="q-mt-md">
      <q-btn label="Sign In"
             type="submit"
             color="primary"
             class="full-width"
             :loading="loading" />
    </div>

    <div class="text-center q-mt-sm">
      <q-btn flat
             color="primary"
             label="Forgot Password?"
             @click="gotoResetPassword"
             :disable="loading" />
    </div>
  </q-form>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth-store.js'
import { useToaster } from 'src/composables/userToaster.js'

const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showError } = useToaster()

const isPwd = ref(true)
const loading = computed(() => authStore.loading)

const credentials = reactive({
  email: '',
  password: ''
})

/*
  Check email validity
*/
const isValidEmail = (val) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(val) || 'Invalid email format'
}

/*
  Open reset password modal
*/
const gotoResetPassword = () => {
  router.push({ name: 'reset-password' })
}

/*
  Log user in via email and password
*/
const handleLogin = async() => {
  let result = await authStore.loginUser(credentials)

  const { success, error } = result
  if (success) {
    showSuccess('Login successful!')
    router.push('/dashboard')
  }
  if (error) {
    showError(error)
  }
}
</script>