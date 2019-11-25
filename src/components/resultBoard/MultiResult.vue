<template>
  <div class="multi-result">
    <div class="board-title">{{ $t('editing.multiResultTitle') }}</div>
    <div class="question-list">
      <div class="single-question"
        v-for="(singleQuestion, index) in questionList"
        :key="index"
        @click="askQuestion(singleQuestion)"
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
  methods: {
    askQuestion (questionInfo) {
      this.$store.commit('bookmark/setAppQuestion', this.userQuestion)
      this.$store.commit('dataSource/setAppQuestion', this.userQuestion)
      this.$store.dispatch('dataSource/updateResultRouter', 'key_in')
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
  padding: 16px 24px 24px;
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
    cursor: pointer;
    transition: all 0.3s;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    &:hover {
      transform: translate3d(0,-5px,0);
      box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.12);
    }
  }
}
</style>
