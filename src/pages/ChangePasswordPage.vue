<template>
  <q-page class="reset-password"
          padding>
    <q-card>
      <q-card-section>
        <div class="text-h5">Change Password</div>
      </q-card-section>
      
      <q-card-section>
        <q-form @submit="handleChangePassword"
                class="q-gutter-md">
          <q-input filled
                   :type="isPwd ? 'password' : 'text'"
                   v-model="newPassword"
                   label="New Password"
                   lazy-rules
                   :rules="[
              (val) => !!val || 'Field is required',
              (val) => val.length >= 6 || 'Use at least 6 characters',
            ]">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"></q-icon>
            </template>
          </q-input>

          <q-input filled
                   :type="isPwd ? 'password' : 'text'"
                   v-model="confirmPassword"
                   label="Confirm Password"
                   lazy-rules
                   :rules="[
              (val) => !!val || 'Field is required',
              (val) => val === newPassword || 'Passwords do not match',
            ]">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"></q-icon>
            </template>
          </q-input>

          <div>
            <q-btn color="primary"
                   type="submit"
                   :label="loading ? 'Loading...' : 'Change Password'"
                   :loading="loading"
                   :disable="loading" />
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth-store.js'
import { useToaster } from 'src/composables/userToaster.js'

const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)
const successMessage = ref(null)
const isPwd = ref(true)

const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showError } = useToaster()

const handleChangePassword = async() => {
  loading.value = true
  error.value = null
  successMessage.value = null
  console.log('New Password: ', newPassword.value)

  if (authStore.userDetails.id) {
    console.log('User ID is logged: ', authStore.userDetails.id)
    let result = await authStore.changePassword(newPassword.value)
    const { success, error } = result
    if (success) {
      showSuccess('Password changed successfully!')
      router.push('/dashboard')
    }
    if (error) {
      showError(error.message)
    }
  } else {
    console.log('User is not logged: ')
    router.push('/auth/login')
  }
  loading.value = false
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
