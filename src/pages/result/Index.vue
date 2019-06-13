<template>
  <div class="result-page">
    <div class="result-question-select-block">
      <bookmark-select></bookmark-select>
      <question-select class="question-select"></question-select>
      <history-question-list></history-question-list>
    </div>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BookmarkSelect from '@/components/select/BookmarkSelect'
import QuestionSelect from '@/components/select/QuestionSelect'
import HistoryQuestionList from '@/pages/result/components/HistoryQuestionList'

export default {
  name: 'PageResult',
  components: {
    HistoryQuestionList,
    BookmarkSelect,
    QuestionSelect
  },
  created () {
    this.fetchData()
    this.$store.dispatch('bookmark/init')
    this.$store.dispatch('bookmark/getHistoryQuestionList')
  },
  activated () {
    // 從個人釘板回到搜尋結果，如果有記錄先組回原有的 router path
    if (this.appQuestion && !this.$route.query.question) {
      this.$router.push({
        name: 'PageResult',
        query: {
          question: this.appQuestion,
          '_': new Date().getTime(),
          bookmarkId: this.bookmarkId
        }
      })
    }
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'bookmarks', 'appQuestion'])
  },
  methods: {
    fetchData () {
      let question = this.$route.query.question
      let bookmarkId = parseInt(this.$route.query.bookmarkId)
      if (question) {
        this.$store.commit('bookmark/setAppQuestion', question)
        this.$store.commit('bookmark/setBookmarkById', bookmarkId)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.result-page {
  .result-question-select-block {
    display: flex;
    margin-bottom: 20px;
  }
  .question-select {
    margin-right: 30px;
  }
}
.result-layout {

  .seciotn-title {
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
  }
}
</style>
