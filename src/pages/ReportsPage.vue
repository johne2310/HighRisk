<template>
  <q-page padding>
    <div class="text-h4 text-primary q-mb-md">Audit Reports</div>

    <div class="row q-col-gutter-md">
      <!-- Report Filters -->
      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Report Filters</div>

            <q-form class="q-gutter-md q-mt-md">
              <q-select
                filled
                v-model="reportType"
                :options="reportTypeOptions"
                label="Report Type"
              />

              <q-input filled v-model="dateRange.from" label="From Date" type="date" />

              <q-input filled v-model="dateRange.to" label="To Date" type="date" />

              <q-select filled v-model="hospital" :options="['Eastern', 'Richmond', 'Camberwell']" label="Hospital" clearable />

              <q-select
                filled
                v-model="ward"
                :options="['5 South']"
                label="Ward"
                clearable
                :disable="!hospital"
              />

              <div>
                <q-btn color="primary" label="Generate Report" @click="generateReport" />

                <q-btn
                  color="secondary"
                  flat
                  label="Reset Filters"
                  class="q-ml-sm"
                  @click="resetFilters"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>

      <!-- Report Preview -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">Report Preview</div>

            <div v-if="!reportGenerated" class="text-center q-pa-lg">
              <q-icon name="assessment" size="4rem" color="grey-7" />
              <div class="text-subtitle1 q-mt-md text-grey-7">
                Use the filters on the left to generate a report
              </div>
            </div>

            <div v-else>
              <!-- Placeholder for actual report content -->
              <div class="text-center q-pa-lg">
                <q-spinner size="50px" color="primary" />
                <div class="text-subtitle1 q-mt-md">Generating report...</div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions v-if="reportGenerated" align="right">
            <q-btn flat color="primary" label="Export PDF" icon="picture_as_pdf" />
            <q-btn flat color="primary" label="Export CSV" icon="table_view" />
            <q-btn flat color="primary" label="Print" icon="print" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

// Report filters
const reportType = ref('summary')
const reportTypeOptions = [
  { label: 'Summary Report', value: 'summary' },
  { label: 'High Risk Patients', value: 'high-risk' },
  { label: 'Hospital Breakdown', value: 'hospital' },
  { label: 'Ward Breakdown', value: 'ward' },
  { label: 'Trend Analysis', value: 'trend' },
]

const dateRange = ref({
  from: new Date().toISOString().substr(0, 10),
  to: new Date().toISOString().substr(0, 10),
})

const hospital = ref(null)
const ward = ref(null)
const reportGenerated = ref(false)

// Generate report function
const generateReport = () => {
  reportGenerated.value = true

  // In a real implementation, this would:
  // 1. Call an API to generate the report based on filters
  // 2. Update the UI with the report data
  // 3. Enable export options
}

// Reset filters function
const resetFilters = () => {
  reportType.value = 'summary'
  dateRange.value = {
    from: new Date().toISOString().substr(0, 10),
    to: new Date().toISOString().substr(0, 10),
  }
  hospital.value = null
  ward.value = null
  reportGenerated.value = false
}
</script>
