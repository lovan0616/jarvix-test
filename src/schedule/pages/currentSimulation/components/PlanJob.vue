<template>
  <div
    :class="{'is-collapsed': isCollapsed}"
    class="plan-job job"
  >
    <div class="job__header">
      <h3 class="job__title">
        {{ $t('schedule.schedule.jobInfo') }}
      </h3>
      <div
        class="collapse-controller"
        @click="isCollapsed = !isCollapsed"
      >
        {{ isCollapsed ? $t('schedule.base.openCollapseItem') : $t('schedule.base.closeCollapseItem') }}
        <i class="icon el-icon-arrow-down" />
      </div>
    </div>
    <div class="job__content">
      <el-tabs
        :value="resultType"
        class="job__tabs schedule-tab"
        type="card"
        @tab-click="switchTab($event.name)"
      >
        <el-tab-pane
          v-for="tab in tabs"
          :key="tab.type"
          :label="tab.name"
          :name="tab.type"
        />
        <default-button
          type="outline"
          @click="downloadPlan"
        >
          <svg-icon icon-class="download" />
          {{ $t('schedule.schedule.downloadPlan') }}
        </default-button>
      </el-tabs>
      <div
        v-if="isLoading"
        class="empty-block"
      >
        <spinner />
      </div>
      <pagination-table
        v-else-if="isDataAvailable"
        :is-processing="isProcessing"
        :pagination-info="pagination"
        :column-width="'180'"
        :max-height="'600'"
        :dataset="resultType === 'order' ? jobData : machineData"
        fixed-index
        class="job__table"
        @change-page="updatePage"
      />
    </div>
  </div>
</template>

<script>
import PaginationTable from '@/schedule/components/table/PaginationTable'
import { getOrderPlanResult, getMachinePlanResult, downloadPlanExcel } from '@/schedule/API/Plan'
import i18n from '@/lang/index.js'
import { mapState } from 'vuex'

const completedLabel = i18n.t('schedule.simulation.table.completed')
const uncompletedLabel = i18n.t('schedule.simulation.table.uncompleted')

export default {
  name: 'PlanJob',
  components: {
    PaginationTable
  },
  props: {
    planInfo: {
      type: Object,
      default: () => {}
    },
    restrictions: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isLoading: false,
      isProcessing: false,
      isCollapsed: false,
      resultType: 'order',
      jobData: null,
      machineData: null,
      pagination: {
        currentPage: 0,
        totalPage: 0
      },
      tabs: [
        {
          type: 'order',
          name: this.$t('schedule.schedule.jobDeliver')
        },
        {
          type: 'machine',
          name: this.$t('schedule.schedule.jobSchedule')
        }
      ],
      orderTableHeaderList: [
        { title: 'order', name: this.$t('schedule.simulation.orderResult.order'), width: '160' },
        { title: 'job', name: this.$t('schedule.simulation.orderResult.job'), width: '160' },
        { title: 'targetDelivery', name: this.$t('schedule.simulation.orderResult.targetDelivery') },
        { title: 'completeDate', name: this.$t('schedule.simulation.orderResult.completeDate') },
        { title: 'startDate', name: this.$t('schedule.simulation.orderResult.startDate') },
        { title: 'material', name: this.$t('schedule.simulation.orderResult.material'), width: '160' },
        { title: 'product', name: this.$t('schedule.simulation.orderResult.product'), width: '160' },
        { title: 'priority', name: this.$t('schedule.simulation.orderResult.priority') },
        { title: 'quantity', name: this.$t('schedule.simulation.orderResult.quantity'), align: 'right' },
        { title: 'cycleTime', name: this.$t('schedule.simulation.orderResult.cycleTime'), width: '140', align: 'right' },
        { title: 'complete', name: this.$t('schedule.simulation.orderResult.complete') }
      ],
      machineTableHeaderList: [
        { title: 'arriveTime', name: this.$t('schedule.simulation.machineResult.arriveTime'), width: '220' },
        { title: 'checkinTime', name: this.$t('schedule.simulation.machineResult.checkinTime'), width: '220' },
        { title: 'startTime', name: this.$t('schedule.simulation.machineResult.startTime'), width: '220' },
        { title: 'endTime', name: this.$t('schedule.simulation.machineResult.endTime'), width: '220' },
        { title: 'checkoutTime', name: this.$t('schedule.simulation.machineResult.checkoutTime'), width: '220' },
        { title: 'equipment', name: this.$t('schedule.simulation.machineResult.equipment') },
        { title: 'factorySite', name: this.$t('schedule.simulation.machineResult.factorySite') },
        { title: 'job', name: this.$t('schedule.simulation.machineResult.job'), width: '160' },
        { title: 'material', name: this.$t('schedule.simulation.machineResult.material'), width: '160' },
        { title: 'operation', name: this.$t('schedule.simulation.machineResult.operation') },
        { title: 'order', name: this.$t('schedule.simulation.machineResult.order'), width: '160' },
        { title: 'product', name: this.$t('schedule.simulation.machineResult.product'), width: '160' },
        { title: 'stage', name: this.$t('schedule.simulation.machineResult.stage') },
        { title: 'task', name: this.$t('schedule.simulation.machineResult.task') }
      ],
      priortyOptions: [
        { value: 1, label: this.$t('schedule.simulation.table.highPriority') },
        { value: 2, label: this.$t('schedule.simulation.table.secondPriority') },
        { value: 3, label: this.$t('schedule.simulation.table.lowPriority') }
      ]
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    isDataAvailable () {
      return (this.resultType === 'order' && this.jobData) || (this.resultType === 'machine' && this.machineData)
    }
  },
  watch: {
    restrictions () {
      this.fetchData(0, 20, true)
    }
  },
  mounted () {
    this.isLoading = true
    this.fetchData(0, 20, true)
  },
  methods: {
    fetchData (page = 0, size = 20, resetPagination = false) {
      if (this.resultType === 'order') return this.fetchOrderPlanResult(page, size, resetPagination)
      if (this.resultType === 'machine') return this.fetchMachinePlanResult(page, size, resetPagination)
    },
    fetchOrderPlanResult (page = 0, size = 20, resetPagination = false) {
      this.isProcessing = true
      if (resetPagination) this.isLoading = true
      getOrderPlanResult({
        projectId: this.scheduleProjectId,
        page,
        size,
        ...this.restrictions
      })
        .then(res => {
          if (resetPagination) this.pagination = res.pagination
          if (!res.data) return
          this.jobData = {
            columns: { titles: this.orderTableHeaderList },
            data: res.data.map(data => {
              return {
                ...data,
                priority: this.priortyOptions[data.priority - 1].label,
                complete: data.withinScheduleTime ? completedLabel : uncompletedLabel,
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
    fetchMachinePlanResult (page = 0, size = 20, resetPagination = false) {
      this.isProcessing = true
      if (resetPagination) this.isLoading = true
      getMachinePlanResult({
        projectId: this.scheduleProjectId,
        page,
        size,
        ...this.restrictions
      })
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
    switchTab (type) {
      if (this.resultType === type) return
      this.isLoading = true
      this.resultType = type
      this.fetchData(0, 20, true)
    },
    updatePage (page) {
      this.fetchData(page - 1, 20, false)
    },
    downloadPlan () {
      this.isDownloading = true
      downloadPlanExcel({ projectId: this.scheduleProjectId, solutionId: this.planInfo.selectedSolutionId })
        .then(({ data }) => {
          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, 'PlanResult.xlsx')
          } else {
            const link = document.createElement('a')
            if (link.download !== undefined) {
              // Browsers that support HTML5 download attribute
              const url = URL.createObjectURL(blob)
              link.setAttribute('href', url)
              link.setAttribute('download', 'PlanResult.xlsx')
              link.style.visibility = 'hidden'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              URL.revokeObjectURL(url)
            }
          }
        })
        .catch(() => {})
        .finally(() => this.isDownloading = false)
    }
  }
}
</script>

<style lang="scss" scoped>
.job {
  margin-bottom: 24px;

  &.is-collapsed {
    .job__content {
      max-height: 0;
      opacity: 0;
    }

    .icon {
      transform: rotate(180deg);
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    padding: 0 0 0 14px;
    position: relative;
  }

  &__content {
    max-height: 2000px; // 這邊設定這麼高，只是為了一定要給一個值 transition 才有效果
    opacity: 1;
    overflow: hidden;
    transition: opacity 0.2s ease, max-height 0.3s ease;
  }

  &__title {
    font-size: 18px;
    line-height: 22px;
    margin: 0;

    &::before {
      background: #2ad2e2;
      content: '';
      height: 6px;
      left: 0%;
      position: absolute;
      top: 37.5%;
      width: 6px;
    }
  }

  &__tabs {
    display: flex;
    margin-bottom: 8px;

    ::v-deep .el-tabs__header {
      flex: 1;
    }
  }

  &__table {
    ::v-deep .sy-table.el-table {
      border: 1px solid #555858;

      th,
      td {
        border-bottom: 1px solid #555858;
        border-right: 1px solid #555858;
      }
    }

    ::v-deep .el-input--small .el-input__inner {
      background-color: transparent;
      border: none;
    }
  }

  .empty-block {
    align-items: center;
    background: var(--color-bg-gray);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    height: 249px;
    justify-content: center;
  }

  .collapse-controller {
    cursor: pointer;
    font-size: 14px;

    .icon {
      transition: transform 0.3s ease;
    }
  }
}
</style>
