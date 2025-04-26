<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Patient Medication Audit Survey </q-toolbar-title>

        <div>Healthcare Data Collection</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Dashboard',
    caption: 'Overview of audit data',
    icon: 'dashboard',
    link: '/',
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
    title: 'Reports',
    caption: 'Generate audit reports',
    icon: 'assessment',
    link: '#/reports',
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
</script>
