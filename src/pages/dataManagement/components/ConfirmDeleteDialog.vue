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
        @click="confirm"
      >確認刪除</button>
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
      default: '確認刪除？'
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
