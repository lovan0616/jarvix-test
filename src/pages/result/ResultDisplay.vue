<template>
  <div class="result-layout"
    v-if="showLayout"
  >
    <empty-result
      v-if="isNoResult"
    ></empty-result>
    <layout
      v-else
      v-bind="layout"
    ></layout>
    <div class="recommend-question-list-block"
      v-if="relatedQuestionList.length > 0"
    >
      <div class="block-title">推荐语句</div>
      <div class="category-title">比较类</div>
      <div class="category-question-list">
        <preview-result-board class="result-board"
          v-for="(question, index) in relatedQuestionList"
          :key="question + index"
          :index="index"
          :question="question"
          @remove="removeQueston"
        ></preview-result-board>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { askQuestion, relateQuestions } from '@/API/Ask'
import PreviewResultBoard from '@/components/PreviewResultBoard'

export default {
  name: 'ResultDisplay',
  components: {
    PreviewResultBoard
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
    ...mapGetters('bookmark', ['bookmarkId', 'appQuestion']),
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
            this.relatedQuestionList = res.vertical.concat(res.horizontal, res.backward)
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
      this.$store.dispatch('bookmark/changeBookmarkById', data.bookmark_Id)
      this.$store.dispatch('bookmark/updateResultRouter')
    },
    removeQueston (index) {
      this.relatedQuestionList.splice(index, 1)
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
  .recommend-question-list-block {
    margin-top: 64px;

    .block-title {
      font-size: 24px;
      line-height: 40px;
      letter-spacing: 0.1em;
      margin-bottom: 48px;
    }

    .category-title {
      font-size: 18px;
      line-height: 26px;
      margin-bottom: 12px;
    }
  }

  .category-question-list {
    display: flex;
    flex-wrap: wrap;

    .result-board {
      width: 31.34%;

      &:not(:nth-child(3n)) {
        margin-right: 2.99%;
      }
    }
  }
}
</style>
