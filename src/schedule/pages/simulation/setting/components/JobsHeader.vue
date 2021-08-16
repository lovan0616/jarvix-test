<template>
  <div class="header">
    <h3 class="header__title">
      {{ $t('schedule.simulation.chooseJobs') }}
      <job-status-legend :job-states="jobStates" />
    </h3>
    <slot name="filter" />
  </div>
</template>

<script>
import JobStatusLegend from '@/schedule/components/JobStatusLegend.vue'
import { JOB_STATUS } from '@/schedule/utils/enum'

export default {
  name: 'JobsHeader',
  components: {
    JobStatusLegend
  },
  computed: {
    jobStates () {
      return [
        JOB_STATUS.SCHEDULED,
        JOB_STATUS.DELAY,
        JOB_STATUS.OVERDUE,
        JOB_STATUS.OVERDUE_DELAY
      ]
    }
  }

}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 12px;
  .header {
    &__title {
      display: flex;
      position: relative;
      gap: 8px;
      font-size: 20px;
      line-height: 24px;
      padding: 0 0 0 14px;
      margin-right: 16px;
      margin-top: 0;
      margin-bottom: 8px;

      &:before {
        content: "";
        position: absolute;
        left: 0%;
        top: 37.5%;
        width: 6px;
        height: 6px;
        background: #2AD2E2;
      }
    }
    &__button {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
