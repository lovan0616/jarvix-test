<template>
  <confirm-dialog 
    :title="title"
    class="confirm-change-name-dialog"
    @close="cancel"
  >
    <div 
      slot="dialogBody" 
      class="content">
      <input-block 
        v-validate="`required|max:${max}`"
        v-model="newName"
        class="login-input-block"
        name="newDataSourceName"
      />
    </div>
    <template 
      slot="dialogFooter" 
      class="dialog-btn-block">
      <button 
        type="button" 
        class="btn btn-outline"
        @click="cancel"
      >{{ $t('button.cancel') }}</button>
      <button 
        :disabled="isProcessing" 
        type="button"
        class="btn btn-default"
        @click="confirm"
      >
        <span v-if="isProcessing"><svg-icon icon-class="spinner"/>{{ $t('button.processing') }}</span>
        <span v-else>{{ $t('button.confirm') }}</span>
      </button>
    </template>
  </confirm-dialog>
</template>
<script>
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import InputBlock from '@/components/InputBlock'

export default {
  name: 'ConfirmChangeNameDialog',
  inject: ['$validator'],
  components: {
    ConfirmDialog,
    InputBlock
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
  computed: {
    max () {
      return this.$store.state.validation.fieldCommonMaxLength
    }
  },
  methods: {
    confirm () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        this.isProcessing = true
        let confirmResult = new Promise(resolve => this.$emit('confirm', {resolve, name: this.newName}))
        confirmResult.then(() => {
          this.isProcessing = false
        })
      })
    },
    cancel () {
      this.$emit('cancel')
    }
  },
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
