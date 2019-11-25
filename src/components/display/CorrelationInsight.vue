<template>
  <div class="correlation-insight">
    {{ info }}
  </div>
</template>
<script>
export default {
  name: 'CorrelationInsight',
  props: {
    info: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
.correlation-insight {

}
</style>