<template>
  <div
    class="plan-simulation"
  >
    <unscheduled-jobs-table
      class="unscheduled-jobs-table"
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
  methods: {
    ...mapMutations('simulation', ['updateScheduledJobs'])
  }
}
</script>

<style lang="scss" scoped>
.plan-simulation {
  display: flex;
  flex-direction: column;
  flex: 1;
  .unscheduled-jobs-table {
    flex: 1;
    margin-bottom: 24px;
  }
  .scheduled-jobs-table {
    flex: 1;
  }

  hr {
    margin-block-start: 0;
    margin-block-end: 24px;
    border-color: var(--color-bg-gray);
  }
}
</style>
