<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Summary</div>
      <div class="row q-mt-md">
        <div class="col-12 col-md-4">
          <div class="text-subtitle2">Total Patients</div>
          <div class="text-h5">
            <q-skeleton v-if="props.loading"
                        type="text"
                        width="50px" />
            <template v-else>{{ props.stats.totalAudits }}</template>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-subtitle2">High Risk Patients</div>
          <div class="text-h5">
            <q-skeleton v-if="props.loading"
                        type="text"
                        width="50px" />
            <template v-else>{{ props.stats.highRiskCount }}</template>
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="text-subtitle2">Percentage</div>
          <div class="text-h5"
               :class="textColourClass">
            <q-skeleton v-if="props.loading"
                        type="text"
                        width="50px" />
            <template v-else>{{ props.stats.highRiskPercentage }}%</template>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      totalAudits: 0,
      highRiskCount: 0,
      highRiskPercentage: 0
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

/*
  function to change text colour of high risk patient % based on result
*/
const textColourClass = computed(() => {
  const count = props.stats.highRiskPercentage
  if (count > 95) {
    return 'text-green-9'
  } else if (count > 75) {
    return 'text-amber-9'
  } else {
    return 'text-red-9'
  }
})

</script>
<style scoped>

</style>

