<template>
  <ul 
    :class="{'is-view-mode': !isEditMode}"
    class="list"
    @click="goToWarningLogPage">
    <spinner 
      v-if="isLoading"
      class="list__spinner"
      size="50"
    />
    <template v-else-if="warningLogs.length > 0">
      <li 
        v-for="(log, index) in warningLogs"
        :key="index"
        class="list__item">
        <div class="list__item--left">
          <svg-icon 
            icon-class="alert" 
            class="list__item-icon"/>
        </div>
        <div class="list__item--right">
          <div class="list__item-title">
            {{ log.conditionMetMessage }}
          </div>
          <div class="list__item-description">
            {{ log.createDate | convertTimeStamp }}
          </div>
        </div>
      </li>
    </template>
    <template v-else>
      <div class="empty-text">暫無任何示警內容</div>
    </template>
  </ul>
</template>

<script>
import { getAlertLogs } from '@/API/Alert'

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
      this.autoRefreshFunction = window.setInterval(() => {
        this.getWarningLogs()
      }, this.convertRefreshFrequency(this.setting.updateFrequency))
    },
    getWarningLogs () {
      this.isLoading = true
      getAlertLogs({ conditionIds: this.activeConditionIds }).then(response => {
        this.warningLogs = response.data.map(log => {
          const prevSettingCondition = this.setting.conditions.find(item => item.id === log.conditionId)
          return {
            ...log,
            relatedDashboardId: prevSettingCondition ? prevSettingCondition.relatedDashboardId : null,
          }
        })
      })
        .catch(() => {})
        .finally(() => setTimeout(() => {
          this.isLoading = false
        }, 1000) )
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
    goToWarningLogPage () {
      if (this.isEditMode) return
      this.$emit('goToWarningLogPage')
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
  &.is-view-mode {
    cursor: pointer;
  }
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