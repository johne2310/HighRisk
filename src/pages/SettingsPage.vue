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

              <!-- Hospital dropdown -->
              <q-select
                filled
                v-model="selectedHospital"
                :options="hospitalStore.hospitals"
                label="Select Hospital"
                option-label="hospital"
                option-value="hospital_id"
                map-options
                emit-value
                :rules="[(val) => !!val || 'Hospital selection is required']"
                @update:model-value="onHospitalChange"
              />

              <!-- Ward dropdown -->
              <q-select
                filled
                v-model="selectedWard"
                :options="filteredWards"
                label="Select Ward"
                option-label="ward"
                option-value="ward_id"
                map-options
                emit-value
                :rules="[(val) => !!val || 'Ward selection is required']"
                :disable="!selectedHospital"
                @update:model-value="onWardChange"
                :key="'ward-select-' + (selectedHospital || 'none')"
              />

              <q-toggle v-model="userSettings.autoSave" label="Auto save settings" />

              <div>
                <q-btn
                  color="primary"
                  label="Save User Settings"
                  @click="saveUserSettings"
                  :disable="userSettings.autoSave"
                >
                  <q-tooltip v-if="userSettings.autoSave">
                    Settings are automatically saved when auto-save is enabled
                  </q-tooltip>
                </q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useSettingsStore } from '../stores/settings-store'
import { useHospitalStore } from '../stores/hospital-store'

// ? - add a section to add/edit hospitals
const $q = useQuasar()
const settingsStore = useSettingsStore()
const hospitalStore = useHospitalStore()

// Use settings from the store
const { userSettings } = settingsStore

// Data
const selectedHospital = ref(null)
const selectedWard = ref(null)

// Computed property to filter wards based on selected hospital
const filteredWards = computed(() => {
  return hospitalStore.getFilteredWards(selectedHospital.value)
})

// Handle hospital selection change
function onHospitalChange() {
  // Reset ward selection when hospital changes
  selectedWard.value = null
  console.log('Selected hospital ID:', selectedHospital.value)

  if (selectedHospital.value) {
    const hospital = hospitalStore.getHospitalById(selectedHospital.value)
    console.log('Hospital change details:', hospital)
    if (hospital) {
      userSettings.defaultHospital = hospital.hospital
    }
  }
}

function onWardChange() {
  if (selectedWard.value) {
    const ward = hospitalStore.getWardById(selectedWard.value)
    if (ward) {
      console.log('Ward being change: ', ward)
      userSettings.defaultWard = ward.ward
    }
  }
}

// Fetch data when component is mounted
onMounted(async () => {
  // Initialize hospital and ward data
  await hospitalStore.initializeData()

  console.log('hospital store: ', hospitalStore.hospitals)
  console.log('ward store: ', hospitalStore.wards)
  // After fetching data, set the selected values based on stored settings
  setTimeout(() => {
    // Find the hospital ID that matches the stored hospital name
    if (userSettings.defaultHospital) {
      const hospital = hospitalStore.hospitals.find(
        (h) => h.hospital === userSettings.defaultHospital,
      )
      if (hospital) {
        selectedHospital.value = hospital.hospital_id
      }
    }

    // Find the ward ID that matches the stored ward name
    if (userSettings.defaultWard) {
      const ward = hospitalStore.wards.find((w) => w.ward === userSettings.defaultWard)
      if (ward) {
        selectedWard.value = ward.ward_id
      }
    }
  }, 500) // Small delay to ensure data is loaded
})

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
</script>
