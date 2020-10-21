<template>
  <div
    class="plan-job job"
  >
    <div
      class="job__header"
    >
      <h3 class="job__title">
        {{ $t('schedule.schedule.jobInfo') }}
      </h3>
    </div>
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
    </el-tabs>
    <div
      v-if="isLoading"
      class="empty-block"
    >
      <spinner />
    </div>
    <pagination-table
      v-if="isDataAvailable"
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
</template>

<script>
import PaginationTable from '@/schedule/components/table/PaginationTable'
import { getOrderPlanResult, getMachinePlanResult } from '@/schedule/API/Plan'
import i18n from '@/lang/index.js'

const completedLabel = i18n.t('schedule.simulation.table.completed')
const uncompletedLabel = i18n.t('schedule.simulation.table.uncompleted')

export default {
  name: 'PlanJob',
  components: {
    PaginationTable
  },
  data () {
    return {
      isLoading: false,
      isProcessing: false,
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
          name: this.$t('schedule.schedule.jobSchedule')
        },
        {
          type: 'machine',
          name: this.$t('schedule.schedule.jobDeliver')
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
        { title: 'quantity', name: this.$t('schedule.simulation.orderResult.quantity') },
        { title: 'cycleTime', name: this.$t('schedule.simulation.orderResult.cycleTime') },
        { title: 'complete', name: this.$t('schedule.simulation.orderResult.complete') }
      ],
      machineTableHeaderList: [
        { title: 'arriveTime', name: this.$t('schedule.simulation.machineResult.arriveTime'), width: '220' },
        { title: 'checkinTime', name: this.$t('schedule.simulation.machineResult.checkinTime'), width: '220' },
        { title: 'checkoutTime', name: this.$t('schedule.simulation.machineResult.checkoutTime'), width: '220' },
        { title: 'endTime', name: this.$t('schedule.simulation.machineResult.endTime'), width: '220' },
        { title: 'equipment', name: this.$t('schedule.simulation.machineResult.equipment') },
        { title: 'factorySite', name: this.$t('schedule.simulation.machineResult.factorySite') },
        { title: 'job', name: this.$t('schedule.simulation.machineResult.job'), width: '160' },
        { title: 'material', name: this.$t('schedule.simulation.machineResult.material'), width: '160' },
        { title: 'operation', name: this.$t('schedule.simulation.machineResult.operation') },
        { title: 'order', name: this.$t('schedule.simulation.machineResult.order'), width: '160' },
        { title: 'product', name: this.$t('schedule.simulation.machineResult.product'), width: '160' },
        { title: 'stage', name: this.$t('schedule.simulation.machineResult.stage') },
        { title: 'startTime', name: this.$t('schedule.simulation.machineResult.startTime'), width: '220' },
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
    isDataAvailable () {
      return (this.resultType === 'order' && this.jobData) || (this.resultType === 'machine' && this.machineData)
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
      getOrderPlanResult(page, size)
        .then(res => {
          if (resetPagination) this.pagination = res.pagination
          if (!res.data) return
          this.jobData = {
            columns: { titles: this.orderTableHeaderList },
            data: res.data.map(data => {
              return {
                ...data,
                priority: this.priortyOptions[data.priority - 1].label,
                complete: data.complete ? completedLabel : uncompletedLabel
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
      getMachinePlanResult(page, size)
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
      this.isLoading = false
      this.isProcessing = false
      this.resultType = type
      this.fetchData(0, 20, true)
    },
    updatePage (page) {
      this.fetchData(page - 1, 20, false)
    }
  }
}
</script>

<style lang="scss" scoped>
.job {
  margin-bottom: 24px;

  &__header {
    position: relative;
    padding: 0 14px;
    margin-bottom: 12px;
  }

  &__title {
    font-size: 18px;
    line-height: 22px;
    margin: 0 30px 0 0;

    &::before {
      content: "";
      position: absolute;
      left: 0%;
      top: 37.5%;
      width: 6px;
      height: 6px;
      background: #2AD2E2;
    }
  }

  &__tabs {
    margin-bottom: 8px;
  }

  &__table {

    /deep/ .sy-table.el-table {
      border: 1px solid #555858;
      th, td {
        border-bottom: 1px solid #555858;
        border-right: 1px solid #555858;
      }
    }

    /deep/ .el-input--small .el-input__inner {
      border: none;
      background-color: transparent;
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
  }
}
</style>
