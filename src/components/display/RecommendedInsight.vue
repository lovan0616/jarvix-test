<template>
  <div class="insights-info recommended">
    <div class="insights-info-title">{{ $t('resultDescription.recommendedInsight') }}</div>
    <div class="task__wrapper">
      <slot />
    </div>
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
  justify-content: space-between;
  flex-wrap: wrap;
  .task {
    flex-basis: calc(50% - 10px);
    width: unset;
    &:first-child {
      margin-bottom: 20px;
    }
  }
}
</style>