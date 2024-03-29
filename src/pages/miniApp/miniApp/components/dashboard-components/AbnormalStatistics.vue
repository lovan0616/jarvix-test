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
      :custom-chart-style="indexComponentStyle"
    />
  </div>
</template>

<script>

import { getAlertLogsCount } from '@/API/Alert'
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
      default: false
    }
  },
  data () {
    return {
      sizeTable,
      isLoading: false,
      logCount: 0,
      appAciveConditions: []
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
        color: this.textColor
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
      this.isLoading = true
      this.fetchMiniAppActiveWarningConditions(this.warningModuleSetting)
        .then(conditionList => {
          if (conditionList.length === 0) return this.isLoading = false
          this.appAciveConditions = conditionList
          this.fetchData()
        })
        .catch(() => this.isLoading = false)
    },
    fetchData () {
      this.isLoading = true
      getAlertLogsCount({
        conditionIds: this.appAciveConditions,
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
  overflow: auto;
  overflow: overlay;

  .index-info {
    text-align: center;
  }
}
</style>
