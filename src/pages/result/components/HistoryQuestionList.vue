<template>
  <div class="history-question-list">
    <div class="single-history-question"
      v-for="singleQuestion in questionList"
      :key="singleQuestion.id"
      @click="chooseHistoryQuestion(singleQuestion.bookmark_id, singleQuestion.question)"
    >
      <div class="question-database">{{ findBookmarkById(singleQuestion.bookmark_id) }}</div>
      <div class="question-name">{{ singleQuestion.question }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'HistoryQuestionList',
  props: {
    questionList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    findBookmarkById (bookmarkId) {
      if (!bookmarkId) return 'no bookmark'
      return this.$store.getters['bookmark/findBookmarkById'](bookmarkId)
    },
    chooseHistoryQuestion (bookmarkId, question) {
      this.$emit('choose', { question, 'bookmark_Id': parseInt(bookmarkId) })
    }
  }
}
</script>
<style lang="scss" scoped>
.history-question-list {
  background: #FFF;
  border: 1px solid #eaeaea;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 4px;

  .single-history-question {
    padding: 15px;
    cursor: pointer;

    &:not(:last-child) {
      border-bottom: 0.75px solid $theme-line-color;
    }

    .question-database {
      font-size: 12px;
      line-height: normal;
      letter-spacing: 0.05em;
      color: $theme-text-color-light;
      margin-bottom: 10px;
    }

    .question-name {
      font-weight: 400;
      font-size: 14px;
      line-height: normal;
      letter-spacing: 0.05em;
    }
  }
}
</style>
