<template>
  <q-page padding>
    <div class="text-h4 text-primary q-mb-md">High Risk Patient Audit Dashboard</div>

    <div class="row q-col-gutter-md">
      <!-- Quick Stats -->
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="bg-primary text-white">
          <q-card-section>
            <div class="text-h6">Total Patients Audited</div>
            <div class="text-h3">
              <q-skeleton v-if="surveyStore.loading"
                          type="text"
                          width="50px" />
              <template v-else>{{ surveyStore.stats.totalAudits }}</template>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="bg-secondary text-white">
          <q-card-section>
            <div class="text-h6">High Risk Patients</div>
            <div class="text-h3">
              <q-skeleton v-if="surveyStore.loading"
                          type="text"
                          width="50px" />
              <template v-else>{{ surveyStore.stats.highRiskCount }}</template>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="bg-accent text-white">
          <q-card-section>
            <div class="text-h6">Today's Audits</div>
            <div class="text-h3">
              <q-skeleton v-if="surveyStore.loading"
                          type="text"
                          width="50px" />
              <template v-else>{{ surveyStore.stats.todayCount }}</template>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="q-mt-lg">
      <div class="text-h5 q-mb-md">Quick Actions</div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6 col-lg-3">
          <q-card class="cursor-pointer"
                  @click="$router.push('/survey')">
            <q-card-section class="bg-primary text-white text-center">
              <q-icon name="add_circle"
                      size="3rem" />
            </q-card-section>
            <q-card-section class="text-center">
              <div class="text-h6">New Audit</div>
              <div class="text-subtitle2">Create a new patient audit</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <q-card class="cursor-pointer"
                  @click="$router.push('/surveys')">
            <q-card-section class="bg-secondary text-white text-center">
              <q-icon name="list"
                      size="3rem" />
            </q-card-section>
            <q-card-section class="text-center">
              <div class="text-h6">View Audits</div>
              <div class="text-subtitle2">Review collected data</div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6 col-lg-3">
          <q-card class="cursor-pointer"
                  @click="$router.push('/high-risk')">
            <q-card-section class="bg-warning text-white text-center">
              <q-icon name="warning"
                      size="3rem" />
            </q-card-section>
            <q-card-section class="text-center">
              <div class="text-h6">High Risk</div>
              <div class="text-subtitle2">View high risk patients</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useSurveyStore } from 'src/stores/survey-store'
import { onMounted } from 'vue'

const $router = useRouter()
const surveyStore = useSurveyStore()

// Fetch statistics when the component is mounted
onMounted(async() => {
  await surveyStore.fetchStats()
})

</script>
