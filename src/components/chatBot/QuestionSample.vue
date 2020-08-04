<template>
  <div class="question-sample">
    <div class="question-sample__menu">
      <div class="question-sample__menu__title">{{ $t('askHelper.catalog') }}</div>
      <div class="question-sample__menu__list">
        <div 
          v-for="(questionCategory, index) in questionSampleList"
          :key="index"
          :class="{'question-sample__menu__item--active': index === selectedIndex}"
          class="question-sample__menu__item"
          @click="selectCatelog(index)"
        >{{ questionCategory.name }}</div>
      </div>
    </div>
    <div class="question-sample__block">
      <div class="question-sample__block__title">
        <span>{{ $t('askHelper.catalog') }}: </span>
        <span>{{ questionSampleList[selectedIndex].name }}</span>
      </div>
      <div class="question-sample__block__description">
        <span class="question-lamp">
          <svg-icon icon-class="lamp"/>
          {{ $t('askHelper.description') }}:
        </span>
        {{ $t('askHelper.exampleDesc') }}
      </div>
      <div
        v-for="(question, index) in questionList"
        :key="index"
        class="question-box">
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
      activeName: null,
      selectedIndex: 0,
      questionSampleList: this.$t('askHelper.questionSampleList')
    }
  },
  computed: {
    questionList () {
      return this.questionSampleList[this.selectedIndex].questionList
    }
  },
  methods: {
    selectCatelog (index) {
      this.selectedIndex = index
    }
  }
}
</script>
<style lang="scss" scoped>
.question-sample {
  position: relative;
  height: 100%;
  display: flex;

  &__menu {
    width: 200px;
    height: 100%;
    margin-right: 20px;
    
    &__title {
      height: 42px;
      padding: 5px 24px;
      border-radius: 5px 5px 0px 0px;
      font-size: 16px;
      line-height: 200%;
      background: #2B4A4E;

      &::before {
        position: absolute;
        top: 18px;
        left: 12px;
        content: "";
        width: 4px;
        height: 6px;
        background: #4DE2F0;
      }
    }

    &__list {
      height: calc(100% - 42px);
      overflow: hidden;
      border-radius: 5px;
      &:hover { overflow: auto; }
    }

    &__item {
      position: relative;
      cursor: pointer;
      padding: 4px 12px;
      font-size: 14px;
      line-height: 32px;
      color: #999999;
      background: rgba(35, 61, 64, 0.6);
      
      &:not(:last-of-type) {
        border-bottom: 1px solid rgba(50, 75, 78, 0.6);
      }

      &:last-child {
        border-radius: 5px;
      }

      &:hover, &.active, &--active{
        background-color: rgba(50, 75, 78, 0.6);;
        color: #fff;

        &:after {
          position: absolute;
          right: 12px;
          top: calc(50% - 4px);
          content: "";
          display: block;
          width: 0;
          height: 0;
          border: 4px solid transparent;
          border-left-color: #fff;
        }
      }
    }
  }

  &__block {
    width: calc(100% - 224px);
    overflow: auto;
    padding-right: 10px;
    
    &__title {
      font-size: 18px;
      line-height: 32px;
    }

    &__description {
      font-size: 12px;
      line-height: 32px;
      word-break: keep-all;

      .question-lamp {
        color: $theme-color-warning;
      }
    }

    .question-list {
      line-height: 32px;
      padding: 4px 16px;

      &:nth-child(odd) {
        background-color: rgba(50, 75, 78, 0.6);
      }
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
