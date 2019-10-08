<template>
  <div class="">
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

</style>