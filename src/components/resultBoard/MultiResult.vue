<template>
  <div class="multi-result">
    <div class="board-title">{{ $t('editing.multiResultTitle') }}</div>
    <div class="question-list">
      <div class="single-question"
        v-for="(singleQuestion, index) in questionList"
        :key="index"
      >
        <question-name
          :question-segmentation="singleQuestion.segmentation"
        ></question-name>
      </div>
    </div>
  </div>
</template>
<script>
import QuestionName from './QuestionName'

export default {
  name: 'MultiResult',
  components: {
    QuestionName
  },
  props: {
    resultInfo: {
      type: Object
    }
  },
  computed: {
    questionList () {
      if (this.resultInfo.checkQuestionList) {
        return this.resultInfo.checkQuestionList
      } else if (this.resultInfo.relatedQuestionList) {
        return this.resultInfo.relatedQuestionList
      } else if (this.resultInfo.similarQuestionList) {
        return this.resultInfo.similarQuestionList
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.multi-result {
  padding: 16px 24px;
  background-color: $theme-bg-color;
  border-radius: 8px;

  .board-title {
    font-size: 18px;
    line-height: 32px;
    margin-bottom: 4px;
  }

  .single-question {
    padding: 16px;
    background: rgba(35, 61, 64, 0.6);
    border: 1px solid #065D68;
    border-radius: 8px;

    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }
}
</style>
