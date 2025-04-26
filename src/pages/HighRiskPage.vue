<template>
  <q-page padding>
    <div class="text-h4 text-primary q-mb-md">High Risk Patients</div>

    <q-card>
      <q-card-section>
        <div class="text-h6">Patients on 5+ Medications</div>
        <div class="text-subtitle2 q-mb-md">
          Patients taking 5 or more regular medications are considered high risk
        </div>

        <!-- Data table with high-risk audits from the store -->
        <q-table
          title="High Risk Patients"
          :rows="surveyStore.highRiskAudits"
          :columns="columns"
          row-key="id"
          :loading="surveyStore.loading"
        >
          <template v-slot:loading>
            <q-inner-loading showing>
              <q-spinner size="50px" color="primary" />
            </q-inner-loading>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-gutter-sm q-pa-lg">
              <q-icon name="sentiment_dissatisfied" size="2rem" color="grey-7" />
              <span class="text-h6 text-grey-7"> No high risk patients found </span>
            </div>
          </template>

          <!-- Actions column template -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="visibility"
                @click="viewAudit(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Summary Card -->
    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">Summary</div>
        <div class="row q-mt-md">
          <div class="col-12 col-md-4">
            <div class="text-subtitle2">Total Patients</div>
            <div class="text-h5">
              <q-skeleton v-if="surveyStore.loading" type="text" width="50px" />
              <template v-else>{{ surveyStore.stats.totalAudits }}</template>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="text-subtitle2">High Risk Patients</div>
            <div class="text-h5">
              <q-skeleton v-if="surveyStore.loading" type="text" width="50px" />
              <template v-else>{{ surveyStore.stats.highRiskCount }}</template>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <div class="text-subtitle2">Percentage</div>
            <div class="text-h5">
              <q-skeleton v-if="surveyStore.loading" type="text" width="50px" />
              <template v-else>{{ surveyStore.stats.highRiskPercentage }}%</template>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Ward Statistics Table -->
    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">High Risk Patients by Ward</div>
        <div class="text-subtitle2 q-mb-md">
          Percentage of high risk patients in each ward
        </div>

        <q-table
          title="Ward Statistics"
          :rows="wardStats"
          :columns="wardColumns"
          row-key="ward"
          :loading="surveyStore.loading"
        >
          <template v-slot:loading>
            <q-inner-loading showing>
              <q-spinner size="50px" color="primary" />
            </q-inner-loading>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-gutter-sm q-pa-lg">
              <q-icon name="sentiment_dissatisfied" size="2rem" color="grey-7" />
              <span class="text-h6 text-grey-7">No ward data available</span>
            </div>
          </template>

          <!-- Percentage column with color indicator -->
          <template v-slot:body-cell-percentage="props">
            <q-td :props="props">
              <div class="row items-center">
                <q-badge
                  :color="props.value >= 70 ? 'negative' : props.value >= 50 ? 'warning' : 'positive'"
                  class="q-mr-sm"
                >
                  {{ props.value }}%
                </q-badge>
                <q-linear-progress
                  :value="props.value / 100"
                  :color="props.value >= 70 ? 'negative' : props.value >= 50 ? 'warning' : 'positive'"
                  style="width: 100px"
                  class="q-ml-sm"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSurveyStore } from 'src/stores/survey-store'
import { onMounted, onUnmounted, computed } from 'vue'

const router = useRouter()
const surveyStore = useSurveyStore()

// Computed property to calculate ward statistics
const wardStats = computed(() => {
  if (!surveyStore.audits.length) return []

  // Get unique wards
  const wards = [...new Set(surveyStore.audits.map(audit => audit.ward))]

  // Calculate stats for each ward
  return wards.map(ward => {
    const wardAudits = surveyStore.audits.filter(audit => audit.ward === ward)
    const wardHighRiskAudits = wardAudits.filter(audit => audit.isHighRisk)
    const totalPatients = wardAudits.length
    const highRiskPatients = wardHighRiskAudits.length
    const percentage = totalPatients > 0 ? Math.round((highRiskPatients / totalPatients) * 100) : 0

    return {
      ward,
      totalPatients,
      highRiskPatients,
      percentage
    }
  }).sort((a, b) => b.percentage - a.percentage) // Sort by percentage descending
})

// Fetch all audits, high-risk audits, and stats when the component is mounted
onMounted(async () => {
  await Promise.all([
    surveyStore.fetchAudits(),
    surveyStore.fetchHighRiskAudits(), 
    surveyStore.fetchStats()
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

// Table columns definition for high-risk patients
const columns = [
  {
    name: 'auditDate',
    required: true,
    label: 'Date',
    align: 'left',
    field: (row) => row.auditDate,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'patientId',
    required: true,
    label: 'Patient ID',
    align: 'left',
    field: 'patientId',
    sortable: true,
  },
  {
    name: 'bedNumber',
    label: 'Bed',
    align: 'left',
    field: 'bedNumber',
    sortable: true,
  },
  {
    name: 'ward',
    label: 'Ward',
    align: 'left',
    field: 'ward',
    sortable: true,
  },
  {
    name: 'hospital',
    label: 'Hospital',
    align: 'left',
    field: 'hospital',
    sortable: true,
  },
  {
    name: 'collectorName',
    label: 'Audited By',
    align: 'left',
    field: 'collectorName',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
    field: 'actions',
  },
]

// Table columns definition for ward statistics
const wardColumns = [
  {
    name: 'ward',
    required: true,
    label: 'Ward',
    align: 'left',
    field: 'ward',
    sortable: true,
  },
  {
    name: 'totalPatients',
    label: 'Total Patients',
    align: 'center',
    field: 'totalPatients',
    sortable: true,
  },
  {
    name: 'highRiskPatients',
    label: 'High Risk Patients',
    align: 'center',
    field: 'highRiskPatients',
    sortable: true,
  },
  {
    name: 'percentage',
    label: 'High Risk %',
    align: 'center',
    field: 'percentage',
    sortable: true,
  },
]
</script>
