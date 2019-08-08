<template>
  <div class="result-board-title">
    <div class="board-name">{{ question }}</div>
    <div class="board-period">{{ period }}</div>
  </div>
</template>
<script>
export default {
  name: 'ResultBoardHeader',
  props: {
    question: {
      type: String,
      default: ''
    },
    period: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.result-board-title {
  border-left: 2px solid #8ef5ff;
  padding-left: 16px;

  .board-name {
    font-size: 20px;
    line-height: 34px;
    letter-spacing: 0.1em;
    color: $theme-text-color;
  }
  .board-period {
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.05em;
    color: $theme-text-color-light;
  }
}
</style>
