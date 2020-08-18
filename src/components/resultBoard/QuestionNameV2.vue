<template>
  <div class="question-name-block">
    <span class="question-mark">Q</span>
    <span 
      v-if="questionSegmentation.sentence && questionSegmentation.sentence.length"
      class="question-name"
    >
      <question-name-token-v2
        v-for="(segmentation, index) in questionSegmentation.sentence"
        :key="index"
        :token-info="segmentation"
      />
    </span>
    <span 
      v-else
      class="question-name"
    >{{ question }}</span>
  </div>
</template>
<script>
import QuestionNameTokenV2 from './QuestionNameTokenV2'

export default {
  name: 'QuestionNameV2',
  components: {
    QuestionNameTokenV2
  },
  props: {
    questionSegmentation: {
      type: Object,
      default: () => null
    },
    question: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.question-name-block {
  display: flex;
  font-size: 20px;
  line-height: 26px;
  letter-spacing: 0.1em;
  text-align: left;
  color: $theme-text-color;

  .question-mark {
    display: inline-block;
    width: 30px;
    height: 30px;
    background-color: $theme-color-primary;
    color: #fff;
    margin-right: 8px;
    border-radius: 8px;
    text-align: center;
    line-height: 30px;
    font-weight: bold;
  }

  .question-name {
    flex: 1;
    // display: flex;
    // flex-wrap: wrap;
  }
}
</style>
