<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Patients on 5+ Medications</div>
      <div class="text-subtitle2 q-mb-md">
        Patients taking 5 or more regular medications are considered high risk
      </div>
      <!-- Data table with high-risk audits from the store -->
      <q-table
        title="High Risk Patients"
        :rows="props.highRiskAudits"
        :columns="columns"
        row-key="id"
        :loading="props.loading"
        :rows-per-page-options="[10, 20, 30, 50]"
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
              @click="onViewAudit(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  highRiskAudits: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['view-audit'])

// Emit event when view button is clicked
const onViewAudit = (id) => {
  emit('view-audit', id)
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
</script>
