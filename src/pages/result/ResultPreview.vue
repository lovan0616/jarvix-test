<template>
  <div class="result-preview"
    v-loading="isLoading"
  >
    <div class="serch-result-container"
      v-if="!isLoading"
    >
      <div class="empty-result"
        v-if="isNoMainResult"
      >
        <img class="empty-result-img"
          src="../../assets/images/result/no-main-result.svg"
          alt="未能找到最相关结果"
        >
        <div class="empty-result-text">未能找到最相关结果</div>
      </div>
      <div class="search-result-block most-related"
        v-else
      >
        <div class="search-result-title">最相关结果</div>
        <div class="search-result-list">
          <preview-result-board class="result-board"
            v-if="currentQuestion"
            :question="currentQuestion"
            @remove="noMainResult"
          ></preview-result-board>
        </div>
      </div>
      <div class="search-result-block">
        <div class="search-result-title">其他结果</div>
        <div class="search-result-list">
          <preview-result-board class="result-board"
            v-for="(question, index) in relatedQuestions"
            :key="question + index"
            :index="index"
            :question="question"
            @remove="removeQuestion"
          ></preview-result-board>
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
import PreviewResultBoard from '@/components/PreviewResultBoard'

export default {
  name: 'ResultPreview',
  components: {
    EmptyResult,
    PreviewResultBoard
  },
  data () {
    return {
      currentQuestion: null,
      relatedQuestions: [],
      layout: undefined,
      showLayout: false,
      isNoResult: false,
      cancelFunction: null,
      isLoading: false,
      isNoMainResult: false
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
      this.isLoading = true
      this.isNoMainResult = false

      getPreviewQuestions(data, new axios.CancelToken(function executor (c) {
        _this.cancelFunction = c
      }))
        .then(res => {
          this.currentQuestion = res.origin
          this.relatedQuestions = res.relates
          this.isLoading = false
          this.$store.dispatch('bookmark/getHistoryQuestionList')
        })
        .catch(() => {
          // 會遇到沒拿到資訊的時候，所以要將問題清空
          this.currentQuestion = null
          this.relatedQuestions = null
          this.isLoading = false
        })
    },
    cancelRequest () {
      if (typeof this.cancelFunction === 'function') {
        this.cancelFunction('cancel request')
      }
    },
    removeQuestion (index) {
      this.relatedQuestions.splice(index, 1)
    },
    noMainResult () {
      this.isNoMainResult = true
    }
  }
}
</script>
<style lang="scss" scoped>
.result-preview {
  min-height: 100px;

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
      margin-bottom: 16px;
    }

    .search-result-list {
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
  .empty-result {
    width: 100%;
    text-align: center;
    margin-bottom: 48px;

    .empty-result-img {
      width: 170px;
      height: auto;
      margin-bottom: 24px;
    }
    .empty-result-text {
      font-size: 18px;
      line-height: 26px;
    }
  }
}
</style>
