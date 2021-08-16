<template>
  <decide-dialog
    :title="$t('schedule.groupSetting.deleteContactReminder')"
    :btn-text="$t('schedule.base.remove')"
    :is-processing="isProcessing"
    type="delete"
    @confirmBtn="confirm"
    @closeDialog="$emit('close', shouldRefetchGroupList)"
  />
</template>

<script>
import DecideDialog from '@/components/dialog/DecideDialog'
import { deleteEmail } from '@/schedule/API/Email'
import { Message } from 'element-ui'

export default {
  name: 'DeleteContact',
  components: {
    DecideDialog
  },
  props: {
    contactInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isProcessing: false,
      shouldRefetchGroupList: false
    }
  },
  methods: {
    confirm () {
      this.isProcessing = true
      deleteEmail(this.contactInfo.id)
        .then(() => {
          Message({
            message: this.$t('schedule.groupSetting.successfullyDeleteContact'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.shouldRefetchGroupList = true
        })
        .catch(() => {})
        .finally(() => {
          this.$emit('close', this.shouldRefetchGroupList)
          this.isProcessing = false
        })
    }
  }
}
</script>
