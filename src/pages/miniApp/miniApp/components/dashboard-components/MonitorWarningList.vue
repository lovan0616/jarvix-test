<template>
  <ul class="list">
    <spinner 
      v-if="isLoading"
      class="list__spinner"
      size="50"
    />
    <template v-else-if="warningLogs.length > 0">
      <li
        v-for="(log, index) in warningLogs"
        :key="index"
        :class="log.relatedDashboardId ? 'is-linkable' : ''"
        class="list__item"
        @click="log.relatedDashboardId ? warningLogTriggered(log) : null"
      >
        <div class="list__item--left">
          <svg-icon 
            icon-class="alert" 
            class="list__item-icon"/>
        </div>
        <div class="list__item--right">
          <div class="list__item-title">
            {{ log.conditionName }}
          </div>
          <div 
            class="list__item-sub-title" 
            v-html="log.conditionMetMessage"/>
          <div class="list__item-description">
            {{ log.createDate | convertTimeStamp }}
          </div>
        </div>
      </li>
    </template>
    <template v-else>
      <div class="empty-text">{{ $t('alert.emptyLogs') }}</div>
    </template>
  </ul>
</template>

<script>
import { getAlertLogs } from '@/API/Alert'
import { mapGetters } from 'vuex'

export default {
  name: 'MonitorWarningList',
  props: {
    setting: {
      type: Object,
      default: () => {}
    },
    isEditMode: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      warningLogs: [],
      isLoading: false,
      autoRefreshFunction: null
    }
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    activeConditionIds () {
      if (!this.setting.activate || !this.setting.conditions) return []
      return this.setting.conditions.filter(item => item.activate).map(item => item.id)
    }
  },
  created () {
    if (this.activeConditionIds.length > 0) {
      this.getWarningLogs()
      this.setComponentRefresh()
    }
  },
  destroyed () {
    window.clearInterval(this.autoRefreshFunction)
  },
  methods: {
    setComponentRefresh () {
      this.autoRefreshFunction = window.setInterval(this.getWarningLogs, this.convertRefreshFrequency(this.setting.updateFrequency))
    },
    getWarningLogs () {
      this.isLoading = true
      getAlertLogs({ conditionIds: this.activeConditionIds, groupId: this.getCurrentGroupId, active: false }).then(response => {
        this.warningLogs = response.data.map(log => {
          const prevSettingCondition = this.setting.conditions.find(item => item.id === log.conditionId)
          return {
            ...log,
            relatedDashboardId: prevSettingCondition ? prevSettingCondition.relatedDashboardId : null,
          }
        })
      })
        .catch(() => {})
        .finally(() => setTimeout(() => this.isLoading = false, 800))
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
        case '*/45 * * * *':
          return 45 * 60 * 1000
        case '0 * * * *':
          return 60 * 60 * 1000
        case '0 0 * * *':
          return 24 * 60 * 60 * 1000
        case '0 0 * * 0':
          return 7 * 24 * 60 * 1000
        case '0 0 1 * *':
          return 30 * 7 * 24 * 60 * 1000
      }
    },
    logMonitoredData (rowData) {
      return rowData.reduce((acc, cur) => acc.concat(`${cur.displayName}: ${cur.datum[0]}<br>`), '')
    },
    warningLogTriggered ({ relatedDashboardId, monitoredData, monitoredDateRange }) {
      this.$emit('warningLogTriggered', {
        relatedDashboardId: relatedDashboardId,
        rowData: {
          controlList: monitoredData.filter(item => item.statsType === 'CATEGORY'),
          filterList: [
            ...(monitoredDateRange.length > 0 && {
              filterList: {
                columnId: monitoredDateRange[0].dataColumnId,
                columnName: monitoredDateRange[0].displayName,
                dataType: monitoredDateRange[0].dataType,
                end: monitoredDateRange[0].end,
                start: monitoredDateRange[0].start,
                statsType: monitoredDateRange[0].statsType,
              }
            })
          ]
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
  flex: 1;
  width: 100%;
  overflow: auto;
  padding: 0;
  margin: 0;
  &__item {
    width: 100%;
    min-height: 62px;
    background: #252F2F;
    border-radius: 5px;
    display: flex;
    padding: 12px;

    &:not(:last-of-type) {
      margin-bottom: 8px;
    }
    &.is-linkable {
      cursor: pointer;
    }
    &--left {
      display: flex;
      align-items: center;
      margin-right: 11px;
    }

    &--right {
      flex: 1;
    }

    &-icon {
      color: #FF5C46;
      font-size: 25px;
    }

    &-title {
      color: #FFFFFF;
      font-size: 14px;
      margin-bottom: 5px;
    }

    &-sub-title {
      color: #FFFFFF;
      font-size: 12px;
      margin-bottom: 5px;
    }

    &-description {
      color: #A7A7A7;
      font-size: 12px;
    }
  }
  .empty-text {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #999;
  }
}
</style>
