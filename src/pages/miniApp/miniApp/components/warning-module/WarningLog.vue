<template>
  <div class="warning-log">
    <nav class="warning-log__nav">
      {{ $t('miniApp.warningLogs') }}
    </nav>
    <div class="warning-log__content">
      <spinner 
        v-if="isLoading" 
        :title="$t('button.download')" 
        size="50"/>
      <el-table
        v-else
        :data="warningLogs"
        class="sy-table"
        style="width: 100%">
        <div slot="empty">{{ $t('miniApp.emptyLogs') }}</div>
        <el-table-column
          :label="$t('miniApp.warningLogCreateTime')"
          prop="createDate"
          width="220">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate | convertTimeStamp }}</span>
          </template>  
        </el-table-column>
        <el-table-column
          :label="$t('miniApp.warningLogMessage')"
          prop="conditionMetMessage"/>
        <el-table-column
          :label="$t('miniApp.goToDashboard')"
          prop="relatedDashboardId"
          width="120">
          <template slot-scope="scope">
            <a 
              class="link" 
              @click.stop="goToCertainDashboard(scope.row.relatedDashboardId, scope.row.monitoredData)">
              {{ $t('miniApp.link') }}
            </a>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('miniApp.updateState')"
          prop="active"
          width="120">
          <template slot-scope="scope">
            <button
              v-if="scope.row.active"
              :disabled="isProcessing"
              type="button"
              class="btn-m btn-default button-container__button"
              @click="updateLogActiveness(scope.row.conditionMetLogId, true)"
            >{{ $t('miniApp.markAsFinished') }}</button>
            <button
              v-else
              :disabled="isProcessing"
              type="button"
              class="btn-m btn-secondary button-container__button"
              @click="updateLogActiveness(scope.row.conditionMetLogId, false)"
            >{{ $t('miniApp.markAsUnfinished') }}</button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="paginationInfo.totalPages > 1"
        :total="paginationInfo.totalItems"
        :page-size="paginationInfo.itemPerPage"
        :current-page="paginationInfo.currentPage + 1"
        class="table-pagination"
        layout="prev, pager, next"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { getAlertLogs, patchAlertLogActiveness } from '@/API/Alert'

export default {
  name: 'WarningLog',
  props: {
    setting: {
      type: Object,
      default: () => {}
    },
  },
  data () {
    return {
      isLoading: false,
      warningLogs: [],
      isProcessing: false,
      paginationInfo: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemPerPage: 0
      },
    }
  },
  computed: {
    activeConditionIds () {
      if (!this.setting.conditions) return []
      return this.setting.conditions.filter(item => item.activate).map(item => item.id)
    }
  },
  created () {
    this.activeConditionIds.length > 0 && this.getWarningLogs(this.activeConditionIds)
  },
  methods: {
    getWarningLogs (page = 0) {
      this.isLoading = true
      getAlertLogs({ conditionIds: this.activeConditionIds, page }).then(response => {
        this.paginationInfo = response.pagination
        this.warningLogs = response.data.map(log => {
          const prevSettingCondition = this.setting.conditions.find(item => item.id === log.conditionId)
          return {
            ...log,
            relatedDashboardId: prevSettingCondition ? prevSettingCondition.relatedDashboardId : null
          }
        })
      })
        .catch(() => {})
        .finally(() => this.isLoading = false )
    },
    updateLogActiveness (logId, isActive) {
      this.isProcessing = true
      patchAlertLogActiveness(logId, { "active" : isActive })
        .then(() => this.getWarningLogs(this.activeConditionIds))
        .finally(() => this.isProcessing = false)
    },
    changePage (pageNumber) {
      this.getWarningLogs(pageNumber - 1)
    },
    goToCertainDashboard (relatedDashboardId, rowData) {
      this.$emit('goToCertainDashboard', {
        relatedDashboardId,
        rowData: rowData.filter(item => item.statsType === 'CATEGORY')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.warning-log {
  height: 100%;
  display: flex;
  flex-direction: column;
  &__nav {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    margin-right: 20px;
    font-size: 20px;
  }
  &__content {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 20px 20px 0;
    .warning-log-table {
      flex: 1;
      min-height: 0
    }
    .el-pagination {
      text-align: right;
    }
    &-empty {
      padding-top: 30vh;
      text-align: center;
      color: #A4A4A4;
    }
  }
}
  
</style>