<template>
  <q-page padding>
    <div class="text-h4 text-primary q-mb-md">Patient Audits</div>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">
          Filters
          <q-badge 
            v-if="selectedHospital || selectedWard" 
            color="primary" 
            class="q-ml-sm"
          >
            {{ (selectedHospital ? 1 : 0) + (selectedWard ? 1 : 0) }} active
          </q-badge>
        </div>
        <div class="text-subtitle2 q-mb-md">Filter audits by hospital or ward</div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-5">
            <q-select
              filled
              v-model="selectedHospital"
              :options="hospitals"
              label="Filter by Hospital"
              clearable
              emit-value
              map-options
              @update:model-value="selectedWard = null"
            />
          </div>
          <div class="col-12 col-md-5">
            <q-select
              filled
              v-model="selectedWard"
              :options="wards"
              label="Filter by Ward"
              clearable
              emit-value
              map-options
              :disable="!wards.length"
            />
          </div>
          <div class="col-12 col-md-2 flex items-center">
            <q-btn
              color="secondary"
              label="Clear Filters"
              @click="clearFilters"
              :disable="!selectedHospital && !selectedWard"
              class="q-mt-sm"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <div class="text-h6">All Audits</div>
        <div class="text-subtitle2 q-mb-md">
          View and manage patient medication audits
          <span v-if="filteredAudits.length !== surveyStore.audits.length">
            (Showing {{ filteredAudits.length }} of {{ surveyStore.audits.length }} records)
          </span>
        </div>

        <!-- Data table with audits from the store -->
        <q-table
          title="Patient Medication Audits"
          :rows="filteredAudits"
          :columns="columns"
          row-key="id"
          :loading="surveyStore.loading"
          :rows-per-page-options="[10,20,30,50]"
        >
          <template v-slot:loading>
            <q-inner-loading showing>
              <q-spinner size="50px" color="primary" />
            </q-inner-loading>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-gutter-sm q-pa-lg">
              <q-icon name="sentiment_dissatisfied" size="2rem" color="grey-7" />
              <span class="text-h6 text-grey-7">
                {{ (selectedHospital || selectedWard) 
                  ? 'No audit data matches the current filters' 
                  : 'No audit data available yet' 
                }}
              </span>
              <q-btn
                v-if="selectedHospital || selectedWard"
                color="primary"
                label="Clear Filters"
                @click="clearFilters"
                class="q-mt-sm"
              />
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
                icon="edit"
                @click="editAudit(props.row.id)"
              />
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                @click="confirmDelete(props.row)"
              />
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
import { useQuasar } from 'quasar'
import { onMounted, onUnmounted, ref, computed } from 'vue'

const $q = useQuasar()
const router = useRouter()
const surveyStore = useSurveyStore()

// Filter variables
const selectedHospital = ref(null)
const selectedWard = ref(null)

// Get unique hospitals and wards for filter dropdowns
const hospitals = computed(() => {
  const uniqueHospitals = [...new Set(surveyStore.audits.map(audit => audit.hospital))]
  return uniqueHospitals
    .filter(Boolean) // Remove empty values
    .sort() // Sort alphabetically
    .map(hospital => ({ label: hospital, value: hospital })) // Format for q-select
})

const wards = computed(() => {
  let uniqueWards = []

  // If hospital is selected, only show wards from that hospital
  if (selectedHospital.value) {
    const hospitalAudits = surveyStore.getAuditsByHospital(selectedHospital.value)
    uniqueWards = [...new Set(hospitalAudits.map(audit => audit.ward))]
  } else {
    uniqueWards = [...new Set(surveyStore.audits.map(audit => audit.ward))]
  }

  return uniqueWards
    .filter(Boolean) // Remove empty values
    .sort() // Sort alphabetically
    .map(ward => ({ label: ward, value: ward })) // Format for q-select
})

// Filtered audits based on selected filters
const filteredAudits = computed(() => {
  let result = surveyStore.audits

  if (selectedHospital.value) {
    result = surveyStore.getAuditsByHospital(selectedHospital.value)
  }

  if (selectedWard.value) {
    result = result.filter(audit => audit.ward === selectedWard.value)
  }

  return result
})

// Clear all filters
const clearFilters = () => {
  selectedHospital.value = null
  selectedWard.value = null
}

// Fetch audits and set up real-time subscription when the component is mounted
onMounted(async () => {
  await surveyStore.fetchAudits()
})

// Clean up subscription when component is unmounted
onUnmounted(() => {
  surveyStore.unsubscribeFromRealtimeUpdates()
})

// Edit an audit
const editAudit = (id) => {
  router.push(`/surveys/${id}`)
}

// Confirm and delete an audit
const confirmDelete = (audit) => {
  $q.dialog({
    title: 'Confirm Deletion',
    message: `Are you sure you want to delete the audit for patient ${audit.patientId}?`,
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    const { success, error } = await surveyStore.removeAudit(audit.id)

    if (success) {
      $q.notify({
        color: 'positive',
        icon: 'check_circle',
        message: 'Audit deleted successfully',
        position: 'top',
        timeout: 2000,
      })
    } else {
      $q.notify({
        color: 'negative',
        icon: 'error',
        message: 'Error deleting audit: ' + (error || 'Unknown error'),
        position: 'top',
        timeout: 3000,
      })
    }
  })
}

// Table columns definition
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
    name: 'collectorName',
    required: true,
    label: 'Collector',
    align: 'left',
    field: 'collectorName',
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
    name: 'isHighRisk',
    label: 'High Risk',
    align: 'center',
    field: 'isHighRisk',
    format: (val) => (val ? 'Yes' : 'No'),
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    align: 'center',
    field: 'actions',
  },
]
</script>
