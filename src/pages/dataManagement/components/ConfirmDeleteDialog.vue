<template>
  <confirm-dialog
    :title="title"
    @close="cancel"
  >
    <div class="content" slot="dialogBody">{{ content }}</div>
    <template class="dialog-btn-block" slot="dialogFooter">
      <button type="button" class="btn btn-outline"
        @click="cancel"
      >取消</button>
      <button type="button" class="btn btn-default"
        :disabled="isProcessing"
        @click="confirm"
      >
        <span v-if="isProcessing"><svg-icon icon-class="spinner"></svg-icon>处理中...</span>
        <span v-else>确认删除</span>
      </button>
    </template>
  </confirm-dialog>
</template>
<script>
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
export default {
  name: 'ConfirmDeleteDialog',
  components: {
    ConfirmDialog
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: '确认删除？'
    }
  },
  data () {
    return {
      isProcessing: false
    }
  },
  methods: {
    confirm () {
      this.isProcessing = true
      let result = new Promise(resolve => this.$emit('confirm', resolve))
      result.then(() => {
        this.isProcessing = false
      })
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
