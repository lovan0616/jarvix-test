<template>
  <div class="sy-block" :style="customStyles">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SyBlock',
  props: {
    size: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      customStyles: {
        width: `calc(${this.size}% - 20px)`,
        flexBasis: 'auto'
      }
    }
  },
  created () {
    // console.log('sy-block', this.$style)
  }
}
</script>
