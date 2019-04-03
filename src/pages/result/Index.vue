<template>
  <div class="result-page">
    <question-select class="result-question-select-block"
    ></question-select>
    <div class="result-layout"
      v-if="showLayout"
    >
      <section class="section-left-side">
        <recommend-question-list
          v-if="relatedQuestionList.length > 0"
          :question-list="relatedQuestionList"
          @choose="selectQuestion"
        ></recommend-question-list>
        <empty-result
          v-if="isNoResult"
        ></empty-result>
        <layout
          v-else
          v-bind="layout"
        ></layout>
      </section>
      <section class="section-right-side">
        <div class="seciotn-title">历史问题</div>
        <history-question-list
          :question-list="historyQuestionList"
          @choose="selectQuestion"
        ></history-question-list>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { askQuestion, getHistoryQuestionList } from '@/API/Ask'

import QuestionSelect from '@/components/QuestionSelect'
import HistoryQuestionList from '@/pages/result/components/HistoryQuestionList'
import RecommendQuestionList from '@/pages/result/components/RecommendQuestionList'
import EmptyResult from '@/pages/result/components/EmptyResult'

export default {
  name: 'PageResult',
  components: {
    HistoryQuestionList,
    RecommendQuestionList,
    QuestionSelect,
    EmptyResult
  },
  data () {
    return {
      layout: undefined,
      showLayout: false,
      isNoResult: false,
      historyQuestionList: [],
      relatedQuestionList: [],
      askCancelFunction: null
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
        this.$store.commit('bookmark/setAppQuestion', question)
        this.$store.commit('bookmark/setBookmarkId', bookmarkId)
        this.fetchApiAsk({ question, 'bookmark_Id': bookmarkId })
      }
    },
    clearLayout () {
      this.layout = undefined
    },
    fetchApiAsk (data) {
      this.isNoResult = false
      this.showLayout = true
      this.clearLayout()

      const _this = this
      this.cancelRequest()

      askQuestion(data, new axios.CancelToken(function executor (c) {
        _this.askCancelFunction = c
      }))
        .then(res => {
          this.layout = res
          let relatedQuestions = res.related_questions

          // 這邊後端要調整，資料集會返回空陣列
          if (relatedQuestions.vertical) {
            this.relatedQuestionList = relatedQuestions.vertical.concat(relatedQuestions.horizontal)
          } else {
            this.relatedQuestionList = []
          }
        }).catch(error => {
          if (error.response && error.response.status === 500) {
            this.isNoResult = true
            this.relatedQuestionList = []
          }
        }).then(() => {
          this.fetchHistoryQuestionList()
        })
    },
    cancelRequest () {
      if (typeof this.askCancelFunction === 'function') {
        this.askCancelFunction('cancel request')
      }
    },
    selectQuestion (data) {
      this.$store.commit('bookmark/setAppQuestion', data.question)
      this.$store.commit('bookmark/setBookmarkId', data.bookmark_Id)
      this.$store.dispatch('bookmark/updateResultRouter')
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
        this.isNoResult = false
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
