<template>
  <warning-setting 
    v-if="isEditMode"
    :dashboard-list="dashboardList"
  />
  <warning-log v-else/>
</template>

<script>
import WarningSetting from './WarningSetting'
import WarningLog from './WarningLog'

export default {
  name: 'WarningModule',
  components: {
    WarningSetting,
    WarningLog
  },
  props: {
    dashboardList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  computed: {
    mode () {
      return this.$route.query.mode
    },
    isEditMode () {
      return this.mode && this.mode === 'edit'
    }
  },
  mounted () {
    while (this.tableData.length < 20) {
      this.tableData.push({
        warningRule: '2330 + 0050總和低於490',
        warningMessage: '危機入市',
        detail: '399, 89'
      })
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>