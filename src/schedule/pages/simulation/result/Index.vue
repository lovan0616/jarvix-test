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
          {{ $t('schedule.simulation.solution') }}
        </div>
        <div class="solution__list">
          <solution-card
            v-for="solution in solutions"
            :key="solution.solutionId"
            :solution="solution"
            :current-solution-sequence="currentSolution.sequence"
            :solution-failed-judger="isSolutionFailed"
            @click-card="switchSolution"
          />
        </div>
      </div>
      <div
        v-if="currentSolutionSequence"
        class="section__main"
      >
        <div class="section__header">
          <h2 class="section__title">
            {{ $t('schedule.simulation.title') }}
            <jobs-filter
              :job-states-options="jobStates"
              @submit="updateRestrictions"
            />
          </h2>
          <div class="section__header--actions">
            <default-button
              size="m"
              type="outline"
              @click="onClickBackToSetting"
            >
              {{ $t('schedule.simulation.backToSetting') }}
            </default-button>
            <default-button
              size="m"
              class="adopt-button"
              @click="adoptPlan"
            >
              {{ $t('schedule.simulation.adoptPlan') }}
            </default-button>
          </div>
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
        <!-- 交付計畫、排程計畫 -->
        <pagination-table
          v-else-if="resultType === 'order' || resultType === 'machine'"
          :is-processing="isProcessing"
          :pagination-info="pagination"
          :dataset="resultType === 'order' ? orderData : machineData"
          fixed-index
          height="100%"
          @change-page="updatePage"
        />
        <!-- 排程圖 -->
        <template v-else-if="resultType === 'schedule'">
          <div class="schedule__header">
            <span class="schedule__header-description">
              {{ $t('schedule.schedule.ganttInfo') }}
            </span>
            <div class="schedule__header-legend">
              <job-status-legend :job-states="jobStates" />
            </div>
            <div class="schedule__header-select">
              <span class="schedule__header-select-label">
                {{ $t('schedule.simulation.scheduleResult.viewScale') }}
              </span>
              <default-select
                v-model="scale"
                :options="scaleList"
              />
            </div>
          </div>
          <gantt-chart
            :current-solution-id="currentSolutionId"
            :max-view-range="maxViewRange"
            :restrictions="restrictions"
            :scale="scale"
            @click-schedule-item="onClickGanttBar"
          />
        </template>
        <!-- 方案比較 -->
        <solution-compare
          v-else-if="resultType === 'solutionCompare'"
          :solution="currentSolution"
        />
        <!-- 工單調整歷史 -->
        <adjust-history
          v-else-if="resultType === 'adjustHistory'"
          :sequence="currentSolutionSequence"
          @check="checkAdjustHistory"
        />
      </div>
      <spinner v-else />
    </div>
    <div class="page__section kpi">
      <h3 class="section__header">
        {{ $t('schedule.simulation.simulationKpiResult') }}
        <div
          class="section__collapse-controller"
          @click="isKpiCollapse = !isKpiCollapse"
        >
          {{ isKpiCollapse ? $t('schedule.base.openCollapseItem') : $t('schedule.base.closeCollapseItem') }}
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
    <adjust-job-dialog
      v-if="isShowAdjustJobDialog"
      :job-info="currentAdjustJob"
      :adjusted-job-info="adjustedJobInfo"
      :schedule-info="currentSolution"
      :is-view-mode="isViewAdjustHistory"
      @close="closeAdjustJobDialog"
      @confirm="onConfirmAdjustments"
    />
    <adjust-job-snack-bar
      v-if="Object.values(adjustedJobs).length > 0"
      :sequence="currentAdjustSolutionSeq"
      @re-adjust="setCurrentAdjustJobData"
      @simulate="startSimulateChildSolution"
      @cancel="onCancelAdjustments"
    />
    <clear-adjustment-confirm-dialog
      v-if="isShowConfirmResetAdjustDialog"
      ref="clearAdjustmentsConfirmDialog"
      :title="clearAdjustmentConfirmDialogTitle"
      :sequence="currentAdjustSolutionSeq"
    />
    <simulating-dialog
      v-if="isSimulatingDialogOpen"
      :current-solution="currentSolution"
      @finish="onFinishSimulateChildSolution"
      @cancel="cancelSimulation"
    />
  </div>
</template>

<script>
import PaginationTable from '@/schedule/components/table/PaginationTable'
import { getOrderSimulateResult, getMachineSimulateResult, getKpiResult, adoptionSolution } from '@/schedule/API/Simulation'
import BarChart from '@/schedule/components/chart/BarChart'
import GanttChart from '@/schedule/components/chart/gantt/GanttChart'
import SolutionCard from '../components/SolutionCard'
import JobStatusLegend from '@/schedule/components/JobStatusLegend'
import JobsFilter from '@/schedule/components/JobsFilter'
import AdjustJobDialog from './components/adjustJob/AdjustJobDialog'
import AdjustJobSnackBar from './components/adjustJob/AdjustJobSnackBar'
import ClearAdjustmentConfirmDialog from './components/adjustJob/ClearAdjustmentConfirmDialog'
import SimulatingDialog from './components/adjustJob/SimulatingDialog'
import SolutionCompare from './components/solutionCompare/SolutionCompare'
import AdjustHistory from './components/adjustJob/AdjustHistory'
import { JOB_STATUS, SIMULATION_RESULT } from '@/schedule/utils/enum'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'SimulationResult',
  components: {
    PaginationTable,
    BarChart,
    GanttChart,
    SolutionCard,
    JobStatusLegend,
    JobsFilter,
    AdjustJobDialog,
    AdjustJobSnackBar,
    SimulatingDialog,
    SolutionCompare,
    AdjustHistory,
    ClearAdjustmentConfirmDialog
  },
  data () {
    return {
      isLoading: false,
      isLoadingKpiResult: false,
      isProcessing: false,
      isSubmitting: false,
      isShowConfirmResetAdjustDialog: false,
      isSimulatingDialogOpen: false,
      isKpiCollapse: false,
      isViewAdjustHistory: false,
      resultType: 'order', // order, machine, schedule, solutionCompare
      restrictions: {},
      currentSolutionSequence: null,
      currentAdjustSolutionSeq: null,
      currentAdjustJob: null,
      orderData: {},
      machineData: {},
      scale: 720,
      kpiData: [],
      compareInfo: {
        parentWithoutSchedule: 0,
        childWithoutSchedule: 0
      },
      pagination: {
        currentPage: 0,
        totalPage: 0
      },
      searchedOrderId: null,
      clearAdjustmentConfirmDialogTitle: ''
    }
  },
  computed: {
    ...mapState('simulation', ['planId', 'solutions']),
    ...mapState('jobAdjustments', ['adjustedJobs', 'adjustedHistory']),
    ...mapState('scheduleSetting', ['equipments']),
    currentSolution () {
      if (!this.currentSolutionSequence) return undefined

      let solutions = []
      let solution = null

      if (this.isParentSolution(this.currentSolutionSequence)) {
        solutions = this.solutions
      } else {
        const parentSolutionSequence = Math.floor(this.currentSolutionSequence)
        const parentSolution = this.solutions.find(item => item.sequence === parentSolutionSequence)
        solutions = parentSolution.children.map(childSolution => {
          return {
            parentSolutionId: parentSolution.solutionId,
            ...parentSolution,
            ...childSolution
          }
        })
      }
      for (let i = 0; i < solutions.length; i++) {
        if (solutions[i].sequence === this.currentSolutionSequence) {
          solution = solutions[i]
          break
        }
      }
      return solution
    },
    currentSolutionId () {
      if (!this.currentSolution) return undefined
      return this.currentSolution.solutionId
    },
    adjustedJobInfo () {
      if (this.isViewAdjustHistory) {
        // 檢視已經模擬過的子方案的調整紀錄
        return (this.adjustedHistory[this.currentSolutionSequence] && this.adjustedHistory[this.currentSolutionSequence][this.currentAdjustJob.jobName])
      } else if (this.adjustedJobs) {
        // 檢視尚未模擬過的子方案的調整紀錄
        return this.adjustedJobs[this.currentAdjustJob.jobName]
      }
      return null
    },
    maxViewRange () {
      if (!this.currentSolution) return
      return {
        startTime: moment(this.currentSolution.scheduleStartDate).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(this.currentSolution.scheduleStartDate).add(this.currentSolution.scheduleDays, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
    },
    hasChildSolution () {
      let result = false
      for (let i = 0; i < this.solutions.length; i++) {
        if (this.solutions[i].children) {
          result = true
          break
        }
      }
      return result
    },
    tabs () {
      if (!this.currentSolution) return []
      return [
        {
          type: 'order',
          name: this.$t('schedule.schedule.jobDeliver')
        },
        {
          type: 'machine',
          name: this.$t('schedule.schedule.jobSchedule')
        },
        {
          type: 'schedule',
          name: this.$t('schedule.simulation.schedule')
        },
        ...(this.currentSolution.isChild
          ? [
            { type: 'solutionCompare', name: this.$t('schedule.solutionCompare.name') },
            { type: 'adjustHistory', name: this.$t('schedule.simulation.adjustJob.adjustList') }
          ]
          : []
        )
      ]
    },
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
    },
    jobStates () {
      return [
        JOB_STATUS.GENERAL,
        JOB_STATUS.SCHEDULED,
        JOB_STATUS.OVERDUE
      ]
    },
    isShowAdjustJobDialog () {
      return !!this.currentAdjustJob
    },
    orderTableHeaderList () {
      return [
        { title: 'order', name: this.$t('schedule.simulation.orderResult.order'), width: '160' },
        { title: 'job', name: this.$t('schedule.simulation.orderResult.job'), width: '160' },
        { title: 'targetDelivery', name: this.$t('schedule.simulation.orderResult.targetDelivery') },
        { title: 'completeDate', name: this.$t('schedule.simulation.orderResult.completeDate') },
        { title: 'startDate', name: this.$t('schedule.simulation.orderResult.startDate') },
        { title: 'material', name: this.$t('schedule.simulation.orderResult.material'), width: '220' },
        { title: 'product', name: this.$t('schedule.simulation.orderResult.product'), width: '220' },
        { title: 'priority', name: this.$t('schedule.simulation.orderResult.priority') },
        { title: 'quantity', name: this.$t('schedule.simulation.orderResult.quantity'), align: 'right' },
        { title: 'cycleTime', name: this.$t('schedule.simulation.orderResult.cycleTime'), width: '140', align: 'right' }
      ]
    },
    machineTableHeaderList () {
      return [
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
      ]
    },
    kpiDataTemplate () {
      return [
        { title: 'capacity', series: [], yAxisName: this.$t('schedule.simulation.count') },
        { title: 'ofr', series: [], yAxisName: this.$t('schedule.simulation.percentage') },
        { title: 'cycleTime', series: [], yAxisName: this.$t('schedule.simulation.dayCount') },
        { title: 'utilization', series: [], yAxisName: this.$t('schedule.simulation.percentage') }
      ]
    },
    priortyOptions () {
      return [
        { value: 1, label: this.$t('schedule.simulation.table.highPriority') },
        { value: 2, label: this.$t('schedule.simulation.table.secondPriority') },
        { value: 3, label: this.$t('schedule.simulation.table.lowPriority') }
      ]
    }
  },
  mounted () {
    // 找出第一個 演算成功 的方案
    const completedSolutions = this.solutions.filter(solution => {
      return !this.$store.state.simulation.simulationResult.failedSolutionIds.includes(solution.solutionId)
    })
    this.currentSolutionSequence = completedSolutions[0].sequence
    this.fetchOrderSimulateResult()
    this.fetchKpiResult()
  },
  destroyed () {
    if (Object.values(this.adjustedJobs).length > 0) this.$store.commit('jobAdjustments/clearAdjustedJobs')
  },
  methods: {
    fetchOrderSimulateResult (page = 0, size = 20, resetPagination = true) {
      this.isProcessing = true
      if (resetPagination) this.isLoading = true
      getOrderSimulateResult({ planId: this.planId, solutionId: this.currentSolutionId, page, size, ...this.restrictions })
        .then(res => {
          if (resetPagination) this.pagination = res.pagination
          this.orderData = {
            columns: { titles: this.orderTableHeaderList },
            data: res.data.map(data => {
              return {
                ...data,
                priority: this.priortyOptions[data.priority - 1].label,
                cycleTime: Number.parseFloat(data.cycleTime).toFixed(1)
              }
            }) || [],
            index: [...Array(res.data ? res.data.length : [])].map((x, i) => i)
          }
        })
        .finally(() => {
          this.isLoading = false
          this.isProcessing = false
        })
    },
    fetchMachineSimulateResult (page = 0, size = 20, resetPagination = true) {
      this.isProcessing = true
      if (resetPagination) this.isLoading = true
      getMachineSimulateResult({ planId: this.planId, solutionId: this.currentSolutionId, page, size, ...this.restrictions })
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
    fetchKpiResult () {
      this.isLoadingKpiResult = true
      this.kpiData = JSON.parse(JSON.stringify(this.kpiDataTemplate))
      getKpiResult(this.planId)
        .then(solutionKpiList => {
          if (solutionKpiList.length === 0) return
          solutionKpiList.forEach(s => {
            this.kpiData[0].series.push(s.capacity)
            this.kpiData[1].series.push(Number.parseFloat(s.ofr * 100).toFixed(2))
            this.kpiData[2].series.push(s.cycleTime)
            this.kpiData[3].series.push(Number.parseFloat(s.utilization * 100).toFixed(2))
          })
          this.kpiData.forEach(t => {
            t.xAxis = solutionKpiList.map(s => this.$t('schedule.simulation.plan') + s.solutionSeq.toString().replace('.', '-'))
          })
        })
        .finally(() => {
          this.isLoadingKpiResult = false
        })
    },
    async onClickGanttBar (scheduleItem) {
      // 調整工單只能針對第一層方案
      if (this.currentSolution.isChild) return
      if (
        // 當前有子模擬，欲開啟另一個子模擬，要跳提示
        Object.keys(this.adjustedJobs).length > 0 &&
        this.currentAdjustSolutionSeq &&
        this.currentAdjustSolutionSeq !== this.currentSolution.sequence
      ) {
        const title = this.$t('schedule.simulation.adjustJob.restartAdjustmentsConfirm', { solutionSequence: this.currentAdjustSolutionSeq })
        this.openClearAdjustmentsConfirmDialog(title)
          .then(() => {
            this.clearSolutionAdjustment()
            this.currentAdjustSolutionSeq = this.currentSolution.sequence
            this.setCurrentAdjustJobData(scheduleItem)
          })
          .finally(() => {
            this.isShowConfirmResetAdjustDialog = false
            this.clearAdjustmentConfirmDialogTitle = ''
          })
      } else {
        this.currentAdjustSolutionSeq = this.currentSolution.sequence
        this.setCurrentAdjustJobData(scheduleItem)
      }
    },
    openClearAdjustmentsConfirmDialog (title) {
      this.clearAdjustmentConfirmDialogTitle = title
      this.isShowConfirmResetAdjustDialog = true
      return new Promise((resolve, reject) => {
        this.$nextTick(() => {
          this.$refs.clearAdjustmentsConfirmDialog.$on('confirm', () => resolve())
          this.$refs.clearAdjustmentsConfirmDialog.$on('cancel', () => reject())
        })
      })
    },
    setCurrentAdjustJobData (scheduleItem) {
      this.isViewAdjustHistory = false
      this.currentAdjustJob = {
        jobName: scheduleItem.job || scheduleItem.jobName,
        jobId: scheduleItem.jobId,
        jobStartTime: scheduleItem.jobStartTime
      }
    },
    restartAdjustment () {
      this.clearSolutionAdjustment()
    },
    startSimulateChildSolution () {
      this.isSimulatingDialogOpen = true
    },
    onFinishSimulateChildSolution ({ result, childSequence = null }) {
      // TODO 待確認調整失敗訊息和呈現方式
      if (result === SIMULATION_RESULT.COMPLETED) {
        this.fetchKpiResult()
        // 將調整項目暫存以來，以供後續檢視
        this.$store.commit('jobAdjustments/setAdjustedHistory', {
          childSequence,
          adjustHistory: this.adjustedJobs
        })
      }
      this.clearSolutionAdjustment()
      this.isSimulatingDialogOpen = false
    },
    cancelSimulation () {
      this.isSimulatingDialogOpen = false
    },
    onConfirmAdjustments ($event) {
      this.$store.commit('jobAdjustments/setAdjustedJobsByJobName', $event)
      this.closeAdjustJobDialog()
    },
    onCancelAdjustments () {
      this.clearSolutionAdjustment()
    },
    closeAdjustJobDialog () {
      this.currentAdjustJob = null
    },
    clearSolutionAdjustment () {
      this.currentAdjustSolutionSeq = null
      this.$store.commit('jobAdjustments/clearAdjustedJobs')
    },
    switchSolution (solution) {
      if (this.isSolutionFailed(solution.solutionId)) return
      if (this.currentSolutionSequence === solution.sequence) return
      this.resultType = 'order'
      this.currentSolutionSequence = solution.sequence
      this.fetchOrderSimulateResult(0, 20, true)
    },
    switchTab (type) {
      if (this.resultType === type) return
      this.isLoading = false
      this.isProcessing = false
      this.resultType = type
      if (this.resultType === 'order') return this.fetchOrderSimulateResult(0, 20, true)
      if (this.resultType === 'machine') return this.fetchMachineSimulateResult(0, 20, true)
    },
    updatePage (page) {
      if (this.resultType === 'order') return this.fetchOrderSimulateResult(page - 1, 20, false)
      if (this.resultType === 'machine') return this.fetchMachineSimulateResult(page - 1, 20, false)
    },
    adoptPlan () {
      this.isSubmitting = true
      adoptionSolution(this.planId, this.currentSolution.solutionId)
        .then(() => {
          this.clearSimulationProgress()
          this.$store.commit('simulation/setSolutions', [])
          this.$router.push({ name: 'CurrentSimulation' })
        })
        .finally(() => { this.isSubmitting = false })
    },
    onClickBackToSetting () {
      if (this.hasChildSolution) {
        const title = this.$t('schedule.simulation.adjustJob.clearChildrenSolutionConfirm')
        this.openClearAdjustmentsConfirmDialog(title)
          .then(() => this.backToSetting())
          .catch(() => this.isShowConfirmResetAdjustDialog = false)
          .finally(() => this.clearAdjustmentConfirmDialogTitle = '')
      } else {
        this.backToSetting()
      }
    },
    backToSetting () {
      // 從模擬結果返回模擬設定，會清除當前任何模擬進度
      this.clearSimulationProgress()
      this.$router.push({ name: 'SimulationSetting' })
    },
    clearSimulationProgress () {
      this.$store.commit('simulation/setPlanId', null)
      this.$store.commit('simulation/removeAllChildrenSolution')
      this.$store.commit('jobAdjustments/clearAdjustedJobs')
      this.$store.commit('jobAdjustments/clearAdjustedHistory')
    },
    isSolutionFailed (solutionId) {
      return this.$store.state.simulation.simulationResult.failedSolutionIds.includes(solutionId)
    },
    updateRestrictions (newVal) {
      this.restrictions = newVal

      switch (this.resultType) {
        case 'order':
          this.fetchOrderSimulateResult()
          break
        case 'machine':
          this.fetchMachineSimulateResult()
          break
      }
    },
    isParentSolution (sequence) {
      // sequence 為整數代表為 parent solution
      return Number.isInteger(sequence)
    },
    checkAdjustHistory (jobName) {
      this.isViewAdjustHistory = true
      this.currentAdjustJob = this.adjustedHistory[this.currentSolutionSequence][jobName]
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
          padding-bottom: 12px;
          .section__title {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
          }
          &--actions {
            position: absolute;
            top: calc(100% + 8px);
            right: 0;
            .default-button + .default-button {
              margin-left: 8px;
            }
          }
        }
        &__main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          padding: 24px;
          border-left: 1px solid var(--color-border);
          overflow: auto;
          overflow: overlay;
          .spinner {
            height: calc(100% - 40px)
          }
          .schedule-gantt-chart {
            flex: 1;
          }
          .pagination-table {
            flex: 1;
            height: 0;
            ::v-deep .el-table {
              height: 100%;
            }
          }
        }
        &__tabs {
          margin-bottom: 15px;
        }
      }
      .schedule {
        &__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          &-description {
            margin-right: 16px;
          }
          &-select {
            display: flex;
            align-items: center;
            flex: 1;
            justify-content: flex-end;
            &-label {
              margin-right: 4px;
            }
            .default-select {
              padding-bottom: 0;
            }
          }
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
        ::v-deep .el-table {
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

  ::v-deep .el-tabs {
    width: 100%;
    margin-bottom: 12px;
    &>.el-tabs__header {
      border: none;
      margin: 0;
      width: calc(100% - 190px);

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

</style>
