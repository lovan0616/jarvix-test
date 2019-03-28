<template>
  <div class="result-page">
    <question-select class="result-question-select-block"
    ></question-select>
    <div class="result-layout"
      v-if="showLayout"
    >
      <section class="section-left-side">
        <recommend-question-list></recommend-question-list>
        <layout v-bind="layout"></layout>
      </section>
      <section class="section-right-side">
        <div class="seciotn-title">歷史問題</div>
        <history-question-list
          :question-list="historyQuestionList"
        ></history-question-list>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

import QuestionSelect from '@/components/QuestionSelect'
import HistoryQuestionList from '@/pages/result/components/HistoryQuestionList'
import RecommendQuestionList from '@/pages/result/components/RecommendQuestionList'
import ResultBoard from './components/ResultBoard'

export default {
  name: 'PageResult',
  components: {
    HistoryQuestionList,
    RecommendQuestionList,
    ResultBoard,
    QuestionSelect
  },
  data () {
    return {
      layout: undefined,
      showLayout: true,
      historyQuestionList: []
    }
  },
  watch: {
    '$route.query': function ({ question }) {
      this.fetchApiAsk({ question })
    }
  },
  created () {
    this.$store.dispatch('bookmark/init').then(state => {
      this.start()
    })
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'bookmarks'])
  },
  methods: {
    start () {
      let question = this.$route.query.question
      let bookmarkId = this.$route.query.bookmarkId
      if (question) {
        this.$store.commit('bookmark/setAppQuestion', question)
        this.fetchApiAsk({ question, 'bookmark_Id': bookmarkId })
      }
    },
    clearLayout () {
      this.layout = undefined
    },
    fetchApiAsk (data) {
      this.showLayout = true
      this.clearLayout()
      const path = window.env.API_ROOT_URL + 'api/ask'
      axios.post(path, data)
        .then(res => {
          this.layout = res.data.data
          this.fetchHistoryQuestionList()
        })
    },
    fetchHistoryQuestionList () {
      const path = window.env.API_ROOT_URL + 'api/ask/history'
      axios.get(path)
        .then(res => {
          this.historyQuestionList = res.data.data.history
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
