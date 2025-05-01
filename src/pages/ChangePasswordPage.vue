<template>
  <q-page class="reset-password" padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">Change Password</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleChangePassword" class="q-gutter-md">
          <q-input
            filled
            type="password"
            v-model="newPassword"
            label="New Password"
            lazy-rules
            :rules="[
              (val) => !!val || 'Field is required',
              (val) => val.length >= 6 || 'Use at least 6 characters',
            ]"
          />

          <q-input
            filled
            type="password"
            v-model="confirmPassword"
            label="Confirm Password"
            lazy-rules
            :rules="[
              (val) => !!val || 'Field is required',
              (val) => val === newPassword || 'Passwords do not match',
            ]"
          />

          <div>
            <q-btn
              color="primary"
              type="submit"
              :label="loading ? 'Loading...' : 'Change Password'"
              :loading="loading"
              :disable="loading"
            />
          </div>

          <div v-if="error" class="text-red">
            {{ error }}
          </div>
          <div v-if="successMessage" class="text-green">
            {{ successMessage }}
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
// import { useAuthStore } from 'src/stores/auth-store'
import { useQuasar } from 'quasar'
import supabase from '../stores/supabase'

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)
const successMessage = ref(null)

const router = useRouter()
// const authStore = useAuthStore()
const $q = useQuasar()

onMounted(() => {
  console.log('Change Password Page')
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      console.log('Signed in')
    } else if (event === 'SIGNED_OUT') {
      console.log('Signed out')
    } else if (event === 'PASSWORD_RECOVERY') {
      console.log('Password recovery')
    } else if (event === 'EMAIL_VERIFICATION') {
      console.log('Email verification')
    } else if (event === 'USER_UPDATED') {
      console.log('User updated')
    }
  })
})

const handleChangePassword = async () => {
  loading.value = true
  error.value = null
  successMessage.value = null

  console.log('New Password: ', newPassword.value)

  try {
    // Call Supabase to update the password
    await supabase.auth.getSession()

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword.value,
    })

    // const { error: updateError } = await authStore.supabase.auth.updateUser({
    //   password: newPassword.value,
    // })

    if (updateError) {
      throw new Error(updateError.message)
    }

    successMessage.value = 'Password changed successfully! Redirecting to login...'
    $q.notify({
      color: 'positive',
      message: successMessage.value,
      icon: 'check_circle',
    })

    // Redirect to login after a short delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 2000) // Adjust the delay as needed
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred.'
    $q.notify({
      color: 'negative',
      message: error.value,
      icon: 'warning',
    })
  } finally {
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
