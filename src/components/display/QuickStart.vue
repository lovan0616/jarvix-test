<template>
  <div class="quick-start-list">
    <div class="title">{{ $t('resultDescription.quickStart') }}</div>
    <div class="question-list">
      <preview-result-board class="result-board"
        v-for="(singleQuestion, index) in questionList"
        :key="index"
        :question-info="singleQuestion"
      ></preview-result-board>
    </div>
  </div>
</template>
<script>
export default {
  name: 'QuickStart',
  props: {
    questionList: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.quick-start-list {
  padding: 24px;

  .title {
    text-align: left;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 24px;
  }
  .question-list {
    display: flex;
    min-height: 50px;
  }

  .single-result-board {
    width: 32%;

    &:not(:nth-child(3n)) {
      margin-right: 2%;
    }
  }
}
</style>
