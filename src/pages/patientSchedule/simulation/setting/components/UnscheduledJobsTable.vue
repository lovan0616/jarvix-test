<template>
  <div class="unscheduled-jobs-table">
    <div class="header">
      <h3 class="header__title">
        Unscheduled Surgeories
      </h3>
      <default-date-picker
        v-model="period"
        :clearable="true"
        type="daterange"
        format="yyyy/MM/dd"
        value-format="yyyy/MM/dd"
        class="header__date-picker"
        start-placeholder="Start Date"
        end-placeholder="End Date"
      />
      <div class="header__search">
        <default-input
          v-model="jobSearchNumber"
          placeholder="Search Surgeries"
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
        Send
      </default-button>
      <div 
        class="header__button" 
        @dblclick.once="hasEmergecy = true">
        <el-badge 
          :hidden="!hasEmergecy" 
          is-dot>
          <default-button
            size="m"
            class="sync-btn"
            type="outline"
            @click="dataSync"
          >
            Sync Data
          </default-button>
        </el-badge>
        <default-button
          size="m"
          class="add-btn"
          type="outline"
          @click="addItem"
        >
          <i class="el-icon-plus" />
          Add Surgery
        </default-button>
      </div>
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
    />
  </div>
</template>

<script>
import JobSelectionPaginationTable from '@/schedule/components/table/JobSelectionPaginationTable'
import DataSyncDialog from './DataSyncDialog'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'UnscheduledJobsTable',
  components: {
    JobSelectionPaginationTable,
    DataSyncDialog
  },
  data () {
    return {
      hasEmergecy: false,
      isLoading: false,
      isProcessing: false,
      isShowDataSyncDialog: false,
      jobSearchNumber: null,
      tmpJobData: null,
      jobData: {
        "columns":{
          "titles":[
            { title: 'roomName', name: 'Room Name', width: '160' },
            { title: 'patientId', name: 'Patient Id', width: '160' },
            { title: 'surgeon', name: 'Surgeon', width: '160' },
            { title: 'surgeryTime', name: 'Surgery Time', width: '160' },
            { title: 'surgeryType', name: 'Surgery Type', width: '160' },
            { title: 'assistant', name: 'Assistant', width: '160' },
            { title: 'anesthetist', name: 'Anesthetist', width: '160' },
            { title: 'plannedDate', name: 'Planned Date', width: '160' },
            { title: 'priority', name: 'Priority', width: '160' }
          ]
        },
        "data":[
          {
            id: 'S000001',
            roomName: 'Room_1',
            patientId: 'AC000001',
            surgeon: 'John',
            surgeryTime: '10:00 - 15:00',
            surgeryType: 'CKK2-1234',
            assistant: 'Patrick W.',
            anesthetist: 'H.W.L.',
            plannedDate: '2021/3/1',
            priority: 1,
          },
          {
            id: 'S000002',
            roomName: 'Room_2',
            patientId: 'AC000001',
            surgeon: 'John',
            surgeryTime: '10:00 - 15:00',
            surgeryType: 'CKK2-1234',
            assistant: 'Patrick W.',
            anesthetist: 'H.W.L.',
            plannedDate: '2021/3/1',
            priority: 1,
          },
          {
            id: 'S000003',
            roomName: 'Room_3',
            patientId: 'AC000001',
            surgeon: 'John',
            surgeryTime: '10:00 - 15:00',
            surgeryType: 'CKK2-1234',
            assistant: 'Patrick W.',
            anesthetist: 'H.W.L.',
            plannedDate: '2021/3/1',
            priority: 1,
          },
          {
            id: 'S000004',
            roomName: 'Room_4',
            patientId: 'AC000001',
            surgeon: 'John',
            surgeryTime: '10:00 - 15:00',
            surgeryType: 'CKK2-1234',
            assistant: 'Patrick W.',
            anesthetist: 'H.W.L.',
            plannedDate: '2021/3/1',
            priority: 1,
          }
        ],
        "index":[
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9
        ]
      },
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
  methods: {
    ...mapMutations('simulation', ['updateScheduledJobs']),
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
      if (!this.hasEmergecy) return
      this.jobData.data.unshift(...[
        {
          id: 'S000005',
          roomName: 'Room_A',
          patientId: 'AC000001',
          surgeon: 'John',
          surgeryTime: '10:00 - 15:00',
          surgeryType: 'CKK2-1234',
          assistant: 'Patrick W.',
          anesthetist: 'H.W.L.',
          plannedDate: '2021/3/1',
          priority: 1,
          isChecked: false,
          isScheduled: false
        },
        {
          id: 'S000006',
          roomName: 'Room_B',
          patientId: 'AC000001',
          surgeon: 'John',
          surgeryTime: '10:00 - 15:00',
          surgeryType: 'CKK2-1234',
          assistant: 'Patrick W.',
          anesthetist: 'H.W.L.',
          plannedDate: '2021/3/1',
          priority: 1,
          isChecked: false,
          isScheduled: false
        },
        {
          id: 'S000007',
          roomName: 'Room_C',
          patientId: 'AC000001',
          surgeon: 'John',
          surgeryTime: '10:00 - 15:00',
          surgeryType: 'CKK2-1234',
          assistant: 'Patrick W.',
          anesthetist: 'H.W.L.',
          plannedDate: '2021/3/1',
          priority: 1,
          isChecked: false,
          isScheduled: false
        }
      ])
      this.hasEmergecy = false
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
    closeDataSyncDialog () {
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

/deep/ .el-badge .el-badge__content {
  right: 110%;
}
</style>
