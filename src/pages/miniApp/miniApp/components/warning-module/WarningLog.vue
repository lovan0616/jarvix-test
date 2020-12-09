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
          :label="$t('miniApp.goToDashborad')"
          prop="relatedDashboardId"
          width="120">
          <template slot-scope="scope">
            <a 
              class="link" 
              @click.stop="$emit('goToCertainDashboard', scope.row.relatedDashboardId)">
              {{ $t('miniApp.link') }}
            </a>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getAlertLogs } from '@/API/Alert'

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
      warningLogs: []
    }
  },
  created () {
    const activeConditionIds = this.setting.conditions.filter(item => item.activate).map(item => item.id )
    if (activeConditionIds.length > 0) {
      this.getWarningLogs(activeConditionIds)
    }
  },
  methods: {
    getWarningLogs (activeConditionIds) {
      this.isLoading = true
      getAlertLogs({ conditionIds: activeConditionIds }).then(response => {
        response.data.forEach(log => {
          const prevSettingCondition = this.setting.conditions.find(item => item.id === log.conditionId)
          this.warningLogs.push({
            ...log,
            relatedDashboardId: prevSettingCondition ? prevSettingCondition.relatedDashboardId : null
          })
        })
      })
        .catch(() => {})
        .finally(() => this.isLoading = false )
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
    padding: 0 20px 20px 0;
    &-empty {
      padding-top: 30vh;
      text-align: center;
      color: #A4A4A4;
    }
  }
}
  
</style>