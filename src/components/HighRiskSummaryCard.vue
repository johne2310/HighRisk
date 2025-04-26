<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Summary</div>
      <div class="row q-mt-md">
        <div class="col-12 col-md-4">
          <div class="text-subtitle2">Total Patients</div>
          <div class="text-h5">
            <q-skeleton v-if="props.loading" type="text" width="50px" />
            <template v-else>{{ props.stats.totalAudits }}</template>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-subtitle2">High Risk Patients</div>
          <div class="text-h5">
            <q-skeleton v-if="props.loading" type="text" width="50px" />
            <template v-else>{{ props.stats.highRiskCount }}</template>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-subtitle2">Percentage</div>
          <div class="text-h5">
            <q-skeleton v-if="props.loading" type="text" width="50px" />
            <template v-else>{{ props.stats.highRiskPercentage }}%</template>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      totalAudits: 0,
      highRiskCount: 0,
      highRiskPercentage: 0,
    }),
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>
