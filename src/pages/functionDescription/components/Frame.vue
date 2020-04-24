<template>
  <div
    class="frame"
    :style="{
      width,
      height,
      top,
      left
    }"
  ></div>
</template>

<script>
export default {
  name: 'Frame',
  props: {
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '0'
    },
    left: {
      type: String,
      default: '0'
    }
  }
}
</script>

<style lang="scss" scoped>
.frame {
  border: 3px solid $theme-color-warning;
  position: absolute;
}
</style>
