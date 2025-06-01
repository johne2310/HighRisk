<template>
  <q-card class="auth-card">
    <q-card-section class="text-center">
      <div class="text-h4 text-primary q-mb-md">High Risk Patient Medication Audit</div>
      <div class="text-subtitle1 q-mb-lg">Please sign in to continue</div>
    </q-card-section>

    <q-card-section>
      <slot name="main-content"></slot>
    </q-card-section>

    <q-separator class="q-my-md" />

    <q-card-section>
      <div class="text-center">
        <p class="text-grey-8">Don't have an account?</p>
        <q-btn outline
               color="secondary"
               label="Sign Up"
               class="full-width"
               @click="$emit('show-signup')"
               :disable="loading" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from 'stores/auth-store.js'

const authStore = useAuthStore()
const loading = computed(() => authStore.loading)

defineEmits(['show-signup'])
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 400px;
}
</style>