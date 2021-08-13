<template>
  <div
    v-if="isYKSchedule"
    class="plan-simulation"
  >
    <unscheduled-jobs-table
      class="unscheduled-jobs-table"
    />
    <hr>
    <scheduled-jobs-table
      v-show="!selectAllOrders"
      class="scheduled-jobs-table"
    />
  </div>
  <div
    v-else
    class="plan-simulation"
  >
    <jobs-header>
      <jobs-filter
        slot="filter"
        @submit="updateRestrictions"
      />
    </jobs-header>
    <jobs-table :restrictions="restrictions" />
  </div>
</template>

<script>
import JobsFilter from '@/schedule/components/JobsFilter'
import JobsTable from './JobsTable'
import JobsHeader from './JobsHeader'
import UnscheduledJobsTable from './UnscheduledJobsTable'
import ScheduledJobsTable from './ScheduledJobsTable'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'PlanSimulation',
  components: {
    JobsFilter,
    JobsTable,
    JobsHeader,
    UnscheduledJobsTable,
    ScheduledJobsTable
  },
  data () {
    return {
      restrictions: {}
    }
  },
  computed: {
    ...mapState('simulation', ['selectAllOrders']),
    ...mapState('scheduleSetting', ['globalJobStatusRestriction']),
    ...mapGetters('scheduleSetting', ['isYKSchedule'])
  },
  created () {
    if (this.globalJobStatusRestriction) {
      this.restrictions[this.globalJobStatusRestriction] = true
    }
  },
  methods: {
    updateRestrictions (newVal) {
      this.restrictions = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-simulation {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 24px;
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
