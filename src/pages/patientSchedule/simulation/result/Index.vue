<template>
  <spinner
    v-if="isSubmitting"
    class="page__spinner"
  />
  <div
    v-else
    :class="{'is-kpi-collapse': isKpiCollapse}"
    class="page"
  >
    <div class="page__section detail">
      <div class="section__side-nav">
        <div class="section__title">
          Scenarios
        </div>
        <div class="solution__list">
          <div
            v-for="solution in solutions"
            :key="solution.solutionId"
            :class="{ 'is-active': solution.solutionId === currentSolutionId, 'is-failed': isSolutionFailed(solution.solutionId) }"
            class="solution card-like"
            @click="switchSolution(solution.solutionId)"
          >
            <div class="solution__title">
              Scenario {{ solution.sequence }}
            </div>
            <div class="solution__result--failed">
              Simulattion Failed
            </div>
          </div>
        </div>
      </div>
      <div class="section__main">
        <div class="section__header">
          <h2 class="section__title">
            Simulation Surgery
          </h2>
          <default-button
            size="m"
            @click="$router.push({ name: 'DemoOTSimulationSetting' })">
            Back To Setting
          </default-button>
          <default-button
            size="m"
            class="adopt-button"
            type="outline"
            @click="adoptPlan"
          >
            Accept Scenario
          </default-button>
        </div>
        <el-tabs
          :value="resultType"
          class="page__tabs schedule-tab"
          type="card"
          @tab-click="switchTab($event.name)"
        >
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.type"
            :label="tab.name"
            :name="tab.type"
          />
        </el-tabs>
        <spinner
          v-if="isLoading"
          class="spinner"
        />
        <template v-else-if="resultType === 'schedule'">
          <plan-gantt />
        </template>
      </div>
    </div>
    <div class="page__section kpi">
      <h3 class="section__header">
        Simulation Preference Comparison
        <div
          class="section__collapse-controller"
          @click="isKpiCollapse = !isKpiCollapse"
        >
          {{ isKpiCollapse ? 'Open' : 'Close' }}
          <i class="icon-controller el-icon-arrow-down" />
        </div>
      </h3>
      <spinner v-if="isLoadingKpiResult" />
      <div
        v-else
        class="section__content"
      >
        <bar-chart
          v-for="(data, index) in kpiData"
          :key="index"
          :chart-data="data"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PaginationTable from '@/schedule/components/table/PaginationTable'
import { getMachineSimulateResult, getMachineExcludeList } from '@/schedule/API/Simulation'
import ScheduleItem from './components/ScheduleItem'
import ScheduleLabel from './components/ScheduleLabel'
import BarChart from './components/BarChart'
import moment from 'moment'
import { mapState } from 'vuex'
import PlanGantt from '@/pages/patientSchedule/currentSimulation/components/PlanGantt'

export default {
  name: 'SimulationResult',
  components: {
    PaginationTable,
    ScheduleItem,
    ScheduleLabel,
    BarChart,
    PlanGantt
  },
  data () {
    return {
      isLoading: false,
      isLoadingKpiResult: false,
      isLoadingGantt: false,
      isProcessing: false,
      isSubmitting: false,
      isJobEmpty: false,
      isKpiCollapse: false,
      resultType: 'schedule',
      currentSolutionId: null,
      orderData: {},
      machineData: {},
      ganttChartDataList: [],
      startTime: null,
      endTime: null,
      timeLines: [{
        time: null,
        color: '#1eb8c7'
      }],
      scale: 60,
      position: {},
      tabs: [
        {
          type: 'schedule',
          name: 'Scheduling'
        }
      ],
      orderTableHeaderList: [
        { title: 'order', name: this.$t('schedule.simulation.orderResult.order'), width: '160' },
        { title: 'job', name: this.$t('schedule.simulation.orderResult.job'), width: '160' },
        { title: 'targetDelivery', name: this.$t('schedule.simulation.orderResult.targetDelivery') },
        { title: 'completeDate', name: this.$t('schedule.simulation.orderResult.completeDate') },
        { title: 'startDate', name: this.$t('schedule.simulation.orderResult.startDate') },
        { title: 'material', name: this.$t('schedule.simulation.orderResult.material'), width: '220' },
        { title: 'product', name: this.$t('schedule.simulation.orderResult.product'), width: '220' },
        { title: 'priority', name: this.$t('schedule.simulation.orderResult.priority') },
        { title: 'quantity', name: this.$t('schedule.simulation.orderResult.quantity') },
        { title: 'cycleTime', name: this.$t('schedule.simulation.orderResult.cycleTime') }
      ],
      machineTableHeaderList: [
        { title: 'arriveTime', name: this.$t('schedule.simulation.machineResult.arriveTime'), width: '160' },
        { title: 'checkinTime', name: this.$t('schedule.simulation.machineResult.checkinTime'), width: '160' },
        { title: 'startTime', name: this.$t('schedule.simulation.machineResult.startTime'), width: '160' },
        { title: 'endTime', name: this.$t('schedule.simulation.machineResult.endTime'), width: '160' },
        { title: 'checkoutTime', name: this.$t('schedule.simulation.machineResult.checkoutTime'), width: '160' },
        { title: 'equipment', name: this.$t('schedule.simulation.machineResult.equipment') },
        { title: 'factorySite', name: this.$t('schedule.simulation.machineResult.factorySite') },
        { title: 'job', name: this.$t('schedule.simulation.machineResult.job'), width: '160' },
        { title: 'material', name: this.$t('schedule.simulation.machineResult.material'), width: '220' },
        { title: 'operation', name: this.$t('schedule.simulation.machineResult.operation') },
        { title: 'order', name: this.$t('schedule.simulation.machineResult.order'), width: '160' },
        { title: 'product', name: this.$t('schedule.simulation.machineResult.product'), width: '220' },
        { title: 'stage', name: this.$t('schedule.simulation.machineResult.stage') },
        { title: 'task', name: this.$t('schedule.simulation.machineResult.task') }
      ],
      pagination: {
        currentPage: 0,
        totalPage: 0
      },
      searchedOrderId: null,
      kpiData: [{"title":"Utilization Rate","series":[6293,6293],"yAxisName":"Count","xAxis":["Scenario 1","Scenario 2"]},{"title":"Turnover time","series":["56.70","39.70"],"yAxisName":"%","xAxis":["Scenario 1","Scenario 2"]},{"title":"Cost","series":[0.10277777777777779,0.10277777777777779],"yAxisName":"K","xAxis":["Scenario 1","Scenario 2"]},{"title":"Resource","series":["43.75","13.13"],"yAxisName":"K","xAxis":["Scenario 1","Scenario 2"]}],
      priortyOptions: [
        { value: 1, label: this.$t('schedule.simulation.table.highPriority') },
        { value: 2, label: this.$t('schedule.simulation.table.secondPriority') },
        { value: 3, label: this.$t('schedule.simulation.table.lowPriority') }
      ]
    }
  },
  computed: {
    ...mapState('simulation', ['planId', 'solutions']),
    ...mapState('scheduleSetting', ['equipments']),
    scaleList () {
      return [
        {
          label: this.$t('schedule.simulation.scheduleResult.halfDay'),
          value: 60
        },
        {
          label: 1 + this.$t('schedule.simulation.scheduleResult.day'),
          value: 120
        },
        {
          label: 3 + this.$t('schedule.simulation.scheduleResult.day'),
          value: 360
        },
        {
          label: 7 + this.$t('schedule.simulation.scheduleResult.day'),
          value: 720
        },
        {
          label: 14 + this.$t('schedule.simulation.scheduleResult.day'),
          value: 1440
        }
      ]
    }
  },
  mounted () {
    // 找出第一個 演算成功 的方案
    const completedSolutions = this.solutions.filter(solution => {
      return !this.$store.state.simulation.simulationResult.failedSolutionIds.includes(solution.solutionId)
    })
    this.currentSolutionId = completedSolutions[0].solutionId
  },
  methods: {
    fetchMachineSimulateResult (page = 0, size = 20, resetPagination = true) {
      this.isProcessing = true
      if (resetPagination) this.isLoading = true
      getMachineSimulateResult(this.planId, this.currentSolutionId, page, size)
        .then(res => {
          if (resetPagination) this.pagination = res.pagination
          this.machineData = {
            columns: { titles: this.machineTableHeaderList },
            data: res.data || [],
            index: [...Array(res.data ? res.data.length : [])].map((x, i) => i)
          }
        })
        .finally(() => {
          this.isLoading = false
          this.isProcessing = false
        })
    },
    fetchGanttChartData () {
      this.ganttChartDataList = []

      const getOperationInfo = getMachineSimulateResult(this.planId, this.currentSolutionId, 0, 0, true)
      const getExcludeInfo = getMachineExcludeList(this.planId, this.currentSolutionId)

      Promise.all([getOperationInfo, getExcludeInfo])
        .then(([operateData, restData]) => {
          if (operateData.length === 0) {
            this.isLoadingGantt = false
            this.isJobEmpty = true
            return
          }
          const tempChartList = {}
          let startTime
          let endTime

          // 整理排除時段的資料
          restData = restData.reduce((acc, cur) => {
            const restSchedule = cur.reasons.map(reason => ({
              ...reason,
              equipmentId: cur.equipmentId
            }))
            acc.push(...restSchedule)
            return acc
          }, [])

          // 結合正常和排除時段的資料
          const schedule = [...operateData, ...restData]

          schedule.forEach(item => {
            if (!tempChartList[item.equipmentId]) {
              tempChartList[item.equipmentId] = {}
              tempChartList[item.equipmentId].gtArray = [{
                ...item,
                start: item.startTime || item.startDatetime,
                end: item.endTime || item.endDatetime
              }]
              tempChartList[item.equipmentId].id = item.equipmentId
              tempChartList[item.equipmentId].name = item.equipment
            } else {
              tempChartList[item.equipmentId].gtArray.push({
                ...item,
                start: item.startTime || item.startDatetime,
                end: item.endTime || item.endDatetime
              })
            }

            const currentStartTime = moment(item.startTime || item.startDatetime)
            const currentEndTime = moment(item.endTime || item.endDatetime)

            // 找出最早和最晚時間
            if (!startTime || !endTime) {
              startTime = currentStartTime
              endTime = currentEndTime
            } else {
              if (currentStartTime.diff(startTime) < 0) startTime = currentStartTime
              if (currentEndTime.diff(endTime) > 0) endTime = currentEndTime
            }
          })

          this.startTime = startTime.format('YYYY-MM-DD HH:mm:ss')
          this.endTime = endTime.format('YYYY-MM-DD HH:mm:ss')

          for (const equipmentId in tempChartList) {
            tempChartList[equipmentId].name = this.equipments.find(option => option.value === Number(equipmentId)).label
            this.ganttChartDataList.push(tempChartList[equipmentId])
          }
          this.isLoadingGantt = false
        })
    },
    switchSolution (solutionId) {
      if (this.isSolutionFailed(solutionId)) return
      if (this.currentSolutionId === solutionId) return
      this.currentSolutionId = solutionId
    },
    switchTab (type) {
      if (this.resultType === type) return
      this.isLoading = false
      this.isProcessing = false
      this.resultType = type
      if (this.resultType === 'schedule') return this.fetchGanttChartData()
    },
    scrollToLeft (value) {
      this.position = { x: value }
    },
    adoptPlan () {
      this.$router.push({ name: 'DemoCurrentOTSimulation', query: {
          planned: true,
          inserted: this.$route.query.inserted
        }
      })
    },
    searchOrder (orderId) {
      this.searchedOrderId = orderId
    },
    cancelSearchOrder () {
      this.searchedOrderId = null
    },
    isSolutionFailed (solutionId) {
      return this.$store.state.simulation.simulationResult.failedSolutionIds.includes(solutionId)
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__spinner {
    margin-top: 30vh;
  }
  &__section {
    &.detail {
      flex: 1;
      height: 0;
      display: flex;

      .section {
        &__side-nav {
          padding: 24px;
          width: 250px;
          display: flex;
          flex-direction: column;
          .section__title {
            font-size: 18px;
            line-height: 22px;
            margin-bottom: 12px;
          }
          .solution__list {
            overflow: auto;
            .card-like {
              height: auto;
              padding: 16px 0 16px 16px;
            }
          }
        }
        &__header {
          position: relative;
          display: flex;
          justify-content: space-between;
        }
        &__main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          padding: 24px;
          border-left: 1px solid var(--color-border);
          .spinner {
            height: calc(100% - 40px)
          }
          .schedule-gantt-chart {
            flex: 1;
          }
          .pagination-table {
            flex: 1;
            height: 0;
            /deep/ .el-table {
              height: 100%;
            }
          }
        }
        &__tabs {
          margin-bottom: 15px;
        }
      }
      .adopt-button {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
      }
      .schedule {
        &__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
        }
      }
    }
    &.kpi {
      flex: 0 0 342px;
      padding: 24px;
      border-top: 1px solid var(--color-border);
      transition: all .3s ease;
      .section {
        &__header {
          margin-top: 0;
          margin-bottom: 0;
          padding-bottom: 12px;
        }
        &__content {
          display: flex;
          .card {
            flex: 1;
          }
        }
        &__collapse-controller {
          font-size: 12px;
          color: var(--color-text);
          cursor: pointer;
          .icon-controller {
            margin-left: 6px;
            font-size: 14px;
          }
        }
      }
    }
  }
  &.is-kpi-collapse {
    .page__section.kpi {
      flex: 0 0 50px;
    }
    .section__header {
      padding-bottom: 0;
    }
    .section__content {
      display: none;
    }
    .icon-controller {
      transform: rotate(180deg);
    }
  }

  .section {
    &__side-nav {
      padding: 24px;
      width: 250px;
      display: flex;
      flex-direction: column;
      .section__title {
        font-size: 18px;
        line-height: 22px;
        margin-bottom: 12px;
      }
      .solution__list {
        overflow: auto;
      }
    }
    &__header {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &__main {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      padding: 24px;
      border-left: 1px solid var(--color-border);
      .section__title {
        margin-top: 0;
        margin-bottom: 0;
      }
      .spinner {
        height: calc(100% - 40px)
      }
      .schedule-gantt-chart {
        flex: 1;
      }
      .pagination-table {
        flex: 1;
        /deep/ .el-table {
          height: 100%;
        }
      }
    }
    &__tabs {
      margin-bottom: 15px;
    }
    .adopt-button {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
    }
    .schedule {
      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
      }
    }
  }

  /deep/.gantt-timeline {
    margin-left: 0 !important;
  }

  /deep/ .el-tabs {
    width: 100%;
    margin-bottom: 12px;
    &>.el-tabs__header {
      border: none;
      margin: 0;
      width: calc(100% - 135px);

      .el-tabs__nav {
        position: relative;
        width: 100%;
        border: none;
        overflow-x: auto;

        &::before {
          content: '';
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 3px;
          background: #324B4E;
        }
      }
      .el-tabs__item {
        border: none;
        color:  #AAAAAA;
        border-bottom: 3px solid #324B4E;
        text-align: center;
        width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: top;
        &.is-active {
          color: #fff;
          background: linear-gradient(360deg, #324B4E 0%, rgba(50, 75, 78, 0) 100%);
          border-bottom: 3px solid $theme-color-primary;
        }
      }
    }
  }
}

.empty-block {
  text-align: center;
  &__text {
    font-size: 12px;
    line-height: 60px;
    color: var(--color-text-gray);
  }
}
</style>
