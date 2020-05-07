<template>
  <div class="full-create-dialog">
    <h2>{{ $t('editing.addUser') }}</h2>
    <div @click.stop class="full-create-dialog-box">
      <slot></slot>
    </div>
    <div @click.stop class="dialog-btn-row">
      <button
        :disabled="isProcessing"
        @click="closeDialog"
        class="btn btn-outline dialog-btn">
        {{ $t('button.cancel') }}
      </button>
      <button
        :disabled="isProcessing"
        @click="confirmBtn"
        class="btn btn-default dialog-btn dialog-create">
        <svg-icon v-if="isProcessing" icon-class="spinner"></svg-icon>
        {{ $t('button.submit') }}
      </button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'FillDialog',
  props: {
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmBtn () {
      this.$emit('confirmBtn')
    }
  }
}
</script>
