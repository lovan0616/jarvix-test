<template>
  <div class="result-preview">
    <div class="serch-result-container">
      <div class="search-result-block most-related">
        <div class="search-result-title">最相關結果</div>
        <div class="search-result-list">
          <single-result-board
            v-if="currentQuestion"
            :question="currentQuestion"
          ></single-result-board>
        </div>
      </div>
      <div class="search-result-block">
        <div class="search-result-title">其他結果</div>
        <div class="search-result-list">
          <single-result-board
            v-for="(question, index) in relatedQuestions"
            :key="index"
            :question="question"
          ></single-result-board>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { getPreviewQuestions } from '@/API/Ask'
import EmptyResult from '@/pages/result/components/EmptyResult'
import SingleResultBoard from './components/SingleResultBoard'

export default {
  name: 'ResultPreview',
  components: {
    EmptyResult,
    SingleResultBoard
  },
  data () {
    return {
      currentQuestion: null,
      relatedQuestions: [],
      layout: undefined,
      showLayout: false,
      isNoResult: false,
      cancelFunction: null
    }
  },
  mounted () {
    this.fetchData()
  },
  watch: {
    '$route.query' ({ question }) {
      if (!question) return false
      this.fetchApiAsk({ question, 'bookmark_id': this.bookmarkId })
    }
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'bookmarks', 'appQuestion']),
    historyQuestionList () {
      return this.$store.state.bookmark.historyQuestionList
    }
  },
  methods: {
    fetchData () {
      let question = this.$route.query.question
      let bookmarkId = parseInt(this.$route.query.bookmarkId)
      if (question) {
        this.fetchApiAsk({ question, 'bookmark_id': bookmarkId, 'pre_question': this.historyQuestionList.length > 0 ? this.historyQuestionList[0].question : null })
      }
    },
    fetchApiAsk (data) {
      const _this = this
      this.cancelRequest()

      getPreviewQuestions(data, new axios.CancelToken(function executor (c) {
        _this.cancelFunction = c
      }))
        .then(res => {
          this.currentQuestion = res.origin
          this.relatedQuestions = res.relates
        })
    },
    cancelRequest () {
      if (typeof this.cancelFunction === 'function') {
        this.cancelFunction('cancel request')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.result-preview {
  .search-result-block {
    &.most-related {
      padding-bottom: 40px;
      margin-bottom: 80px;
      border-bottom: 1px solid #979797;
    }

    .search-result-title {
      font-size: 24px;
      line-height: 1;
      letter-spacing: 0.1em;
      color: #444444;
      margin-bottom: 16px;
    }

    .search-result-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
}
</style>
