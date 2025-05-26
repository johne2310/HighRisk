<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'
import router from 'src/router/index.js'

const authStore = useAuthStore()

// Initialize auth store when app starts
onMounted(() => {
  authStore.initialize()
  if (authStore.userDetails == null) {
    router.push('/login')
  }
})
</script>
