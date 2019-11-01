<template>
  <div class="result-board-title">
    <div class="board-name"><div class="question-mark">Q</div>{{ question }}</div>
  </div>
</template>
<script>
export default {
  name: 'ResultBoardHeader',
  props: {
    question: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.result-board-title {
  .board-name {
    display: flex;
    align-items: center;
    font-size: 30px;
    line-height: 38px;
    letter-spacing: 0.1em;
    color: $theme-text-color;
    margin-right: 16px;
  }

  .question-mark {
    width: 30px;
    height: 30px;
    background-color: $theme-color-primary;
    color: #fff;
    margin-right: 8px;
    font-size: 18px;
    font-weight: bold;
    border-radius: 8px;
    text-align: center;
    line-height: 30px;
  }
}
</style>
