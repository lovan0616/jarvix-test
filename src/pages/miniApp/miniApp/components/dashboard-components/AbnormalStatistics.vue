<template>
  <div class="abnormal-statistics">
    <spinner 
      v-if="isLoading"
      class="list__spinner"
      size="50"
    />
    <display-index-info
      v-else
      :dataset="{data: [logCount]}"
      :custom-chart-style="indexComponentStyle" />
  </div>
</template>

<script>

import { getAlertLogsCount, getAlertConditions } from '@/API/Alert'
import { mapGetters } from 'vuex'
import { sizeTable } from '@/utils/general'

export default {
  name: 'AbnormalStatistics',
  props: {
    type: {
      type: String,
      required: true
    },
    conponentConfig: {
      type: Object,
      default: () => ({})
    },
    warningModuleSetting: {
      type: Object,
      default: () => ({})
    },
    filterTime: {
      type: Object,
      default: () => ({
        start: null,
        end: null
      })
    },
    isEditMode: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      sizeTable,
      isLoading: false,
      logCount: 0,
      appConditions: []
    }
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentGroupId']),
    isGetHandledComponentCount () {
      return this.type === 'handled-abnormal-statistics'
    },
    textColor () {
      if (this.logCount === 0) return '#999999'
      return this.isGetHandledComponentCount ? '#2AD2E2' : '#FF5C46'
    },
    indexComponentStyle () {
      return {
        ...this.sizeTable[this.conponentConfig.fontSize || 'middle'],
        'color': this.textColor
      }
    }
  },
  watch: {
    filterTime: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        if (!oldValue || (JSON.stringify(newValue) === JSON.stringify(oldValue))) return
        this.fetchData()
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (
        !this.warningModuleSetting.activate 
        || !this.warningModuleSetting.conditions
        || this.warningModuleSetting.conditions.length === 0
      ) return
      const appConditionIds = this.warningModuleSetting.conditions.map(item => item.id)
      const conditionIdSet = new Set(appConditionIds)

      this.isLoading = true

      // 取得當前 app active 狀態的示警條件
      getAlertConditions(this.getCurrentGroupId)
        .then(conditions => {
          this.appConditions = conditions.reduce((acc, cur) => {
            if (!cur.active || !conditionIdSet.has(cur.id)) return acc
            acc.push(cur.id)
            return acc
          }, [])
          this.fetchData()
        })
        .catch(() => this.isLoading = false)
    },
    fetchData () {  
      this.isLoading = true
      getAlertLogsCount({ 
        conditionIds: this.appConditions, 
        groupId: this.getCurrentGroupId, 
        active: this.isGetHandledComponentCount,
        startTime: this.filterTime.start,
        endTime: this.filterTime.end
      })
        .then(count => {
          this.logCount = count
        })
        .catch(() => {})
        .finally(() => { this.isLoading = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.abnormal-statistics {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .index-info {
    text-align: center;
  }
}
</style>
