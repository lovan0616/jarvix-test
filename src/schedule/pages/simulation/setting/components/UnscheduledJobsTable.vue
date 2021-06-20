<template>
  <div
    class="unscheduled-jobs-table"
  >
    <div class="header">
      <h3 class="header__title">
        {{ selectAll ? $t('schedule.simulation.scheduledJobs') : $t('schedule.simulation.unscheduledJobs') }}
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
        size="m"
        class="search-btn"
        type="outline"
        @click="searchJobData"
      >
        {{ $t('schedule.button.send') }}
      </default-button>
      <div class="header__button">
        <label class="header__select">
          <div class="checkbox-label">
            <input
              v-model="selectAll"
              :value="true"
              type="checkbox"
            >
            <div class="checkbox-square"/>
          </div>
          <span>{{ selectAll ? $t('schedule.simulation.selectedJobsCount', {count: pagination.totalItems}) : $t('schedule.simulation.selectAll') }}</span>
        </label>
        <default-button
          v-show="!selectAll"
          size="m"
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
      v-if="isLoading"
      class="empty-dialog"
    >
      <spinner v-if="isLoading" />
    </div>
    <job-selection-pagination-table
      v-else-if="jobData"
      :dataset="jobData"
      :layout="'unscheduled'"
      :is-processing="isProcessing"
      :pagination-info="pagination"
      fixed-index
      :selection="!selectAll"
      @change-check="updateSelectedData"
      @change-page="updatePage"
    />
    <div
      v-else
      class="empty-dialog"
    >
      <span
        class="empty-block__text"
      > {{ $t('schedule.base.noData') }} </span>
    </div>
  </div>
</template>

<script>
import JobSelectionPaginationTable from '@/schedule/components/table/JobSelectionPaginationTable'
import { getOrderList } from '@/schedule/API/Order'
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'UnscheduledJobsTable',
  components: {
    JobSelectionPaginationTable,
  },
  data () {
    return {
      isLoading: false,
      isProcessing: false,
      tmpJobData: null,
      jobData: null,
      selectedData: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemPerPage: 20
      }
    }
  },
  computed: {
    ...mapState('simulation', ['scheduledJobs', 'selectAllOrders', 'orderPeriod', 'searchOrderNumber']),
    ...mapState('scheduleSetting', ['scheduleProjectId']),
    ...mapGetters('scheduleSetting', ['isYKSchedule', 'jobTableHeaderList']),
    selectAll: {
      get () {
        return this.selectAllOrders
      },
      set (val) {
        this.setSelectAllOrders(val)
        if (val) {
          this.updateScheduledJobs([])
          this.selectedData = []
        }
      }
    },
    jobSearchNumber: {
      get () {
        return this.searchOrderNumber
      },
      set (val) {
        this.setSearchOrderNumber(val)
      }
    },
    period: {
      get () {
        return this.orderPeriod
      },
      set (val) {
        this.setOrderPeriod(val)
      }
    }
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
    ...mapMutations('simulation', ['updateScheduledJobs', 'setOrderPeriod', 'setSelectAllOrders', 'setSearchOrderNumber', 'setSearchOrderCount']),
    fetchJobData (page = 0, size = 20, jobSearchNumber = null, resetPagination = false) {
      this.isProcessing = true
      getOrderList({
        projectId: this.scheduleProjectId,
        page,
        size,
        orderNumber: jobSearchNumber,
        startDate: this.period && this.period.length > 0 ? this.period[0] : null,
        endDate: this.period && this.period.length > 0 ? this.period[1] : null
      }).then(res => {
        if (resetPagination) this.pagination = res.pagination
        this.setSearchOrderCount(res.pagination.totalItems || 0)
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
  }
}
</script>

<style lang="scss" scoped>
.unscheduled-jobs-table {

  .header {
    position: relative;
    padding: 0 0 0 14px;
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
        width: 90px;

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
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex: 1;
      text-align: right;

      .sync-btn {
        margin-right: 12px;
      }
    }

    &__select {
      display: flex;
      align-items: center;
      width: fit-content;
      font-size: 12px;
      margin-right: 8px;
      cursor: pointer;

      .checkbox-label {
        margin-right: 8px;
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
