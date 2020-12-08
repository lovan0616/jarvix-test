<template>
  <warning-setting 
    v-if="isEditMode"
    :setting="setting"
    :dashboard-list="dashboardList"
    @update="$emit('update', $event)"
  />
  <warning-log 
    v-else
    :setting="setting"
    @goToCertainDashboard="$emit('goToCertainDashboard', $event)"
  />
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
    setting: {
      type: Object,
      default: () => {}
    },
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
  mounted () {},
  methods: {
    openDashboard (dashboardId) {
      this.$emit('openDashboard', dashboardId)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>