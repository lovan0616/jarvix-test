<template>
  <confirm-dialog class="confirm-change-name-dialog"
    :title="title"
    @close="cancel"
  >
    <div class="content" slot="dialogBody">
      <input type="text" class="input">
    </div>
    <template class="dialog-btn-block" slot="dialogFooter">
      <button type="button" class="btn btn-outline"
        @click="cancel"
      >取消</button>
      <button type="button" class="btn btn-default"
        @click="confirm"
      >確認</button>
    </template>
  </confirm-dialog>
</template>
<script>
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
export default {
  name: 'ConfirmChangeNameDialog',
  components: {
    ConfirmDialog
  },
  props: {
    title: {
      type: String,
      default: ''
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
.confirm-change-name-dialog {
  .input {
    line-height: 20px;
    padding: 10px 0;
  }
}
</style>
