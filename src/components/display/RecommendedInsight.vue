<template>
  <div class="insights-info recommended">
    <div class="insights-info-title">{{ $t('resultDescription.recommendedInsight') }}</div>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'RecommendedInsight',
  data () {
    return {
    }
  },
}
</script>

<style lang="scss" scoped>
.task__wrapper {
  display: flex;
  flex-wrap: wrap;
  .task {
    flex: 1 0 50%;
  }
}
</style>