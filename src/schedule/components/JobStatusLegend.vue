<template>
  <div class="job-status-legend">
    <span
      v-for="status in jobStates"
      :key="status"
      :style="{ color: jobColorVar[status.toLowerCase()] }"
      class="legend"
    >
      {{ $t(`schedule.rolling.${snakeToCamel(status)}`) }}
    </span>
  </div>
</template>

<script>
import { JOB_STATUS } from '@/schedule/utils/enum'
import { snakeToCamel } from '@/schedule/utils/mixins'
import jobColorVar from '@/schedule/styles/common/_variables.scss'

export default {
  name: 'JobStatusLegend',
  props: {
    jobStates: {
      type: Array,
      default: () => Object.values(JOB_STATUS)
    }
  },
  data () {
    return {
      JOB_STATUS,
      jobColorVar
    }
  },
  methods: {
    snakeToCamel
  }
}
</script>

<style lang="scss" scoped>
@import '@/schedule/styles/components/_job.scss';

.job-status-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 400;
  .legend {
    position: relative;
    font-size: 14px;
    padding-left: 12px;
    @include job-state-dot;
  }
}
</style>
