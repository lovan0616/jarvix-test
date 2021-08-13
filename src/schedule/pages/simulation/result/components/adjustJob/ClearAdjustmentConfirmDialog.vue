<template>
  <decide-dialog
    :title="title"
    :btn-text="$t('schedule.button.continue')"
    type="confirm"
    @closeDialog="$emit('cancel')"
    @confirmBtn="$emit('confirm')"
  />
</template>

<script>
import DecideDialog from '@/components/dialog/DecideDialog'

export default {
  name: 'ClearAdjustmentConfirmDialog',
  components: {
    DecideDialog
  },
  props: {
    title: {
      type: String,
      default: '',
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
