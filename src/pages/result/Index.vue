<template>
  <div class="result-page">
    <question-select class="result-question-select-block"
    ></question-select>
    <div class="result-layout"
      v-if="showLayout"
    >
      <section class="section-left-side">
        <recommend-question-list
          :question-list="relatedQuestionList"
          @choose="fetchApiAsk"
        ></recommend-question-list>
        <layout v-bind="layout"></layout>
      </section>
      <section class="section-right-side">
        <div class="seciotn-title">歷史問題</div>
        <history-question-list
          :question-list="historyQuestionList"
          @choose="fetchApiAsk"
        ></history-question-list>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { askQuestion, getHistoryQuestionList } from '@/API/Ask'

import QuestionSelect from '@/components/QuestionSelect'
import HistoryQuestionList from '@/pages/result/components/HistoryQuestionList'
import RecommendQuestionList from '@/pages/result/components/RecommendQuestionList'

export default {
  name: 'PageResult',
  components: {
    HistoryQuestionList,
    RecommendQuestionList,
    QuestionSelect
  },
  data () {
    return {
      layout: undefined,
      showLayout: false,
      historyQuestionList: [],
      relatedQuestionList: []
    }
  },
  watch: {
    '$route.query' ({ question }) {
      if (!question) return false
      this.fetchApiAsk({ question, 'bookmark_Id': this.bookmarkId })
    }
  },
  created () {
    this.$store.dispatch('bookmark/init').then(state => {
      this.start()
    })
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
    start () {
      let question = this.$route.query.question
      let bookmarkId = parseInt(this.$route.query.bookmarkId)
      if (question) {
        this.fetchApiAsk({ question, 'bookmark_Id': bookmarkId })
      }
    },
    clearLayout () {
      this.layout = undefined
    },
    fetchApiAsk (data) {
      this.showLayout = true
      this.clearLayout()
      this.$store.commit('bookmark/setAppQuestion', data.question)
      this.$store.commit('bookmark/setBookmarkId', data.bookmark_Id)
      askQuestion(data)
        .then(res => {
          this.layout = res
          let relatedQuestions = res.related_questions
          this.relatedQuestionList = relatedQuestions.vertical.concat(relatedQuestions.horizontal)
          this.fetchHistoryQuestionList()
        })
    },
    fetchHistoryQuestionList () {
      getHistoryQuestionList()
        .then(res => {
          this.historyQuestionList = res.history
        })
    },
    onBookmarkChange (bookmarkId) {
      this.$store.dispatch('bookmark/changeBookmarkById', bookmarkId).then(state => {
        this.clearLayout()
        this.$store.commit('bookmark/setAppQuestion', '')
        this.showLayout = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.result-page {
  .result-question-select-block {
    margin: 23px 0 20px;
  }
}
.result-layout {
  display: flex;
  justify-content: space-between;

  .section-left-side {
    width: 79.59%;
  }

  .section-right-side {
    width: 18.37%;
  }

  .seciotn-title {
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.1em;
    color: #444;
    margin-bottom: 10px;
  }
}
</style>
