<template>
  <div class="slot-dialog">
    <slot name="SlotDialog"/>
  </div>
</template>
<script>
export default {
  name: 'SlotDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    autoHide (evt) {
      if (this.show && !this.$el.contains(evt.target)) {
        this.$emit('close')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
