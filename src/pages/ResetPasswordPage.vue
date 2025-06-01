<template>
  <q-page class="reset-password">
    <q-card>
      <q-card-section>
        <div class="text-h5">Reset Password</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit"
                class="q-gutter-md">
          <q-input filled
                   type="email"
                   v-model="email"
                   label="Your email"
                   lazy-rules
                   :rules="[(val) => (val && val.length > 0) || 'Please enter your email']" />

          <div>
            <q-btn color="primary"
                   type="submit"
                   :label="loading ? 'Loading...' : 'Reset Password'"
                   :loading="loading"
                   :disable="loading" /> &nbsp;&nbsp;
            <q-btn type="button"
                   label="Go to Login"
                   @click="gotoLogin"
                   color="info" />
          </div>

          <div v-if="error"
               class="text-red">
            {{ error }}
          </div>
          <div v-if="successMessage"
               class="text-green">
            {{ successMessage }}
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'stores/auth-store.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const gotoLogin = () => {
  router.push('/login')
}

const email = ref('')
const loading = ref(false)
const error = ref(null)
const successMessage = ref(null)
const authStore = useAuthStore()

const handleSubmit = async() => {
  loading.value = true
  error.value = null
  successMessage.value = null
  console.log('resetting password for: ', email.value)

  try {
    const result = await authStore.resetPassword(email.value)
    if (result.success) {
      successMessage.value = 'Password reset link sent to your email.'
    } else {
      error.value = result.error
    }
  }
  catch (err) {
    error.value = err.message || 'An unexpected error occurred.'
  }
  finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-password {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.q-card {
  width: 100%;
  max-width: 400px;
}
</style>
