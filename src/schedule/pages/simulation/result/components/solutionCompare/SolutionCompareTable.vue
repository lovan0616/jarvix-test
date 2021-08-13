<template>
  <div>
    <spinner v-if="isLoading" />
    <template v-else>
      <el-table
        :data="tableData"
        :span-method="spanMethod"
        style="width: 100%"
        class="ss-table"
      >
        <el-table-column>
          <template slot-scope="scope">
            <div class="title">
              <span>{{ scope.row.title }}</span>
              <span>({{ paginationInfo.totalItems }})</span>
              <div
                class="view-more__button"
                @click="$emit('view-more', [isParentOnSchedule, isChildOnSchedule])"
              >
                <svg-icon
                  v-if="!isShowPagination && paginationInfo.totalPages > 1"
                  icon-class="arrow-right"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('schedule.simulation.table.job')"
          prop="jobName"
        />
        <el-table-column
          :label="$t('schedule.solutionCompare.beforeAdjust')"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <svg-icon
              :icon-class="getIconClass(scope.row.isParentOnSchedule)"
              :style="{ color: getIconColor(scope.row.isParentOnSchedule) }"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('schedule.solutionCompare.afterAdjust')"
          width="180"
          align="center"
        >
          <template slot-scope="scope">
            <svg-icon
              :icon-class="getIconClass(scope.row.isChildOnSchedule)"
              :style="{ color: getIconColor(scope.row.isChildOnSchedule) }"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="isShowPagination && paginationInfo.totalPages > 1"
        :total="paginationInfo.totalItems"
        :page-size="paginationInfo.itemPerPage"
        :current-page="paginationInfo.currentPage + 1"
        class="table-pagination"
        layout="prev, pager, next"
        @current-change="changePage"
        @prev-click="prevPage"
        @next-click="nextPage"
      />
    </template>
  </div>
</template>

<script>
import { getSolutionScheduleCompare } from '@/schedule/API/Simulation'

export default {
  name: 'SolutionCompareTable',
  props: {
    parentSolutionId: {
      type: Number,
      default: null,
      required: true
    },
    isParentOnSchedule: {
      type: Boolean,
      default: false
    },
    childSolutionId: {
      type: Number,
      default: null,
      required: true
    },
    isChildOnSchedule: {
      type: Boolean,
      default: false
    },
    isShowPagination: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isLoading: false,
      hasError: false,
      tableData: [],
      paginationInfo: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemPerPage: 0
      }
    }
  },
  computed: {
    getTitle () {
      if (!this.isParentOnSchedule && this.isChildOnSchedule) return this.$t('schedule.solutionCompare.onScheduleAfterAdjust')
      if (this.isParentOnSchedule && !this.isChildOnSchedule) return this.$t('schedule.solutionCompare.onScheduleBeforeAdjust')
      if (!this.isParentOnSchedule && !this.isChildOnSchedule) return this.$t('schedule.solutionCompare.bothWithoutSchedule')
      if (this.isParentOnSchedule && this.isChildOnSchedule) return this.$t('schedule.solutionCompare.bothOnSchedule')
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData (page = 0) {
      this.hasError = false
      this.isLoading = true
      getSolutionScheduleCompare({
        compareeSolutionId: this.parentSolutionId,
        compareeWithinScheduleTime: this.isParentOnSchedule,
        comparerSolutionId: this.childSolutionId,
        comparerWithinScheduleTime: this.isChildOnSchedule,
        size: this.isShowPagination ? 20 : 3,
        page
      })
        .then(({ data, pagination }) => {
          this.tableData = data.map(jobName => ({
            title: this.getTitle,
            jobName,
            isParentOnSchedule: this.isParentOnSchedule,
            isChildOnSchedule: this.isChildOnSchedule
          }))
          this.paginationInfo = pagination
        })
        .catch(() => this.hasError = true)
        .finally(() => this.isLoading = false)
    },
    spanMethod ({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: this.tableData.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    changePage (page) {
      this.fetchData(page - 1)
    },
    nextPage (page) {
      this.fetchData(page - 1)
    },
    prevPage (page) {
      this.fetchData(page - 1)
    },
    getIconClass (isOnSchedule) {
      return isOnSchedule ? 'circle-outline' : 'close'
    },
    getIconColor (isOnSchedule) {
      return isOnSchedule ? '#63DFA6' : '#FF665C'
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  .view-more__button {
    font-size: 20px;
    cursor: pointer;
    margin-left: 6px;
    transform: rotate(-90deg);
  }
}
</style>
