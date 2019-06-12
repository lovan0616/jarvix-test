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
import EmptyResult from '@/pages/result/components/EmptyResult'

export default {
  name: 'ResultDisplay',
  components: {
    RecommendQuestionList,
    EmptyResult
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
  // activated () {
  //   // 從個人釘板回到搜尋結果，如果有記錄先組回原有的 router path
  //   if (this.appQuestion && !this.$route.query.question) {
  //     this.$router.push({
  //       name: 'PageResultDisplay',
  //       query: {
  //         question: this.appQuestion,
  //         '_': new Date().getTime(),
  //         bookmarkId: this.bookmarkId
  //       }
  //     })
  //   }
  // },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'bookmarks', 'appQuestion'])
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

      askQuestion(data, new axios.CancelToken(function executor (c) {
        _this.askCancelFunction = c
      }))
        .then(res => {
          this.layout = res
        }).catch(error => {
          if (error.response && error.response.status === 500) {
            this.isNoResult = true
            this.relatedQuestionList = []
          }
        })
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
