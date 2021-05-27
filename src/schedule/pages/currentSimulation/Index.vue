
<template>
  <div class="current-simulation">
    <h2 class="header">
      {{ $t('schedule.schedule.title') }}
      <ticket-filter
        v-show="!isLoading"
        @search="searchString = $event"
      />
    </h2>
    <default-button
      v-if="planInfo.planId"
      :loading="isLoadingLastSolution"
      class="simulate-btn"
      @click="reSimulate"
    >
      {{ $t('schedule.schedule.reSimulate') }}
    </default-button>
    <div
      v-if="planInfo.planId"
      class="simulation-content"
    >
      <div class="plan-KPI KPI">
        <h3 class="KPI__title">
          {{ $t('schedule.schedule.planKPI') }}
        </h3>
        <div class="KPI__info">
          <span class="KPI__info--item">
            {{ $t('schedule.schedule.dateRange') }} {{ KPIInfo.timeRange }}
          </span>
          <span class="KPI__info--item">
            {{ $t('schedule.schedule.capacity') }} {{ KPIInfo.capacity }}個
          </span>
          <span class="KPI__info--item">
            {{ $t('schedule.schedule.ofr') }} {{ KPIInfo.ofr }}％
          </span>
          <span class="KPI__info--item">
            {{ $t('schedule.schedule.utilization') }} {{ KPIInfo.utilization }}％
          </span>
        </div>
      </div>
      <plan-job
        :key="`planJob-${searchString}`"
        :search-string="searchString"
      />
      <plan-gantt
        :key="`planGantt-${searchString}`"
        :search-string="searchString"
      />
    </div>
    <div
      v-else
      class="empty-block"
    >
      <img
        class="empty-block__icon"
        src="@/schedule/icons/empty.svg"
      >
      <span class="empty-block__text"> {{ $t('schedule.schedule.noPlan') }} </span>
      <default-button
        class="empty-block__btn"
        @click="simulateNewPlan"
      >
        {{ $t('schedule.button.simulateNewPlan') }}
      </default-button>
    </div>
  </div>
</template>

<script>
import PlanJob from './components/PlanJob'
import PlanGantt from './components/PlanGantt'
import TicketFilter from '@/schedule/components/TicketFilter'
import { getPlanInfo, getPlanKPI, getLastSolution } from '@/schedule/API/Plan'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'CurrentSimulation',
  components: {
    PlanJob,
    PlanGantt,
    TicketFilter
  },
  data () {
    return {
      isLoading: true,
      isLoadingLastSolution: false,
      planInfo: {
        planId: null,
        startDate: '',
        endDate: ''
      },
      KPIInfo: {
        capacity: 0,
        ofr: 0,
        utilization: 0,
        timeRange: ''
      },
      searchString: ''
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
  },
  mounted () {
    this.fetchData()
  },
  created () {
    this.setCurrentProjectId(Number(this.$route.params.schedule_project_id))
  },
  beforeDestroy () {
    this.updateScheduledJobs([])
  },
  methods: {
    ...mapMutations('simulation', ['updateScheduledJobs']),
    ...mapMutations('scheduleSetting', ['setCurrentProjectId']),
    async fetchData () {
      this.isLoading = true
      this.planInfo = await getPlanInfo(this.scheduleProjectId)
      getPlanKPI(this.scheduleProjectId).then(res => {
        this.KPIInfo = res
        this.KPIInfo.ofr = Math.ceil(this.KPIInfo.ofr * 100)
        this.KPIInfo.utilization = Math.ceil(this.KPIInfo.utilization * 100)
        this.KPIInfo.timeRange = this.planInfo.startDate + '-' + this.planInfo.endDate
      })
      this.isLoading = false
    },
    simulateNewPlan () {
      this.$router.push({ name: 'SimulationSetting' })
    },
    reSimulate () {
      this.isLoadingLastSolution = true
      const fetchDefaultSetting = this.$store.dispatch('scheduleSetting/getSetting')
      const fetchLastSolutionSetting = getLastSolution(this.scheduleProjectId)

      Promise.all([fetchDefaultSetting, fetchLastSolutionSetting])
        .then(([defaultSetting, lastSolution]) => {
          // 從當前計畫返回模擬，會清除當前任何模擬進度
          this.$store.commit('simulation/setPlanId', null)
          this.$store.commit('simulation/setSolutions', lastSolution.map(solution => ({ ...defaultSetting, ...solution, simulated: true, valid: null })))
          this.$router.push({ name: 'SimulationSetting' })
        }).finally(() => { this.isLoadingLastSolution = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.current-simulation {
  position: relative;
  padding: 24px;
  height: 100%;
  overflow: auto;
  overflow: overlay;

  .header {
    display: inline-flex;
    margin: 0 0 12px 0;
    .filter {
      margin-left: 16px;
    }
  }

  .simulate-btn {
    position: absolute;
    top: 24px;
    right: 24px;
  }

  .KPI {
    position: relative;
    padding: 0px 14px;
    margin-bottom: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;

    &__title {
      font-size: 18px;
      line-height: 22px;
      margin: 0 30px 0 0;

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

    &__info {
      font-size: 14px;
      line-height: 18px;
      margin-right: 24px;
      color: var(--color-text-light);

      &--item {
        &:not(:last-child) {
          margin-right: 24px;
        }
      }

    }
  }

  .empty-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 249px;
    background: var(--color-bg-gray);
    border-radius: 8px;

    &__icon {
      margin-bottom: 16px;
    }

    &__text {
      font-size: 16px;
      line-height: 20px;
      color: var(--color-text-gray);
      margin-bottom: 16px;
    }

    &__btn {
      width: 260px;
    }
  }
}
</style>
