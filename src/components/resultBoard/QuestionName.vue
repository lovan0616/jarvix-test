<template>
  <div class="question-name-block">
    <span class="question-mark">Q</span>
    <span 
      v-if="questionSegmentation && questionSegmentation.length"
      class="question-name"
    >
      <question-name-token
        v-for="segmentation in questionSegmentation"
        :key="segmentation.startIndex"
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
import QuestionNameToken from './QuestionNameToken'

export default {
  name: 'QuestionName',
  components: {
    QuestionNameToken
  },
  props: {
    questionSegmentation: {
      type: Array,
      default: () => []
    },
    question: {
      type: String,
      default: ''
    }
  },
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
