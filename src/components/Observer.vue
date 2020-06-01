<!-- Observer.vue -->
<template>
  <div class="observer"/>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    observer: null
  }),
  mounted () {
    const options = this.options || {}
    console.log(this)
    console.log(this.$el.closest('.el-table__header-wrapper'))
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        console.log('intersect')
        this.$emit('intersect')
      }
    }, {
      root: this.$el.closest('.el-table__header-wrapper'),
      rootMargin: '300px',
      threshold: 0
    })

    this.observer.observe(this.$el)
  },
  destroyed () {
    this.observer.disconnect()
  }
}
</script>
