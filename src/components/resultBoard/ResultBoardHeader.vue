<template>
  <div class="result-board-title">
    <div class="board-name">
      <div class="question-mark">Q</div>
      <!-- <div class="question-name">
        <question-name-token
          :name-info="{
            text: '123',
            type: 'category'
          }"
        ></question-name-token>
        <question-name-token
          :name-info="{
            text: '123',
            type: 'category'
          }"
        ></question-name-token>
        <question-name-token
          :name-info="{
            text: '123',
            type: 'category'
          }"
        ></question-name-token>
        <question-name-token
          :name-info="{
            text: '123',
            type: 'category'
          }"
        ></question-name-token><div class="token filter">XXXX年</div><div class="token category">測試</div>的<div class="token numeric">問題</div>
      </div> -->
      {{ question }}
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
    question: {
      type: String,
      default: ''
    }
    // segmentation: {
    //   type: Array
    // }
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
    align-items: center;
    letter-spacing: 0.05em;
  }
}
</style>
