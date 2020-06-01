<template>
  <div class="question-sample">
    <div class="question-sample-block">
      <div class="question-description">
        <span class="question-lamp">
          <svg-icon icon-class="lamp"/>
          {{ $t('askHelper.description') }}:
        </span>
        {{ $t('askHelper.exampleDesc') }}</div>
      <el-collapse 
        v-model="activeName"
        class="question-sample-collapse"
        accordion
      >
        <el-collapse-item
          v-for="(questionCategory, index) in $t('askHelper.questionSampleList')"
          :key="index"
          :title="questionCategory.name"
          class="question-title"
        >
          <div
            v-for="(question, questionIndex) in questionCategory.questionList"
            :key="index + '-' + questionIndex"
            class="question-box"
          >
            <div class="question-ask">
              <p class="question-ask-text">{{ $t('askHelper.ask') }}: </p>
              <p>{{ question.questionText }}</p>
            </div>
            <div class="question-example">{{ $t('askHelper.example') }}:</div>
            <single-question
              v-for="(exampleQuestion, exampleQuestionIndex) in question.questionExample"
              :example-question="exampleQuestion"
              :key="index + '-' + exampleQuestionIndex"
              class="question-sentence"
            />
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>
<script>
import SingleQuestion from '@/components/chatBot/SingleQuestion'
export default {
  name: 'QuestionSample',
  components: {
    SingleQuestion
  },
  data () {
    return {
      activeName: null
    }
  },
  computed: {
    askSampleList () {
      return [
        {
          type: {

          },
          questionList: [
            {

            }
          ]
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.question-sample {
  position: relative;

  .question-sample-block {

    .question-description {
      font-size: 12px;
      line-height: 32px;
      word-break: keep-all;
    }

    .question-lamp {
      color: $theme-color-warning;
    }

    .question-list {
      line-height: 32px;
      padding: 4px 16px;

      &:nth-child(odd) {
        background-color: rgba(50, 75, 78, 0.6);
      }
    }

    .question-title {
      font-size: 14px;
    }

    .question-ask {
      display: flex;
      padding: 11px 16px;
      font-weight: 600;
      font-size: 14px;
      line-height: 22px;
      background: rgba(50, 75, 78, 0.6);
      margin-top: 26px;

      &:first-child {
        margin-top: 0px;
      }
    }

    .question-ask p {
      margin: 0px;
    }

    .question-ask-text {
      padding-right: 4px;
    }

    .question-box {
      padding: 6px 0px;
    }

    .question-example {
      font-weight: 600;
      font-size: 14px;
      line-height: 26px;
      padding: 12px 16px 8px;
      color: #DDDDDD;
    }

    .question-sentence {
      display: flex;
      font-size: 14px;
      line-height: 18px;
      color: #DDDDDD;
      padding: 4px 16px;
    }
  }
}

</style>
