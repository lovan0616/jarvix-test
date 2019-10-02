<template>
  <confirm-dialog
    :title="title"
    @close="cancel"
  >
    <div class="content" slot="dialogBody">{{ content }}</div>
    <template class="dialog-btn-block" slot="dialogFooter">
      <button type="button" class="btn btn-secondary"
        @click="cancel"
      >{{ $t('button.cancel') }}</button>
      <button type="button" class="btn btn-default"
        :disabled="isProcessing"
        @click="confirm"
      >
        <span v-if="isProcessing"><svg-icon icon-class="spinner"></svg-icon>{{ $t('button.processing') }}</span>
        <span v-else>{{ $t('button.confirmDelete') }}</span>
      </button>
    </template>
  </confirm-dialog>
</template>
<script>
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import i18n from '@/lang/index.js'
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
      default: i18n.t('button.confirmDeleteOrNot')
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
