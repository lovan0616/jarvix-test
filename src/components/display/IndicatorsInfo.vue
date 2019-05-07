<template>
  <div class="indicators-info-block">
    <div class="indicators-board"
      v-for="(info, index) in infoList"
      :key="index"
      :style="{width: 100/infoList.length + '%'}"
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
  display: flex;
  justify-content: center;
  margin-bottom: 46px;
  text-align: center;

  .indicators-board {
    &:not(:last-child) {
      margin-right: 20px;
    }
    .board-label {
      font-size: 13px;
      line-height: 22px;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
      color: #444444;
    }
    .board-content {
      font-size: 28px;
      line-height: normal;
      letter-spacing: 0.05em;
      color: $theme-text-color-dark;
      font-family: 'Oswald'
    }
  }
}
</style>
