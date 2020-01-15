<template>
  <div class="multi-result">
    <div class="board-title">{{ $t('editing.multiResultTitle') }}</div>
    <!-- <div class="board-description"
      v-if="resultInfo.similarQuestionList"
    >{{ $t('bot.similarQuestionDescription') }}</div> -->
    <div class="board-description">{{ $t('bot.multiplePossibilities') }}</div>
    <div class="question-list">
      <div class="single-question"
        v-for="(singleQuestion, index) in resultInfo"
        :key="index"
        @click="askQuestion(singleQuestion)"
      >
        <question-name
          :question="singleQuestion.question"
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
      this.$store.commit('bookmark/setAppQuestion', questionInfo.question)
      this.$store.commit('dataSource/setAppQuestion', questionInfo.question)
      this.$store.commit('dataSource/setCurrentQuestionInfo', questionInfo)
      this.$store.dispatch('dataSource/updateResultRouter', 'key_in')
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
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 4px;
  }

  .board-description {
    line-height: 24px;
    margin-bottom: 24px;
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
