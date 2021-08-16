<template>
  <div class="setting setting-version">
    <div class="setting__header">
      <h2 class="header__title">
        {{ $t('schedule.setting.versionManagement') }}
      </h2>
    </div>
    <div class="setting__body">
      <spinner
        v-if="isLoading"
        size="50"
      />
      <el-table
        v-else
        :data="versions"
        class="ss-table"
        style="width: 100%;"
      >
        <el-table-column
          :label="$t('schedule.schedule.dateRange')"
          width="300"
        >
          <template slot-scope="scope">
            {{ scope.row.scheduleStartDate | convertTimeStamp }} ~
            {{ scope.row.scheduleEndDate | convertTimeStamp }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('schedule.schedule.capacity')"
          prop="kpiResultCapacity"
          width="120"
          align="right"
        >
          <template slot-scope="scope">
            {{ formatComma(scope.row.kpiResultCapacity) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('schedule.schedule.ofr')"
          width="100"
          align="right"
        >
          <template slot-scope="scope">
            {{ Number(scope.row.kpiResultOfr * 100).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('schedule.schedule.utilization')"
          width="100"
          align="right"
        >
          <template slot-scope="scope">
            {{ Number(scope.row.kpiResultUtilization * 100).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('schedule.schedule.appliedTime')"
          width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.appliedAt | convertTimeStamp }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('schedule.schedule.applier')"
          prop="appliedBy"
        >
          <template slot-scope="scope">
            {{ scope.row.appliedBy || '-' }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('schedule.base.action')"
          width="90"
        >
          <template slot-scope="scope">
            <a
              class="link"
              @click="downloadPlanExcel(scope.row.selectedSolutionId)"
            >
              {{ $t('schedule.schedule.downloadPlan') }}
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getHistorySolutions, downloadPlanExcel } from '@/schedule/API/Plan'
import { mapState } from 'vuex'

export default {
  name: 'VersionManagement',
  data () {
    return {
      isLoading: true,
      versions: []
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId'])
  },
  mounted () {
    this.fetchVersion()
  },
  methods: {
    fetchVersion () {
      getHistorySolutions(this.scheduleProjectId)
        .then(versions => {
          this.versions = versions
        })
        .catch(() => {})
        .finally(() => this.isLoading = false)
    },
    downloadPlanExcel (solutionId) {
      downloadPlanExcel({ projectId: this.scheduleProjectId, solutionId })
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
        .finally(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
