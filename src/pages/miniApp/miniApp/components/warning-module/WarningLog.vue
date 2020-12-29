<template>
  <div class="warning-log">
    <nav class="warning-log__nav">
      <div class="nav-left">
        {{ $t('alert.alertLogs') }}
      </div>
      <div class="nav-right">
        <span>自動更新</span>
        <el-switch
          v-model="isAutoRefresh"
          active-color="#2AD2E2"
          inactive-color="#324B4E"
          @change="toggleIsAutoRefresh"
        />
        <span>{{ isAutoRefresh ? '開啟' : '關閉' }}</span>
      </div>
    </nav>
    <warning-log-filter
      :filter-setting.sync="filterSetting"
      :state-options="stateOptions"
      @changed="onFilterCriteriaChanged"
    />
    <div class="warning-log__content">
      <el-table
        v-loading="isLoading"
        :data="warningLogs"
        :element-loading-text="$t('button.download')"
        element-loading-background="rgba(15, 20, 20, .8)"
        class="sy-table"
        height="100%"
        style="width: 100%">
        <div slot="empty">{{ $t('alert.emptyLogs') }}</div>
        <el-table-column
          :label="$t('alert.alertLogCreateTime')"
          prop="createDate"
          width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate | convertTimeStamp }}</span>
          </template>  
        </el-table-column>
        <el-table-column
          :label="$t('alert.alertName')"
          prop="conditionName"/>
        <el-table-column
          :label="$t('alert.alertLogMessage')"
          prop="conditionMetMessage"/>
        <el-table-column
          :label="$t('alert.state')"
          prop="active"
          width="120">
          <template slot-scope="scope">
            <custom-dropdown-select
              :data-list="stateOptions"
              :has-bullet-point="false"
              trigger="hover"
              @select="updateLogActiveness(scope.row, $event)"
            >
              <template #display>
                <div 
                  :class="scope.row.active ? 'button--active' : 'button--inactive'" 
                  class="button">
                  <span class="button-label">
                    {{ scope.row.active ? $t('alert.finished') : $t('alert.unfinished') }}
                  </span>
                  <svg-icon 
                    icon-class="triangle" 
                    class="icon-triangle"/>
                </div>
              </template>
            </custom-dropdown-select>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('miniApp.monitorLogUpdateTime')"
          prop="updateDate"
          width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.updateDate | convertTimeStamp }}</span>
          </template>  
        </el-table-column>
        <el-table-column
          :label="$t('miniApp.goToDashboard')"
          prop="relatedDashboardId"
          width="120">
          <template slot-scope="scope">
            <a
              v-if="scope.row.relatedDashboardId"
              class="link" 
              @click.stop="goToCertainDashboard(scope.row.relatedDashboardId, scope.row.monitoredData)">
              {{ $t('miniApp.link') }}
            </a>
            <span 
              v-else 
              class="reminding">{{ $t('miniApp.notBeingSet') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :disabled="isLoading"
        :total="paginationInfo.totalItems"
        :page-size="paginationInfo.itemPerPage"
        :current-page="paginationInfo.currentPage"
        :hide-on-single-page="true"
        class="table-pagination"
        layout="prev, pager, next"
        @current-change="changePage"
      />
    </div>
  </div>
</template>

<script>
import { getAlertLogs, patchAlertLogActiveness } from '@/API/Alert'
import CustomDropdownSelect from '@/components/select/CustomDropdownSelect'
import WarningLogFilter from './WarningLogFilter'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'WarningLog',
  components: {
    CustomDropdownSelect,
    WarningLogFilter
  },
  props: {
    setting: {
      type: Object,
      default: () => {}
    },
  },
  data () {
    return {
      isLoading: false,
      isProcessing: false,
      isAutoRefresh: false, // log 頁面預設不開啟自動更新，以免使用者在閱讀 log 時畫面刷新
      warningLogs: [],
      autoRefreshFunction: null,
      paginationInfo: {
        currentPage: 0,
        totalPages: 0,
        totalItems: 0,
        itemPerPage: 0
      },
      filterSetting: {
        activenessValue: null, // active, inactive, null
        createdTimeRangeValue: []
      }
    }    
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    stateOptions () {
      return [
        {
          name: this.$t('alert.finished'),
          value: 'active',
          id: true,
        },
        {
          name: this.$t('alert.unfinished'),
          value: 'inactive',
          id: false,
        }
      ]
    },
    activeConditionIds () {
      if (!this.setting.conditions) return []
      return this.setting.conditions.filter(item => item.activate).map(item => item.id)
    },
    timeFilterSelected () {
      return this.filterSetting.createdTimeRangeValue.length === 2
    }
  },
  created () {
    if (this.activeConditionIds.length > 0) this.getWarningLogs()
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed () {
    this.clearAutoRefreshTimer()
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    toggleIsAutoRefresh (isAutoRefresh) {
      this.clearAutoRefreshTimer()
      if (isAutoRefresh) {
        this.getWarningLogs()
        this.setLogRefresh()
      }
    },
    setLogRefresh () {
      // this.autoRefreshFunction = window.setInterval(this.getWarningLogs, this.convertRefreshFrequency(this.setting.updateFrequency))
      this.autoRefreshFunction = window.setInterval(this.getWarningLogs, 10000)
    },
    getWarningLogs (page = 0) {
      this.isLoading = true
      getAlertLogs({
        conditionIds: this.activeConditionIds,
        page,
        groupId: this.getCurrentGroupId,
        ...(this.filterSetting.activenessValue !== null && {active: this.filterSetting.activenessValue === 'active'}),
        ...(this.timeFilterSelected && {
          // 資料庫 log 時間均為 UTC+0, 前端使用 convertTimeStamp 轉換後會變為 UTC+8
          // 這邊送進 time filter 需再調整為 UTC+0
          startTime: moment(new Date(this.filterSetting.createdTimeRangeValue[0])),
          endTime: moment(new Date(this.filterSetting.createdTimeRangeValue[1]))
        }),
      }).then(response => {
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
        .finally(() => this.isLoading = false)
    },
    updateLogActiveness (logData, isActive) {
      if (logData.active === isActive) return
      patchAlertLogActiveness(logData.conditionMetLogId, { "active" : isActive })
        .then(() => logData.active = !logData.active) 
        .catch(() => {})
    },
    changePage (pageNumber) {
      this.getWarningLogs(pageNumber - 1)
    },
    goToCertainDashboard (relatedDashboardId, rowData) {
      this.$emit('goToCertainDashboard', {
        relatedDashboardId,
        rowData: rowData.filter(item => item.statsType === 'CATEGORY')
      })
    },
    onFilterCriteriaChanged () {
      this.clearAutoRefreshTimer()
      this.getWarningLogs()
      if (this.isAutoRefresh) this.setLogRefresh()
    },
    convertRefreshFrequency (cronTab) {
      switch (cronTab) {
        case '* * * * *':
          return 60 * 1000
        case '*/5 * * * *':
          return 5 * 60 * 1000
        case '*/15 * * * *':
          return 15 * 60 * 1000
        case '*/30 * * * *':
          return 30 * 60 * 1000
        default:
          return 60 * 1000
      }
    },
    clearAutoRefreshTimer () {
      window.clearInterval(this.autoRefreshFunction)
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
    .nav-right {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 1;
      .el-switch {
        margin: 0 12px;
      }
    }
  }
  &__content {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 20px 20px 0;
    .reminding {
      color: #999;
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

  /deep/ .dropdown {
    &__list-container {
      left: -40%;
      top: 115%;
      text-align: left;
      z-index: 1;
      width: 136px;

      &::before {
        position: absolute;
        content: "";
        bottom: 100%;
        left: 0;
        width: 100%;
        background-color: transparent;
        height: 12px;
      }

      &::after {
        position: absolute;
        content: "";
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-bottom: 8px solid #2B3839;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
      }
    }
    &__link {
      line-height: 39px;
      font-weight: 600;
      font-size: 14px;
    }
    .icon-triangle {
      transform: rotate(180deg);
      font-size: 8px;
    }
    .button {
      cursor: pointer;
      padding: 0 8px;
      border-radius: 5px;
      font-weight: 600;
      font-size: 12px;
      display: inline-block;
      &--inactive {
        background: #FF5C46;
        color: #2E2E2E;
      }
      &--active {
        background: rgba(255, 255, 255, 0.2);
        color: #DDDDDD;
      }
    }
  }

  /deep/ .el-table {
    /deep/.cell {
      overflow: unset;
    }
    &__body-wrapper {
      // overflow: unset;
    }
  }
}
  
</style>