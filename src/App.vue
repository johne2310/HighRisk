<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth-store'

const authStore = useAuthStore()

// Initialize auth store when app starts
onMounted(async () => {
  await authStore.initialize()
})
</script>
