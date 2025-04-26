<template>
  <q-page padding>
    <div class="text-h4 text-primary q-mb-md">High Risk Patients</div>

    <!-- Patients on 5+ Medications Table -->
    <PatientsOnFivePlusMedications
      :high-risk-audits="surveyStore.highRiskAudits"
      :loading="surveyStore.loading"
      @view-audit="viewAudit"
    />

    <!-- Summary Card -->
    <HighRiskSummaryCard
      class="q-mt-md"
      :stats="surveyStore.stats"
      :loading="surveyStore.loading"
    />

    <!-- Ward Statistics Table -->
    <HighRiskPatientsByWard
      class="q-mt-md"
      :audits="surveyStore.audits"
      :loading="surveyStore.loading"
    />
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSurveyStore } from 'src/stores/survey-store'
import { onMounted, onUnmounted } from 'vue'
import HighRiskPatientsByWard from 'src/components/HighRiskPatientsByWard.vue'
import HighRiskSummaryCard from 'src/components/HighRiskSummaryCard.vue'
import PatientsOnFivePlusMedications from 'src/components/PatientsOnFivePlusMedications.vue'

const router = useRouter()
const surveyStore = useSurveyStore()

// Fetch all audits, high-risk audits, and stats when the component is mounted
onMounted(async () => {
  await Promise.all([
    surveyStore.fetchAudits(),
    surveyStore.fetchHighRiskAudits(),
    surveyStore.fetchStats(),
  ])
})

// Clean up subscription when component is unmounted
onUnmounted(() => {
  surveyStore.unsubscribeFromRealtimeUpdates()
})

// View audit details
const viewAudit = (id) => {
  router.push(`/surveys/${id}`)
}
</script>
