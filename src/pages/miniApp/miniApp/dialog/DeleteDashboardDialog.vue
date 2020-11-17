<template>
  <decide-dialog
    :title="$t('miniApp.confirmDeletingDashboad', { name: dashboardName })"
    :btn-text="$t('button.delete')"
    :is-processing="isProcessing"
    type="delete"
    @closeDialog="$emit('close')"
    @confirmBtn="confirm"
  />
</template>

<script>
import DecideDialog from '@/components/dialog/DecideDialog'

export default {
  name: 'DeleteDashboardDialog',
  components: {
    DecideDialog
  },
  props: {
    dashboardName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isProcessing: false
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
      this.isProcessing = true
    }
  }
}
</script>
