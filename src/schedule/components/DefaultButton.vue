<template>
  <button
    :class="['default-button', buttonSize, buttonType]"
    :type="nativeType"
    :disabled="isDisabled"
    @click="$emit('click')"
  >
    <spinner
      v-show="showSpinner"
      size="16"
    />
    <slot />
  </button>
</template>

<script>
export default {
  name: 'DefaultButton',
  props: {
    isDisabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'primary'
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    showSpinner: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    buttonSize () {
      return this.size ? 'btn-' + this.size : 'btn'
    },
    buttonType () {
      return 'btn-' + this.type
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/common/_button.scss'
</style>
