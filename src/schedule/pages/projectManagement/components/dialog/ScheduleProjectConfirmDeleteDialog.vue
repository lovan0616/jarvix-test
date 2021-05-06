<template>
  <decide-dialog
    :is-processing="isProcessing"
    :content="$t('schedule.project.confirmDeleteProject', { name: projectInfo.name })"
    type="confirm"
    @closeDialog="$emit('close', false)"
    @confirmBtn="deleteProject"
  />
</template>

<script>
import DecideDialog from '@/components/dialog/DecideDialog'
import { deleteProject } from '@/schedule/API/Project'

export default {
  name: 'ScheduleProjectConfirmDeleteDialog',
  components: {
    DecideDialog
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
      isProcessing: false
    }
  },
  methods: {
    deleteProject () {
      this.isProcessing = true
      deleteProject(this.projectInfo.id)
        .then(() => {
          this.$emit('close')
        })
        .finally(() => {
          this.$emit('close', false)
        })
    }
  }
}
</script>