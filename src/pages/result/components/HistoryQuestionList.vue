<template>
  <div class="history-question-list">
    <div class="single-history-question"
      v-for="singleQuestion in questionList"
      :key="singleQuestion.id"
    >
      <div class="question-database">{{ findBookmarkById(singleQuestion.bookmark_id) }}</div>
      <div class="question-name">{{ singleQuestion.question }}</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
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
      if (!bookmarkId) return false
      return this.bookmarks.find(element => {
        return element.id === bookmarkId
      }).name
    }
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarks'])
  }
}
</script>
<style lang="scss" scoped>
.history-question-list {
  background: #FFF;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 4px;

  .single-history-question {
    &:not(:last-child) {
      border-bottom: 0.75px solid #D8D8D8;
      padding: 15px;
    }

    .question-database {
      font-size: 12px;
      line-height: normal;
      letter-spacing: 0.05em;
      color: #979797;
      margin-bottom: 10px;
    }

    .question-name {
      font-weight: 300;
      font-size: 14px;
      line-height: normal;
      letter-spacing: 0.05em;
      color: #444;
    }
  }
}
</style>
