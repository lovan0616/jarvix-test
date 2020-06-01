<template>
  <div class="observer" />
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
  computed: {
    formedOptions () {
      return {
        root: this.options.root || this.$el.closest(this.options.rootClassName) || null,
        rootMargin: this.options.rootMargin || '0px',
        threshold: this.options.threshold || 0
      }
    }
  },
  mounted () {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        this.$emit('intersect')
      }
    }, this.formedOptions)

    this.observer.observe(this.$el)
  },
  destroyed () {
    this.observer.disconnect()
  }
}
</script>
