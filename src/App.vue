<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'stores/auth-store.js'
// import { useRouter } from 'vue-router'

const authStore = useAuthStore()
// const router = useRouter()

// Initialize auth store when app starts
onMounted(() => {
  authStore.initialize()
  if (!authStore.userDetails.id) {
    // router.push('/auth/login')
  }
})
</script>
