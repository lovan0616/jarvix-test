<template>
  <div 
    class="correlation-insight"
    v-html="textTransform(info)"
  />
</template>
<script>
export default {
  name: 'CorrelationInsight',
  props: {
    info: {
      type: String,
      default: null
    }
  },
  methods: {
    textTransform (text) {
      return text.replace('^2', '<sup>2</sup>')
    }
  }
}
</script>
<style lang="scss" scoped>
.correlation-insight {
  background: rgba(35, 61, 64, 0.6);
  border: 1px solid #065D68;
  border-radius: 8px;
  padding: 16px;
  line-height: 24px;
}
</style>
