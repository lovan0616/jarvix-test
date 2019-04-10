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
  .board-name {
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.1em;
    color: $theme-text-color-dark;
    margin-bottom: 5px;
  }
  .board-period {
    font-size: 14px;
    line-height: 14px;
    letter-spacing: 0.05em;
    color: $theme-text-color-light;
  }
}
</style>
