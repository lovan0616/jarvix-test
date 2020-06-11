<template>
  <div class="question-analysis-alert">
    <svg-icon 
      icon-class="alert-circle" 
      class="icon"/>{{ $t('resultDescription.systemQuestionAnalysis', {question: question}) }}
  </div>
</template>
<script>
export default {
  name: 'QuestionAnalysisAlert',
  props: {
    question: {
      type: String,
      default: 'test'
    }
  }
}
</script>
<style lang="scss" scoped>
.question-analysis-alert {
  position: absolute;
  top: -30px;
  left: 0;
  background: rgba(50, 75, 78, 0.6);
  border-radius: 4px;
  padding: 5px 8px;
  color: #FFDF6F;
  font-size: 14px;
  line-height: 20px;

  .icon {
    margin-right: 6px;
    font-size: 16px;
  }
}
</style>
