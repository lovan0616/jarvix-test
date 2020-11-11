<template>
  <writing-dialog
    :title="$t('miniApp.createDashboard')"
    :button="$t('button.create')"
    :show-both="true"
    @closeDialog="$emit('closeDialog')"
    @confirmBtn="createDashboard"
  >
    哈哈哈阿哈哈
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'

export default {
  name: 'CreateDashboardDialog',
  components: {
    WritingDialog
  },
  data () {
    return {}
  },
  methods: {
    createDashboard () {}
  }
}
</script>

<style lang="scss" scoped>
  
</style>