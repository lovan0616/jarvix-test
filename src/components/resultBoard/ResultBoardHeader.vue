<template>
  <div class="result-board-title">
    <div class="board-name"><span class="question-mark">Q:</span>{{ question }}</div>
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
  .question-mark {
    color: #4DE2F0;
    margin-right: 4px;
  }
  .board-name {
    font-size: 30px;
    line-height: 38px;
    letter-spacing: 0.1em;
    color: $theme-text-color;
    margin-right: 16px;
  }
}
</style>
