<template>
  <div
    class="unscheduled-jobs-table"
  >
    <div class="header">
      <h3 class="header__title">
        {{ $t('schedule.simulation.unscheduledJobs') }}
      </h3>
      <span class="header__date"> {{ $t('schedule.simulation.jobsDueDate') }} </span>
      <default-date-picker
        v-model="period"
        :clearable="true"
        type="daterange"
        format="yyyy/MM/dd"
        value-format="yyyy/MM/dd"
        class="header__date-picker"
      />
      <div class="header__search">
        <default-input
          v-model="jobSearchNumber"
          :placeholder="$t('schedule.simulation.searchJobs')"
          type="text"
          class="header__search--input"
        >
          <i
            slot="prepend"
            class="el-icon-search header__search--icon"
          />
        </default-input>
      </div>
      <default-button
        class="search-btn"
        type="outline"
        @click="searchJobData"
      >
        {{ $t('schedule.button.sent') }}
      </default-button>
      <div class="header__button">
        <default-button
          class="sync-btn"
          type="outline"
          @click="dataSync"
        >
          {{ $t('schedule.simulation.syncData') }}
        </default-button>
        <default-button
          class="add-btn"
          type="outline"
          @click="addItem"
        >
          <i class="el-icon-plus" />
          {{ $t('schedule.simulation.addSelectedJobs') }}
        </default-button>
      </div>
    </div>
    <div
      v-if="isLoading || !jobData"
      class="empty-dialog"
    >
      <spinner v-if="jobData" />
      <span
        v-else
        class="empty-block__text"
      > {{ $t('schedule.table.noData') }} </span>
    </div>
    <job-selection-pagination-table
      v-if="jobData"
      :dataset="jobData"
      :layout="'unscheduled'"
      :is-processing="isProcessing"
      :pagination-info="pagination"
      fixed-index
      selection
      @change-check="updateSelectedData"
      @change-page="updatePage"
    />
    <data-sync-dialog
      v-if="isShowDataSyncDialog"
      @closeDialog="closeDataSyncDialog"
      @confirmDataSync="confirmDataSync"
      @dataSyncCompletion="dataSyncCompletion"
    />
  </div>
</template>

<script>
import JobSelectionPaginationTable from '@/schedule/components/table/JobSelectionPaginationTable'
import DataSyncDialog from './DataSyncDialog'
import { getOrderList } from '@/schedule/API/Order'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'UnscheduledJobsTable',
  components: {
    JobSelectionPaginationTable,
    DataSyncDialog
  },
  data () {
    return {
      isLoading: false,
      isProcessing: false,
      isShowDataSyncDialog: false,
      jobSearchNumber: null,
      tmpJobData: null,
      jobData: null,
      selectedData: [],
      period: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemPerPage: 20
      },
      jobTableHeaderList: [
        { title: 'job', name: this.$t('schedule.simulation.table.job'), width: '' },
        { title: 'order', name: this.$t('schedule.simulation.table.order'), width: '' },
        { title: 'product', name: this.$t('schedule.simulation.table.product'), width: '202' },
        { title: 'deadline', name: this.$t('schedule.simulation.table.deadline'), width: '120' },
        { title: 'quantity', name: this.$t('schedule.simulation.table.quantity'), width: '120' }
      ]
    }
  },
  computed: {
    ...mapState('simulation', ['scheduledJobs'])
  },
  watch: {
    scheduledJobs: {
      handler () {
        this.updateJobData(this.tmpJobData)
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    this.isLoading = true
    this.fetchJobData(0, this.pagination.itemPerPage, this.jobSearchNumber, true)
  },
  methods: {
    ...mapMutations('simulation', ['updateScheduledJobs']),
    fetchJobData (page = 0, size = 20, jobSearchNumber = null, resetPagination = false) {
      this.isProcessing = true
      getOrderList({
        page,
        size,
        orderNumber: jobSearchNumber,
        startDate: this.period && this.period.length > 0 ? this.period[0] : null,
        endDate: this.period && this.period.length > 0 ? this.period[1] : null
      }).then(res => {
        if (resetPagination) this.pagination = res.pagination
        this.tmpJobData = res.data
        this.updateJobData(res.data)
        this.isLoading = false
        this.isProcessing = false
      }).catch(() => {
        this.isLoading = false
        this.isProcessing = false
      })
    },
    updateJobData (tmpJobData) {
      if (!tmpJobData) return
      this.jobData = {
        columns: { titles: this.jobTableHeaderList },
        data: tmpJobData.map(element => {
          const isScheduled = this.scheduledJobs.some(job => job.id === element.id)
          const isChecked = this.selectedData.some(job => job.id === element.id)
          return {
            ...element,
            priority: element.priority,
            isChecked: isScheduled || isChecked,
            isScheduled: isScheduled
          }
        }) || [],
        index: [...Array(tmpJobData ? tmpJobData.length : [])].map((x, i) => i)
      }
    },
    searchJobData () {
      this.fetchJobData(0, this.pagination.itemPerPage, this.jobSearchNumber, true)
    },
    dataSync () {
      this.isShowDataSyncDialog = true
    },
    addItem () {
      this.selectedData.forEach(data => { data.isScheduled = true })
      this.selectedData = this.selectedData.sort((first, second) => first.id - second.id)
      this.updateScheduledJobs(this.selectedData.concat(this.scheduledJobs))
      this.selectedData = []
    },
    updateSelectedData (checkedRow) {
      const index = this.selectedData.findIndex(job => job.id === checkedRow.id)
      if (index === -1) {
        this.selectedData.push(checkedRow)
      } else {
        this.selectedData.splice(index, 1)
      }
    },
    updatePage (page) {
      this.fetchJobData(page - 1, this.pagination.itemPerPage, this.jobSearchNumber)
    },
    closeDataSyncDialog () {
      this.isShowDataSyncDialog = false
    },
    confirmDataSync () {
      this.isShowDataSyncDialog = false
    },
    dataSyncCompletion () {
      this.closeDataSyncDialog()
      this.updateScheduledJobs([])
      this.selectedData = []
      this.fetchJobData(0, this.pagination.itemPerPage, this.jobSearchNumber, true)
    }
  }
}
</script>

<style lang="scss" scoped>
.unscheduled-jobs-table {

  .header {
    position: relative;
    padding: 0px 14px;
    margin-bottom: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;

    &__title {
      font-size: 20px;
      line-height: 24px;
      margin-right: 16px;
      margin-top: 0;
      margin-bottom: 0;

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

    &__date {
      font-size: 14px;
      line-height: 18px;
      margin-right: 8px
    }

    &__date-picker {
      margin-right: 17px;

      /deep/ .el-date-editor--daterange {
        width: 100%;
        display: flex;
        padding: 3px 0 3px 10px;
      }

      /deep/ .el-range-separator {
        display: inline-block;
      }

      /deep/ .el-range-input {
        width: 80px;

        &:last-of-type {
          margin-left: 5px;
        }
      }

      /deep/ .el-range-separator {
        padding: 0;
      }
    }

    &__search {
      display: flex;
      padding: 0 6px;
      background: rgba(35, 61, 64, 0.6);
      opacity: 0.99;
      border-radius: 6px;
      margin-right: 8px;

      &--input {
        /deep/ .el-input__inner {
          border: 0;
        }
      }

      &--icon {
        margin-right: 4px;
      }
    }

    &__button {
      flex: 1;
      text-align: right;

      .sync-btn {
        margin-right: 12px;
      }
    }
  }

  .empty-dialog {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 249px;
    background: var(--color-bg-gray);
    border-radius: 8px;

    &__text {
      font-size: 16px;
      line-height: 20px;
      color: var(--color-text-gray);
    }
  }
}
</style>
