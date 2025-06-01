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
import { useRoute, useRouter } from 'vue-router'
import { useSurveyStore } from 'src/stores/survey-store'
import SurveyForm from 'components/SurveyForm.vue'
import { computed, onMounted, ref } from 'vue'
import { useToaster } from 'src/composables/userToaster.js'

// const $q = useQuasar() //todo delete
const router = useRouter()
const route = useRoute()
const surveyStore = useSurveyStore()
const { showError, showSuccess } = useToaster()

// Check if we're in edit mode
const auditId = computed(() => route.params.id)
const isEditing = computed(() => !!auditId.value)
const auditData = ref(null)

// Fetch audit data if in edit mode
onMounted(async() => {
  if (isEditing.value) {
    await surveyStore.loadAudits()
    auditData.value = surveyStore.getAuditById(auditId.value)

    if (!auditData.value) {
      showError('Audit data not found.')
      await router.push('/surveys')
    }
  }
})

// Handle form submission using the store
const handleSubmit = async(formData) => {
  console.log('Form submitted:', formData)

  let result

  if (isEditing.value) {
    result = await surveyStore.editAudit(auditId.value, formData)
  } else {
    result = await surveyStore.saveAudit(formData)
  }

  const { success, error } = result

// success or error are returned from the survey store functions
  if (success) {
    showSuccess('Audit saved successfully')
    // Redirect to surveys list
    // router.push('/surveys')
  } else {
    showError(error.message)
  }
}
</script>
