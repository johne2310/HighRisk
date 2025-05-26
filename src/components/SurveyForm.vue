<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div class="text-h6 q-mb-md">Patient Medication Audit Form</div>

    <!-- Date of audit -->
    <q-input
      filled
      v-model="form.auditDate"
      label="Date of Audit *"
      type="date"
      :rules="[(val) => !!val || 'Date is required']"
    />

    <!-- Name of person collecting data -->
    <q-input
      filled
      v-model="form.collectorName"
      label="Data Collector Name *"
      :rules="[(val) => !!val || 'Name is required']"
    />

    <!-- Patient ID -->
    <q-input
      filled
      v-model="form.patientId"
      label="Patient ID *"
      :rules="[(val) => !!val || 'Patient ID is required']"
    />

    <!-- Bed number -->
    <q-input
      filled
      v-model="form.bedNumber"
      label="Bed Number *"
      :rules="[(val) => !!val || 'Bed number is required']"
    />

    <!-- Ward -->
    <q-input
      filled
      v-model="form.ward"
      label="Ward *"
      :rules="[(val) => !!val || 'Ward is required']"
    />

    <!-- Hospital -->
    <q-input
      filled
      v-model="form.hospital"
      label="Hospital *"
      :rules="[(val) => !!val || 'Hospital is required']"
    />

    <!-- High-risk status (5+ medications) -->
    <div class="q-mb-md">
      <div class="text-subtitle1 q-mb-sm">Is the patient on 5 or more regular medications? *</div>
      <q-option-group v-model="form.isHighRisk" :options="highRiskOptions" color="primary" inline />
    </div>

    <div class="q-mt-lg">
      <q-btn label="Submit" type="submit" color="primary" />
      <q-btn label="Reset" type="reset" color="secondary" flat class="q-ml-sm" @click="resetForm" />
    </div>
  </q-form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSettingsStore } from '../stores/settings-store'
import { useAuthStore } from 'src/stores/auth-store'

// Define props
const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
})

// Get settings store
const settingsStore = useSettingsStore()
const authStore = useAuthStore()

// Default form values
const defaultForm = {
  auditDate: new Date().toISOString().substr(0, 10), // Default to today
  collectorName: '',
  patientId: '',
  bedNumber: '',
  ward: '',
  hospital: '',
  isHighRisk: null,
  user_id: authStore.userDetails.id,
}

// Form data
const form = ref({ ...defaultForm })

// Options for high-risk radio buttons
const highRiskOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
]

// Watch for changes in initialData prop
watch(
  () => props.initialData,
  (newValue) => {
    if (newValue) {
      // If we have initial data, use it to populate the form

      // Create a new object with all properties from newValue
      const formData = {}
      for (const key in newValue) {
        formData[key] = newValue[key]
      }

      // Ensure all required fields are present
      form.value = {
        auditDate: formData.auditDate || new Date().toISOString().substr(0, 10),
        collectorName: formData.collectorName || '',
        patientId: formData.patientId || '',
        bedNumber: formData.bedNumber || '',
        ward: formData.ward || '',
        hospital: formData.hospital || '',
        isHighRisk: formData.isHighRisk !== undefined ? formData.isHighRisk : null,
        user_id: formData.user_id || authStore.userDetails.id,
        // Include any other fields that might be in the original data

        ...formData,
      }
    }
  },
  { immediate: true },
)

// Load settings from settings store if available
onMounted(() => {
  console.log('user: ', authStore.userDetails)
  // Only load defaults if we're not in edit mode
  if (!props.initialData) {
    // Load collector name from settings store if available
    if (settingsStore.userSettings.defaultName) {
      form.value.collectorName = settingsStore.userSettings.defaultName
    }

    // Load hospital from settings store if available
    if (settingsStore.userSettings.defaultHospital) {
      form.value.hospital = settingsStore.userSettings.defaultHospital
    }

    // Load ward from settings store if available
    if (settingsStore.userSettings.defaultWard) {
      form.value.ward = settingsStore.userSettings.defaultWard
    }

    // Fallback to localStorage for backward compatibility
    const savedCollectorName = localStorage.getItem('collectorName')
    if (!form.value.collectorName && savedCollectorName) {
      form.value.collectorName = savedCollectorName
    }
  }
})

// Form submission
const emit = defineEmits(['submit'])

const onSubmit = () => {
  // Save collector name to localStorage for future forms (backward compatibility)
  localStorage.setItem('collectorName', form.value.collectorName)

  // Update settings store with collector name and hospital
  if (settingsStore.userSettings.rememberSettings) {
    settingsStore.userSettings.defaultName = form.value.collectorName
    settingsStore.userSettings.defaultHospital = form.value.hospital

    // If auto-save is not enabled, manually save the settings
    if (!settingsStore.appSettings.autoSave) {
      settingsStore.saveUserSettings()
    }
  }

  // Emit the form data to parent component
  emit('submit', { ...form.value })
}

// Reset form
const resetForm = () => {
  if (props.initialData) {
    // If we're in edit mode, reset to the initial data

    // Create a new object with all properties from initialData
    const formData = {}
    for (const key in props.initialData) {
      formData[key] = props.initialData[key]
    }

    // Ensure all required fields are present
    form.value = {
      auditDate: formData.auditDate || new Date().toISOString().substr(0, 10),
      // collectorName: formData.collectorName || '',
      patientId: formData.patientId || '',
      bedNumber: formData.bedNumber || '',
      ward: formData.ward || '',
      hospital: formData.hospital || '',
      isHighRisk: formData.isHighRisk !== undefined ? formData.isHighRisk : null,
      user_id: authStore.userDetails.id,

      // Include any other fields that might be in the original data
      ...formData,
    }
  } else {
    // If we're in create mode, reset to defaults but keep collector name and hospital
    form.value = {
      ...defaultForm,
      auditDate: new Date().toISOString().substr(0, 10), // Always use current date
      collectorName: form.value.collectorName, // Keep the collector name
      hospital: form.value.hospital, // Keep the hospital
      ward: form.value.ward,
    }
  }
}
</script>

<style scoped>
.q-form {
  max-width: 600px;
  margin: 0 auto;
}
</style>
