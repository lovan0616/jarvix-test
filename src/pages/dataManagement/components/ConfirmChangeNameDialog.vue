<template>
  <confirm-dialog class="confirm-change-name-dialog"
    :title="title"
    @close="cancel"
  >
    <div class="content" slot="dialogBody">
      <input type="text" class="input" name="newDataSourceName"
        v-model="newName"
      >
    </div>
    <template class="dialog-btn-block" slot="dialogFooter">
      <button type="button" class="btn btn-secondary"
        @click="cancel"
      >取消</button>
      <button type="button" class="btn btn-default"
        :disabled="isProcessing"
        @click="confirm"
      >
        <span v-if="isProcessing"><svg-icon icon-class="spinner"></svg-icon>处理中...</span>
        <span v-else>确认</span>
      </button>
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
    },
    source: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      newName: this.source,
      isProcessing: false
    }
  },
  methods: {
    confirm () {
      this.isProcessing = true
      let result = new Promise(resolve => this.$emit('confirm', {resolve, name: this.newName}))
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
.confirm-change-name-dialog {
  .input {
    line-height: 20px;
    padding: 10px 0;
  }
}
</style>
