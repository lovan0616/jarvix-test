<template>
  <div class="result-board-title">
    <div class="board-name">
      <div class="question-mark">Q</div>
      <div class="question-name"
        v-if="segmentation && segmentation.segmentation.length > 0"
      >
        <question-name-token
          v-for="(tokenInfo, index) in segmentation.segmentation"
          :key="index"
          :token-info="tokenInfo"
        ></question-name-token>
      </div>
      <div class="question-name"
        v-else
      >{{ title }}</div>
    </div>
  </div>
</template>
<script>
import QuestionNameToken from './QuestionNameToken'

export default {
  name: 'ResultBoardHeader',
  components: {
    QuestionNameToken
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    segmentation: {
      type: Object
    }
  }
}
</script>
<style lang="scss" scoped>
.result-board-title {
  .board-name {
    display: flex;
    align-items: center;
    font-size: 30px;
    line-height: 38px;
    letter-spacing: 0.1em;
    color: $theme-text-color;
    margin-right: 16px;
  }

  .question-mark {
    width: 30px;
    height: 30px;
    background-color: $theme-color-primary;
    color: #fff;
    margin-right: 8px;
    font-size: 18px;
    font-weight: bold;
    border-radius: 8px;
    text-align: center;
    line-height: 30px;
  }

  .question-name {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    letter-spacing: 0.05em;
  }
}
</style>
