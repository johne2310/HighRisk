<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> High Risk Patient Audit</q-toolbar-title>

        <div class="q-mr-md">ver: {{ packageInfo.version }}</div>

        <div v-if="authStore.user" class="q-mr-sm">{{ authStore.user.email }}</div>

        <q-btn flat dense icon="logout" aria-label="Logout" @click="handleLogout">
          <q-tooltip>Logout</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label class="item-header" header> Menu </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'
import packageInfo from '../../package.json'
import { useAuthStore } from 'src/stores/auth-store'

const router = useRouter()
const $q = useQuasar()
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initialize()
})

const linksList = [
  {
    title: 'Dashboard',
    caption: 'Overview of audit data',
    icon: 'dashboard',
    link: '#/dashboard',
  },
  {
    title: 'New Survey',
    caption: 'Create a new patient audit',
    icon: 'add_circle',
    link: '#/survey',
  },
  {
    title: 'View Surveys',
    caption: 'Review collected data',
    icon: 'list',
    link: '#/surveys',
  },
  {
    title: 'High Risk Patients',
    caption: 'Patients on 5+ medications',
    icon: 'warning',
    link: '#/high-risk',
  },
  {
    title: 'Settings',
    caption: 'Application settings',
    icon: 'settings',
    link: '#/settings',
  },
  {
    title: 'Help',
    caption: 'User guide and support',
    icon: 'help',
    link: '#/help',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

async function handleLogout() {
  try {
    const { success, error } = await authStore.signOut()

    if (success) {
      $q.notify({
        color: 'positive',
        message: 'You have been logged out',
        icon: 'check_circle',
      })

      // Redirect to login page
      await router.push('/login')
    } else {
      throw new Error(error || 'Logout failed')
    }
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: error.message || 'Logout failed',
      icon: 'error',
    })
  }
}
</script>
<style>
.item-header {
  font-size: 20px;
}
</style>
