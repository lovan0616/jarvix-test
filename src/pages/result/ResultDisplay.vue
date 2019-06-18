<template>
  <div class="result-layout"
    v-if="showLayout"
  >
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
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { askQuestion, relateQuestions } from '@/API/Ask'
import RecommendQuestionList from '@/pages/result/components/RecommendQuestionList'

export default {
  name: 'ResultDisplay',
  components: {
    RecommendQuestionList
  },
  data () {
    return {
      layout: undefined,
      showLayout: false,
      isNoResult: false,
      relatedQuestionList: [],
      askCancelFunction: null
    }
  },
  watch: {
    '$route.query' ({ question }) {
      if (!question) return false
      this.fetchApiAsk({ question, 'bookmark_id': this.bookmarkId })
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'bookmarks', 'appQuestion']),
    questionResult () {
      return this.$store.state.bookmark.questionResult
    }
  },
  methods: {
    fetchData () {
      let question = this.$route.query.question
      let bookmarkId = parseInt(this.$route.query.bookmarkId)
      if (question) {
        this.fetchApiAsk({ question, 'bookmark_id': bookmarkId })
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
      // question result 是 preview 時塞的資料，如果有的話就塞進去，為了加快分析時間
      if (this.questionResult) {
        data = {...data, result: this.questionResult}
      }
      askQuestion(data, new axios.CancelToken(function executor (c) {
        _this.askCancelFunction = c
      }))
        .then(res => {
          this.layout = res
          this.$store.dispatch('bookmark/getHistoryQuestionList')
        }).catch(() => {
          this.isNoResult = true
          this.relatedQuestionList = []
        })
      // 清空 question result
      this.$store.commit('bookmark/setQuestionResult', null)
      this.getRelatedQuestions(data)
    },
    getRelatedQuestions (data) {
      const _this = this
      relateQuestions(data, new axios.CancelToken(function executor (c) {
        _this.askCancelFunction = c
      }))
        .then(res => {
          // 這邊後端要調整，資料集會返回空陣列
          if (res.vertical) {
            this.relatedQuestionList = res.vertical.concat(res.horizontal)
          } else {
            this.relatedQuestionList = []
          }
        })
    },
    cancelRequest () {
      if (typeof this.askCancelFunction === 'function') {
        this.askCancelFunction('cancel request')
      }
    },
    selectQuestion (data) {
      this.$store.commit('bookmark/setAppQuestion', data.question)
      this.$store.commit('bookmark/setBookmarkById', data.bookmark_Id)
      this.$store.dispatch('bookmark/updateResultRouter')
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
}
.result-layout {
  width: 100%;

  .seciotn-title {
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
  }
}
</style>
