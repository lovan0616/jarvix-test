<template>
  <div class="job-table">
    <div
      v-if="isLoading"
      class="empty-dialog"
    >
      <spinner />
    </div>
    <el-table
      v-else
      ref="multipleTable"
      :data="renderedJobData"
      :empty-text="$t('schedule.base.noData')"
      :row-key="getRowKey"
      class="ss-table"
      style="width: 100%;"
      cell-class-name="schedule-table-cell"
    >
      <el-table-column
        :width="indexColumnWidth"
        type="index"
        align="center"
      >
        <template slot="header">
          <slot name="index-header" />
        </template>
      </el-table-column>
      <el-table-column
        v-for="(col, index) in jobTableHeaderList"
        :key="index"
        :prop="col.title"
        :label="col.name"
        :width="col.width"
        :align="col.align"
      >
        <template #default="scope">
          <stateful-job-id
            v-if="col.title === 'job'"
            :job-info="scope.row"
          />
          <template v-else>
            {{ scope.row[col.title] }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('schedule.simulation.table.priority')"
        width="120"
      >
        <template slot-scope="prorityColumn">
          <el-select
            v-model="renderedJobData[prorityColumn.$index].priority"
            @change="onPriorityChanged(renderedJobData[prorityColumn.$index])"
          >
            <el-option
              v-for="item in priortyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <job-check-column
        :is-show-check-all-page-checkbox="isShowCheckAllPageCheckbox"
        :check-all-page="checkAllPage"
        @toggle-check-all-page="toggleCheckAllPages"
      >
        <input
          v-model="checkAll"
          type="checkbox"
        >
      </job-check-column>
    </el-table>
    <el-pagination
      v-if="pagination.totalItems > 0"
      :total="pagination.totalItems"
      :page-size="pagination.itemPerPage"
      :current-page="pagination.currentPage + 1"
      :page-sizes="[20, 50, 100, 200]"
      :disabled="isLoading"
      class="ss-pagination"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changeSize"
      @current-change="changePage"
    />
  </div>
</template>

<script>
import StatefulJobId from './StatefulJobId.vue'
import JobCheckColumn from './JobCheckColumn'
import { getJobList } from '@/schedule/API/Job'
import { mapState } from 'vuex'

export default {
  name: 'JobsTable',
  components: {
    StatefulJobId,
    JobCheckColumn
  },
  props: {
    restrictions: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isLoading: false,
      renderedJobData: [],
      selectedData: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemPerPage: 20
      },
      checkAllPage: false
    }
  },
  computed: {
    ...mapState('simulation', ['scheduledJobs', 'simulationJobs']),
    ...mapState('scheduleSetting', ['scheduleProjectId', 'globalJobStatusRestriction']),
    jobTableHeaderList () {
      return [
        { title: 'job', name: this.$t('schedule.simulation.table.job'), width: '' },
        { title: 'order', name: this.$t('schedule.simulation.table.order'), width: '' },
        { title: 'product', name: this.$t('schedule.simulation.table.product'), width: '' },
        { title: 'deadline', name: this.$t('schedule.simulation.table.deadline'), width: '120' },
        { title: 'quantity', name: this.$t('schedule.simulation.table.quantity'), width: '120', align: 'right' }
      ]
    },
    checkAll: {
      get () {
        return this.renderedJobData.every(item => item.frontendInfo.checked)
      },
      set (checked) {
        this.renderedJobData.forEach(item => item.frontendInfo.checked = checked)
        this.$store.commit('simulation/setSimulationJobs', this.renderedJobData)
        this.$store.commit('simulation/setShouldRecalculateSelectedJobs', true)
      }
    },
    isShowCheckAllPageCheckbox () {
      return this.pagination.totalItems === 0 || this.pagination.totalItems > this.pagination.itemPerPage
    },
    priortyOptions () {
      return [
        { value: 1, label: this.$t('schedule.simulation.table.highPriority') },
        { value: 2, label: this.$t('schedule.simulation.table.secondPriority') },
        { value: 3, label: this.$t('schedule.simulation.table.lowPriority') }
      ]
    },
    indexColumnWidth () {
      if (this.renderedJobData.length > 100) {
        return 48
      }
      return 40
    }
  },
  watch: {
    restrictions () {
      this.fetchJobData(0, this.pagination.itemPerPage)
    }
  },
  mounted () {
    this.isLoading = true
    this.fetchJobData(0, this.pagination.itemPerPage)
  },
  methods: {
    fetchJobData (page = 0, size = this.pagination.itemPerPage) {
      this.isLoading = true
      getJobList({ page, size, projectId: this.scheduleProjectId, ...this.restrictions })
        .then(({ data, pagination }) => {
          this.pagination = pagination
          this.renderedJobData = data.map(job => {
            const storedJob = this.simulationJobs[job.id]
            return {
              ...job,
              priority: storedJob ? storedJob.priority : job.priority,
              frontendInfo: {
                checked: storedJob ? storedJob.frontendInfo.checked : job.scheduled
              }
            }
          })
          this.$store.commit('simulation/setSimulationJobs', this.renderedJobData.filter(item => item.frontendInfo.checked))
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false
        })
    },
    toggleCheckAllPages (checked) {
      this.checkAllPage = checked
      // 將當頁的 job 狀態更新
      this.renderedJobData.forEach(item => item.frontendInfo.checked = checked)

      if (checked) {
        getJobList({ fetchAll: true, projectId: this.scheduleProjectId, ...this.restrictions })
          .then(data => {
            const allJobs = data.map(job => ({
              ...job,
              frontendInfo: { checked: true }
            }))
            this.$store.commit('simulation/setSimulationJobs', allJobs)
            this.$store.commit('simulation/setShouldRecalculateSelectedJobs', true)
          })
      } else {
        this.$store.commit('simulation/toggleSimulationJobs', Object.values(this.simulationJobs), checked)
        this.$store.commit('simulation/setShouldRecalculateSelectedJobs', true)
      }
    },
    changeSize (size) {
      this.fetchJobData(0, size)
    },
    changePage (page) {
      if (this.isLoading) return
      this.fetchJobData(page - 1, this.pagination.itemPerPage)
    },
    onPriorityChanged (job) {
      job.frontendInfo.checked = true
      this.$store.commit('simulation/setSimulationJobs', [job])
      this.$store.commit('simulation/setShouldRecalculateSelectedJobs', true)
    },
    getRowKey (row) {
      return row.id
    }
  }
}
</script>

<style lang="scss" scoped>
.job-table {
  flex: 1;
  display: flex;
  flex-direction: column;

  ::v-deep .spinner-block {
    padding: 0;
  }

  ::v-deep .el-input--small .el-input__inner {
    border: none;
    background-color: transparent;
  }

  ::v-deep .el-select .el-input .el-select__caret {
    font-weight: bold;
    color: var(--color-white);
  }

  ::v-deep .el-checkbox__inner {
    background-color: transparent;
  }

  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: var(--color-theme);
  }

  ::v-deep .el-select > .el-input {
    .el-input__inner {
      height: 22px;
      line-height: 22px;
      background-color: transparent;
      border: none;
      color: #DDDDDD;
      padding: 0;
    }
    .el-input__icon {
      line-height: 22px;
    }
  }

  ::v-deep .ss-table {
    flex: 1;
    .el-table-column--selection .cell {
      padding-left: 10px;
    }
  }
  .empty-dialog {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 249px;
    border-radius: 8px;

    &__text {
      font-size: 16px;
      line-height: 20px;
      color: var(--color-text-gray);
    }
  }
}
</style>
