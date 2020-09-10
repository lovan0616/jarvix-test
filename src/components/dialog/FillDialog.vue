<template>
  <div class="full-create-dialog">
    <h2>{{ $t('userManagement.inviteUser') }}</h2>
    <div 
      class="full-create-dialog-box" 
      @click.stop>
      <slot/>
    </div>
    <div 
      class="dialog-btn-row" 
      @click.stop>
      <button
        :disabled="isProcessing"
        class="btn btn-outline dialog-btn"
        @click="closeDialog">
        {{ $t('button.cancel') }}
      </button>
      <button
        :disabled="isProcessing"
        class="btn btn-default dialog-btn dialog-create"
        @click="confirmBtn">
        <svg-icon 
          v-if="isProcessing" 
          icon-class="spinner"/>
        {{ $t('button.sendInvitation') }}
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
