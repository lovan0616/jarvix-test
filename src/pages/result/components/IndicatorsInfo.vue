<template>
  <div class="indicators-info-block">
    <div class="indicators-board"
      v-for="(info, index) in infoList"
      :key="index"
    >
      <div class="board-label">{{ info.title }}</div>
      <div class="board-content">{{ info.value }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'IndicatorsInfo',
  props: {
    infoList: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
.indicators-info-block {
  .indicators-board {
    &:not(:last-child) {
      margin-bottom: 32px;
    }
    .board-label {
      font-size: 13px;
      line-height: 22px;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
    }
    .board-content {
      font-size: 28px;
      line-height: 1;
      letter-spacing: 0.05em;
      color: $theme-text-color-dark;
    }
  }
}
</style>
