<template>
  <div
    class="plan-simulation"
  >
    <unscheduled-jobs-table
      :has-emergency="hasEmergency"
      class="unscheduled-jobs-table"
      @insert="$emit('insert')"
    />
    <hr>
    <scheduled-jobs-table
      class="scheduled-jobs-table"
    />
  </div>
</template>

<script>
import UnscheduledJobsTable from './UnscheduledJobsTable'
import ScheduledJobsTable from './ScheduledJobsTable'
import { mapMutations } from 'vuex'

export default {
  name: 'PlanSimulation',
  components: {
    UnscheduledJobsTable,
    ScheduledJobsTable
  },
  props: {
    hasEmergency: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapMutations('simulation', ['updateScheduledJobs'])
  }
}
</script>

<style lang="scss" scoped>
.plan-simulation {
  .unscheduled-jobs-table {
    margin-bottom: 24px;
  }

  hr {
    margin-block-start: 0;
    margin-block-end: 24px;
    border-color: var(--color-bg-gray);
  }
}
</style>
