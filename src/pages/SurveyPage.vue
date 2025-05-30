<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 col-md-8">
        <q-card class="q-pa-md">
          <q-card-section>
            <div class="text-h5 text-primary q-mb-md">
              {{ isEditing ? 'Edit Patient Audit' : 'New Patient Audit' }}
            </div>
            <div class="text-subtitle2 q-mb-lg">
              {{
                isEditing
                  ? 'Update the patient medication audit information.'
                  : 'Complete the form below to record a patient medication audit.'
              }}
            </div>
          </q-card-section>

          <q-card-section>
            <survey-form @submit="handleSubmit"
                         :initial-data="auditData" />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { useSurveyStore } from 'src/stores/survey-store'
import SurveyForm from 'components/SurveyForm.vue'
import { ref, computed, onMounted } from 'vue'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const surveyStore = useSurveyStore()

// Check if we're in edit mode
const auditId = computed(() => route.params.id)
const isEditing = computed(() => !!auditId.value)
const auditData = ref(null)

// Fetch audit data if in edit mode
onMounted(async() => {
  if (isEditing.value) {
    await surveyStore.fetchAudits()
    auditData.value = surveyStore.getAuditById(auditId.value)

    if (!auditData.value) {
      $q.notify({
        color: 'negative',
        icon: 'error',
        message: 'Audit not found',
        position: 'top',
        timeout: 2000
      })
      await router.push('/surveys')
    }
  }
})

// Handle form submission using the store
const handleSubmit = async(formData) => {
  console.log('Form submitted:', formData)

  // Show loading notification
  // $q.notify({
  //   group: 'loading',
  //   spinner: true,
  //   message: isEditing.value ? 'Updating audit data...' : 'Saving audit data...',
  //   position: 'top',
  //   timeout: 1000,
  // })

  let result

  // Save or update the audit data using the store
  if (isEditing.value) {
    result = await surveyStore.editAudit(auditId.value, formData)
  } else {
    result = await surveyStore.saveAudit(formData)
  }

  const { success, error } = result

  // Dismiss all notifications in the 'loading' group
  // Using Quasar's Notify plugin API to dismiss notifications
  // $q.notify({
  //   group: 'loading',
  //   timeout: 0,
  //   message: '',
  //   position: 'top',
  // })

  if (success) {
    // Show success notification
    $q.notify({
      color: 'positive',
      icon: 'check_circle',
      message: isEditing.value
        ? 'Survey data updated successfully'
        : 'Survey data saved successfully',
      position: 'top',
      timeout: 2000
    })

    // Redirect to surveys list
    // router.push('/surveys')
  } else {
    // Show error notification
    $q.notify({
      color: 'negative',
      icon: 'error',
      message: `Error ${isEditing.value ? 'updating' : 'saving'} data: ${error || 'Unknown error'}`,
      position: 'top',
      timeout: 2000
    })
  }
}
</script>
