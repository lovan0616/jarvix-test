
<template>
  <div class="current-simulation">
    <h2 class="header">
      <div class="header-left">
        {{ $t('schedule.schedule.title') }}
      </div>
      <div
        v-if="planInfo.planId"
        class="header-right"
      >
        <default-button
          v-if="!isYKSchedule"
          :is-disabled="isProcessingProductionProgress"
          type="secondary"
          @click="syncProductionProgress"
        >
          {{ $t('schedule.rolling.syncProductionProgress') }}
        </default-button>
        <default-button
          v-if="isYKSchedule"
          :loading="isLoadingLastSolution"
          class="simulate-btn"
          @click="downloadSimulation"
        >
          {{ $t('schedule.schedule.downloadPlan') }}
        </default-button>
        <default-button
          :is-disabled="isLoadingLastSolution"
          @click="reSimulate"
        >
          {{ $t('schedule.schedule.reSimulate') }}
        </default-button>
      </div>
    </h2>
    <jobs-filter
      v-if="!isLoading && planInfo.planId && !isYKSchedule"
      :job-states-options="jobStates"
      @submit="updateRestrictions"
    />
    <spinner v-if="isLoading" />
    <div
      v-else-if="planInfo.planId"
      :class="isYKSchedule ? 'iframe-container' : 'simulation-content'"
    >
      <template
        v-if="isYKSchedule"
      >
        <iframe
          :src="`https://view.officeapps.live.com/op/embed.aspx?src=${excelURL}`"
          width="100%"
          height="100%"
          frameborder="0"
        />
      </template>
      <template
        v-else
      >
        <div class="plan-KPI KPI">
          <h3 class="KPI__title">
            {{ $t('schedule.schedule.planKPI') }}
          </h3>
          <div class="KPI__info">
            <span class="KPI__info--item">
              {{ $t('schedule.schedule.dateRange') }}：{{ KPIInfo.timeRange }}
            </span>
            <span class="KPI__info--item">
              {{ $t('schedule.schedule.capacity') }}：{{ formatComma(KPIInfo.capacity) }}個
            </span>
            <span class="KPI__info--item">
              {{ $t('schedule.schedule.ofr') }}：{{ KPIInfo.ofr }}％
            </span>
            <span class="KPI__info--item">
              {{ $t('schedule.schedule.utilization') }}：{{ KPIInfo.utilization }}％
            </span>
          </div>
        </div>
        <plan-job
          :plan-info="planInfo"
          :restrictions="restrictions"
        />
        <plan-gantt
          :restrictions="restrictions"
          :plan-info="planInfo"
          :job-states="jobStates"
        />
      </template>
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
import JobsFilter from '@/schedule/components/JobsFilter'
import { JOB_STATUS } from '@/schedule/utils/enum'
import { getPlanInfo, getPlanKPI, getLastSolution } from '@/schedule/API/Plan'
import { Message } from 'element-ui'
import { mapMutations, mapState, mapGetters } from 'vuex'

export default {
  name: 'CurrentSimulation',
  components: {
    PlanJob,
    PlanGantt,
    JobsFilter
  },
  data () {
    return {
      isLoading: false,
      isLoadingLastSolution: false,
      isProcessingProductionProgress: false,
      planInfo: {},
      KPIInfo: {
        capacity: 0,
        ofr: 0,
        utilization: 0,
        timeRange: ''
      },
      restrictions: {},
      excelURL: `${window.env.SCHEDULE_API_ROOT_URL}plan/result/excelFile?projectId=${this.$route.params.schedule_project_id}`
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    jobStates () {
      return [
        JOB_STATUS.OVERDUE,
        JOB_STATUS.DELAY,
        JOB_STATUS.OVERDUE_DELAY
      ]
    },
    ...mapGetters('scheduleSetting', ['isYKSchedule'])
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
        this.KPIInfo.ofr = Number(this.KPIInfo.ofr * 100).toFixed(2)
        this.KPIInfo.utilization = Number(this.KPIInfo.utilization * 100).toFixed(2)
        this.KPIInfo.timeRange = this.planInfo.startDate + '-' + this.planInfo.endDate
      })
      this.isLoading = false
    },
    simulateNewPlan () {
      this.$router.push({ name: 'SimulationSetting' })
    },
    syncProductionProgress () {
      this.isProcessingProductionProgress = true
      this.$store.dispatch('scheduleSetting/syncProductionProgress')
        .then(() => {
          Message({
            message: '生產狀況同步成功',
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(() => {})
        .finally(() => {
          this.isProcessingProductionProgress = false
        })
    },
    downloadSimulation () {
      let link = document.createElement('a')
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        link.setAttribute('href', this.excelURL)
        link.setAttribute('download', 'plan.xlsx')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
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
    },
    updateRestrictions (newVal) {
      this.restrictions = newVal
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
    display: flex;
    justify-content: space-between;
    margin: 0 0 12px 0;
    &-left {
      display: flex;
      .filter {
        margin-left: 16px;
      }
    }
    &-right {
      .default-button + .default-button {
        margin-left: 8px;
      }
    }
  }

  .jobs__filter {
    margin-bottom: 24px;
  }
  .iframe-container {
    height: 78vh;
  }

  .button-block {
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
