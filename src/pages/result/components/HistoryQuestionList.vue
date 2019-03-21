<template>
  <div class="history-question-list">
    <div class="single-history-question"
      v-for="n in 10"
      :key="n"
    >
      <div class="question-database">database-00{{n}}</div>
      <div class="question-name">深圳與其他地區的價格比較</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HistoryQuestionList'
}
</script>
<style lang="scss" scoped>
.history-question-list {
  background: #FFF;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 4px;

  .single-history-question {
    &:not(:last-child) {
      border-bottom: 0.75px solid #D8D8D8;
      padding: 15px;
    }

    .question-database {
      font-size: 12px;
      line-height: normal;
      letter-spacing: 0.05em;
      color: #979797;
      margin-bottom: 10px;
    }

    .question-name {
      font-weight: 300;
      font-size: 14px;
      line-height: normal;
      letter-spacing: 0.05em;
      color: #444;
    }
  }
}
</style>
