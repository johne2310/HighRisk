<template>
  <q-page padding>
    <div class="text-h4 text-primary q-mb-md">Application Settings</div>

    <div class="row q-col-gutter-md">
      <!-- User Settings -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">User Settings</div>

            <q-form class="q-gutter-md q-mt-md">
              <q-input filled v-model="userSettings.defaultName" label="Default Collector Name" />

              <q-select
                filled
                v-model="userSettings.defaultHospital"
                :options="['Richmond', 'Eastern', 'Camberwell', 'Geelong', 'Hawthorn', 'Freemasons']"
                label="Default Hospital"
                clearable
              />

              <q-select
                filled
                v-model="userSettings.defaultWard"
                :options="[]"
                label="Default Ward"
                clearable
                :disable="!userSettings.defaultHospital"
              />

              <q-toggle v-model="userSettings.rememberSettings" label="Remember my settings" />

              <div>
                <q-btn 
                  color="primary" 
                  label="Save User Settings" 
                  @click="saveUserSettings" 
                  :disable="appSettings.autoSave"
                >
                  <q-tooltip v-if="appSettings.autoSave">
                    Settings are automatically saved when auto-save is enabled
                  </q-tooltip>
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Application Settings -->
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Application Settings</div>

            <q-form class="q-gutter-md q-mt-md">
              <q-select
                filled
                v-model="appSettings.theme"
                :options="themeOptions"
                label="Application Theme"
              />

              <q-select
                filled
                v-model="appSettings.dateFormat"
                :options="dateFormatOptions"
                label="Date Format"
              />

              <q-toggle v-model="appSettings.notifications" label="Enable Notifications" />

              <q-toggle v-model="appSettings.autoSave" label="Auto-save Settings">
                <q-tooltip>
                  When enabled, settings are automatically saved when changed
                </q-tooltip>
              </q-toggle>

              <div>
                <q-btn 
                  color="primary" 
                  label="Save App Settings" 
                  @click="saveAppSettings" 
                  :disable="appSettings.autoSave"
                >
                  <q-tooltip v-if="appSettings.autoSave">
                    Settings are automatically saved when auto-save is enabled
                  </q-tooltip>
                </q-btn>

                <q-btn
                  color="secondary"
                  flat
                  label="Reset to Defaults"
                  class="q-ml-sm"
                  @click="resetAppSettings"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Data Management -->
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6">Data Management</div>

            <div class="row q-col-gutter-md q-mt-md">
              <div class="col-12 col-md-4">
                <q-btn
                  color="primary"
                  label="Export All Data"
                  icon="cloud_download"
                  class="full-width"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-btn
                  color="warning"
                  label="Clear Local Cache"
                  icon="delete_sweep"
                  class="full-width"
                />
              </div>

              <div class="col-12 col-md-4">
                <q-btn
                  color="negative"
                  label="Reset Application"
                  icon="restart_alt"
                  class="full-width"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useSettingsStore } from '../stores/settings-store'

const $q = useQuasar()
const settingsStore = useSettingsStore()

// Use settings from the store
const { userSettings, appSettings } = settingsStore

// Options
const themeOptions = [
  { label: 'Blue Theme', value: 'blue' },
  { label: 'Dark Theme', value: 'dark' },
  { label: 'Light Theme', value: 'light' },
]

const dateFormatOptions = [
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
]

// Save settings functions
const saveUserSettings = () => {
  const result = settingsStore.saveUserSettings()

  if (result.success) {
    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: 'User settings saved successfully',
      position: 'top',
      timeout: 2000,
    })
  } else {
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: `Failed to save user settings: ${result.error}`,
      position: 'top',
      timeout: 2000,
    })
  }
}

const saveAppSettings = () => {
  const result = settingsStore.saveAppSettings()

  if (result.success) {
    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: 'Application settings saved successfully',
      position: 'top',
      timeout: 2000,
    })
  } else {
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: `Failed to save application settings: ${result.error}`,
      position: 'top',
      timeout: 2000,
    })
  }
}

const resetAppSettings = () => {
  const result = settingsStore.resetAppSettings()

  if (result.success) {
    $q.notify({
      color: 'info',
      icon: 'info',
      message: 'Application settings reset to defaults',
      position: 'top',
      timeout: 2000,
    })
  } else {
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: `Failed to reset application settings: ${result.error}`,
      position: 'top',
      timeout: 2000,
    })
  }
}
</script>
