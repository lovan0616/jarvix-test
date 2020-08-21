<template>
  <div
    :class="{'job--open': isCollapseOpen}"
    class="plan-job job"
  >
    <div
      class="job__header"
      @click="isCollapseOpen = !isCollapseOpen"
    >
      <h3 class="job__title">
        {{ $t('schedule.schedule.jobInfo') }}
      </h3>
      <div
        :class="{'job__collapse--close': !isCollapseOpen}"
        class="job__collapse"
      >
        {{ collapseText }}
      </div>
    </div>
    <el-tabs
      :value="resultType"
      :class="{'job__tabs--close': !isCollapseOpen}"
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
      :height="'200'"
      :dataset="resultType === 'order' ? jobData : machineData"
      :class="{'job__table--close': !isCollapseOpen}"
      class="job__table"
      @change-page="updatePage"
    />
  </div>
</template>

<script>
import PaginationTable from '@/schedule/components/table/PaginationTable'
import { getOrderPlanResult, getMachinePlanResult } from '@/schedule/API/Plan'

export default {
  name: 'PlanJob',
  components: {
    PaginationTable
  },
  data () {
    return {
      isCollapseOpen: true,
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
        { title: 'orderId', name: this.$t('schedule.simulation.orderResult.orderId') },
        { title: 'order', name: this.$t('schedule.simulation.orderResult.order') },
        { title: 'job', name: this.$t('schedule.simulation.orderResult.job') },
        { title: 'targetDelivery', name: this.$t('schedule.simulation.orderResult.targetDelivery') },
        { title: 'completeDate', name: this.$t('schedule.simulation.orderResult.completeDate') },
        { title: 'startDate', name: this.$t('schedule.simulation.orderResult.startDate') },
        { title: 'material', name: this.$t('schedule.simulation.orderResult.material') },
        { title: 'product', name: this.$t('schedule.simulation.orderResult.product') },
        { title: 'priority', name: this.$t('schedule.simulation.orderResult.priority') },
        { title: 'quantity', name: this.$t('schedule.simulation.orderResult.quantity') },
        { title: 'cycleTime', name: this.$t('schedule.simulation.orderResult.cycleTime') },
        { title: 'complete', name: this.$t('schedule.simulation.orderResult.complete') }
      ],
      machineTableHeaderList: [
        { title: 'arriveTime', name: this.$t('schedule.simulation.machineResult.arriveTime') },
        { title: 'checkinTime', name: this.$t('schedule.simulation.machineResult.checkinTime') },
        { title: 'checkoutTime', name: this.$t('schedule.simulation.machineResult.checkoutTime') },
        { title: 'endTime', name: this.$t('schedule.simulation.machineResult.endTime') },
        { title: 'equipment', name: this.$t('schedule.simulation.machineResult.equipment') },
        { title: 'factorySite', name: this.$t('schedule.simulation.machineResult.factorySite') },
        { title: 'job', name: this.$t('schedule.simulation.machineResult.job') },
        { title: 'material', name: this.$t('schedule.simulation.machineResult.material') },
        { title: 'operation', name: this.$t('schedule.simulation.machineResult.operation') },
        { title: 'order', name: this.$t('schedule.simulation.machineResult.order') },
        { title: 'product', name: this.$t('schedule.simulation.machineResult.product') },
        { title: 'stage', name: this.$t('schedule.simulation.machineResult.stage') },
        { title: 'startTime', name: this.$t('schedule.simulation.machineResult.startTime') },
        { title: 'task', name: this.$t('schedule.simulation.machineResult.task') }
      ]
    }
  },
  computed: {
    collapseText () {
      return this.isCollapseOpen ? this.$t('schedule.schedule.close') : this.$t('schedule.schedule.open')
    },
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
                complete: data.complete ? this.$t('schedule.simulation.table.completed') : this.$t('schedule.simulation.table.uncompleted')
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
  margin-bottom: 12px;

  &--open {
    height: 300px;
    margin-bottom: 24px;
  }

  &__header {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 14px;
    margin-bottom: 12px;
    cursor: pointer;
  }

  &__title {
    font-size: 18px;
    line-height: 22px;
    margin-right: 30px;

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

  &__collapse {
    position: relative;
    font-size: 14px;
    line-height: 18px;

    &::after {
      content: "";
      position: absolute;
      right: -14px;
      top: 5px;
      width: 6px;
      height: 6px;
      border-right: 2px solid var(--color-white);
      border-bottom: 2px solid var(--color-white);
      transform: rotate(45deg)
    }

    &--close {
      &::after{
        transform: rotate(-45deg)
      }
    }
  }

  &__tabs {
    margin-bottom: 8px;

    &--close {
      display: none;
    }
  }

  &__table {
    height: 215px;

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

    &--close {
      display: none;
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
