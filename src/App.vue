<template>
  <div>
    <div v-if="authStore.loading" class="fullscreen flex flex-center">
      <q-spinner color="primary" size="3em" />
    </div>
    <router-view v-else />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  // Initialize the auth store to check for existing session
  await authStore.initialize()

  // If not authenticated and on a protected route, redirect to login
  if (!authStore.isAuthenticated && router.currentRoute.value.meta.requiresAuth) {
    router.push('/login')
  }
})
</script>
