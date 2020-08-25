<template>
  <div
    class="unscheduled-jobs-table"
  >
    <div class="header">
      <h3 class="header__title">
        {{ $t('schedule.simulation.scheduledJobs') }}
      </h3>
      <div class="header__search">
        <default-input
          v-model="searchJobNumber"
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
        @click="updateJobData"
      >
        {{ $t('schedule.button.sent') }}
      </default-button>
      <div class="header__button">
        <default-button
          class="add-btn"
          type="outline"
          @click="removeItem"
        >
          <i class="el-icon-minus" />
          {{ $t('schedule.simulation.removeSelectedJobs') }}
        </default-button>
      </div>
    </div>
    <job-selection-pagination-table
      v-if="scheduledJobs.length > 0"
      :dataset="pageFilterJobData"
      :layout="'scheduled'"
      :pagination-info="pagination"
      fixed-index
      selection
      @change-check="updateSelectedData"
      @change-page="updatePage"
    />
    <div
      v-else
      class="empty-dialog"
    >
      <img
        class="empty-dialog__icon"
        src="@/schedule/icons/empty.svg"
      >
      <span class="empty-dialog__text"> {{ $t('schedule.simulation.table.notChosenJobs') }} </span>
    </div>
  </div>
</template>

<script>
import JobSelectionPaginationTable from '@/schedule/components/table/JobSelectionPaginationTable'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ScheduledJobsTable',
  components: {
    JobSelectionPaginationTable
  },
  data () {
    return {
      isLoading: false,
      searchJobNumber: null,
      selectedData: [],
      filterJobData: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemPerPage: 20
      },
      sliceInfo: {
        start: 0,
        end: 0
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
    ...mapState('simulation', ['scheduledJobs']),
    jobData () {
      this.scheduledJobs.forEach(job => {
        if (this.selectedData.find(data => data.id === job.id) === undefined) { job.isChecked = false }
      })
      return this.scheduledJobs || []
    },
    pageFilterJobData () {
      const sliceDate = this.filterJobData.slice(this.sliceInfo.start, this.sliceInfo.end) || []
      return ({
        columns: { titles: this.jobTableHeaderList },
        data: sliceDate,
        index: [...Array(sliceDate ? sliceDate.length : [])].map((x, i) => i)
      })
    }
  },
  watch: {
    jobData: {
      handler () {
        this.updateJobData()
      },
      immediate: true
    }
  },
  mounted () {
    this.updatePage(1)
  },
  methods: {
    ...mapMutations('simulation', ['updateScheduledJobs']),
    updateJobData () {
      // For fuzzy search
      this.filterJobData = this.searchJobNumber
        ? this.jobData.filter(data => data.job.toLowerCase().split(this.searchJobNumber.toLowerCase()).length > 1) || []
        : this.jobData

      this.pagination.totalItems = this.filterJobData.length
      this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemPerPage)
      this.handlePagination()
    },
    removeItem () {
      if (this.selectedData.length === 0) return
      const tmpScheduledJobs = JSON.parse(JSON.stringify(this.scheduledJobs))
      this.selectedData.forEach(data => {
        data.isChecked = false
        data.isScheduled = false
        const index = tmpScheduledJobs.findIndex(job => job.id === data.id)
        if (index !== -1) {
          tmpScheduledJobs.splice(index, 1)
        }
      })
      this.updateScheduledJobs(tmpScheduledJobs)
      this.selectedData = []
      this.handlePagination()
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
      this.sliceInfo.start = (page - 1) * this.pagination.itemPerPage
      this.sliceInfo.end = page * this.pagination.itemPerPage
    },
    handlePagination () {
      const filterJobDataLength = this.filterJobData.length
      if (filterJobDataLength === 0) return
      if (filterJobDataLength <= this.pagination.currentPage * this.pagination.itemPerPage) {
        this.pagination.currentPage = this.pagination.totalPages - 1
        this.updatePage(this.pagination.totalPages)
      }
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

    &__icon {
      margin-bottom: 16px;
    }

    &__text {
      font-size: 16px;
      line-height: 20px;
      color: var(--color-text-gray);
    }
  }

  /deep/ .el-select > .el-input {
    .el-input__inner {
      height: 22px;
      line-height: 22px;
    }
    .el-input__icon {
      line-height: 22px;
    }
  }
}

</style>
