<template>
  <writing-dialog
    :is-loading="isProcessing"
    :title="$t('schedule.project.renameProject')"
    :button="$t('button.confirm')"
    @closeDialog="$emit('close', false)"
    @confirmBtn="confirmRename"
  >
    <input-verify
      v-validate="'required'"
      v-model="newName"
      name="name"
    />
  </writing-dialog>
</template>

<script>
import WritingDialog from '@/components/dialog/WritingDialog'
import InputVerify from '@/components/InputVerify'
import { renameProject } from '@/schedule/API/Project'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'ScheduleProjectRenameDialog',
  components: {
    WritingDialog,
    InputVerify
  },
  props: {
    projectInfo: {
      type: Object,
      default: () => {},
      required: true
    }
  },
  data: () => {
    return {
      newName: '',
      isProcessing: false
    }
  },
  created () {
    this.newName = this.projectInfo.name
  },
  methods: {
    confirmRename () {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return

        this.isProcessing = true
        renameProject({
          id: this.projectInfo.id,
          name: this.newName
        }).then(() => {
            Message({
              message: this.$t('schedule.project.successfullyRenamed'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
            this.$emit('close')
          })
          .catch(() => this.$emit('close', false))
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>