<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">High Risk Patients by Ward</div>
      <div class="text-subtitle2 q-mb-md">
        Percentage of high risk patients in each ward
        <q-btn
          color="primary"
          icon="file_download"
          label="Export to CSV"
          class="float-right"
          @click="exportToCSV"
          :disable="!wardStats.length || loading"
        />
      </div>

      <q-table
        title="Ward Statistics"
        :rows="wardStats"
        :columns="wardColumns"
        row-key="ward"
        :loading="loading"
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
</template>

<script setup>
import { computed } from 'vue'
import { exportFile, useQuasar } from 'quasar'

const props = defineProps({
  audits: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const $q = useQuasar()

// Computed property to calculate ward statistics
const wardStats = computed(() => {
  if (!props.audits.length) return []

  // Get unique wards
  const wards = [...new Set(props.audits.map((audit) => audit.ward))]

  // Calculate stats for each ward
  return wards
    .map((ward) => {
      const wardAudits = props.audits.filter((audit) => audit.ward === ward)
      const wardHighRiskAudits = wardAudits.filter((audit) => audit.isHighRisk)
      const totalPatients = wardAudits.length
      const highRiskPatients = wardHighRiskAudits.length
      const percentage =
        totalPatients > 0 ? Math.round((highRiskPatients / totalPatients) * 100) : 0
      // Get the hospital name from the first audit record for this ward
      const hospital = wardAudits.length > 0 ? wardAudits[0].hospital : ''

      return {
        ward,
        hospital,
        totalPatients,
        highRiskPatients,
        percentage,
      }
    })
    .sort((a, b) => b.percentage - a.percentage) // Sort by percentage descending
})

// Function to export ward statistics to CSV
const exportToCSV = () => {
  // Helper function to properly format CSV fields
  const wrapCsvValue = (val) => {
    let formatted = val !== null && val !== undefined ? String(val) : ''

    // Double quotes need to be doubled
    formatted = formatted.replace(/"/g, '""')

    // Wrap in quotes if the value contains commas, quotes, or newlines
    if (formatted.includes(',') || formatted.includes('"') || formatted.includes('\n')) {
      formatted = `"${formatted}"`
    }

    return formatted
  }

  // Define the column headers for the CSV
  const columns = wardColumns.map((col) => wrapCsvValue(col.label))

  // Create CSV content with headers
  let csvContent = columns.join(',') + '\n'

  // Add data rows
  wardStats.value.forEach((row) => {
    const rowData = [
      wrapCsvValue(row.hospital),
      wrapCsvValue(row.ward),
      wrapCsvValue(row.totalPatients),
      wrapCsvValue(row.highRiskPatients),
      wrapCsvValue(row.percentage + '%'),
    ]
    csvContent += rowData.join(',') + '\n'
  })

  // Use Quasar's exportFile utility to download the CSV
  const status = exportFile('high_risk_patients_by_ward.csv', csvContent, 'text/csv')

  // Use the Quasar Notify plugin to show success or error message
  if (status === true) {
    $q.notify({
      color: 'positive',
      message: 'Ward statistics exported successfully',
      icon: 'file_download',
    })
  } else {
    $q.notify({
      color: 'negative',
      message: 'Export failed - browser denied file download',
      icon: 'error',
    })
  }
}

// Table columns definition for ward statistics
const wardColumns = [
  {
    name: 'hospital',
    label: 'Hospital',
    align: 'left',
    field: 'hospital',
    sortable: true,
  },
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
