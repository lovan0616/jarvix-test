<template>
  <div class="page-result">
    <div class="bg"></div>
    <sy-holy-grail
      :header="{ type: 'fixed' }"
      :footer="{ active: false }"
      :asideLeft="{ active: false }"
      :asideRight="{ active: false }"
    >
      <div slot="header" class="header-root">
        <div class="header-logo"
          @click="onLogoClick"
        >
          <img src="@/assets/images/synergies_logo_white.svg">
        </div>
        <sy-select class="header-right"
          theme="dark"
          :selected="bookmarkId"
          :items="bookmarks"
          placeholder="请选择bookmark"
          @update:selected="onBookmarkChange"
        ></sy-select>
      </div>
      <div class="top-area">
        <el-autocomplete class="question-input"
          ref="autocomplete"
          v-model="app_question"
          :fetch-suggestions="app_querySearch"
          :placeholder="app_question_placeholder"
          @keypress.enter.native="app_onEnterQuestion"
          @select="app_onEnterQuestion"
          prefix-icon="el-icon-search"
        ></el-autocomplete>
      </div>
      <div class="result-layout"
        v-if="showLayout"
      >
        <section class="section-left-side">
          <recommend-question-list></recommend-question-list>
          <result-board>
            <layout
              slot="ResultBoardBody"
              v-bind="layout"
            ></layout>
          </result-board>
        </section>
        <section class="section-right-side">
          <div class="seciotn-title">歷史問題</div>
          <history-question-list></history-question-list>
        </section>
      </div>
    </sy-holy-grail>
  </div>
</template>

<script>
import axios from 'axios'
import appHandleQuestion from '@/mixins/app-handle-question.js'
import SySelect from '@/components/sy/Sy-select'
import { mapGetters } from 'vuex'

import HistoryQuestionList from '@/pages/result/components/HistoryQuestionList'
import RecommendQuestionList from '@/pages/result/components/RecommendQuestionList'
import ResultBoard from './components/ResultBoard'

export default {
  name: 'PageResult',
  mixins: [
    appHandleQuestion
  ],
  components: {
    SySelect,
    HistoryQuestionList,
    RecommendQuestionList,
    ResultBoard
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
        this.app_setQuestion(question)
        this.fetchApiAsk({ question })
      }
    },
    clearLayout () {
      this.layout = undefined
    },
    onLogoClick () {
      this.$router.push('/')
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
      const path = window.env.API_ROOT_URL + 'api/history'
      axios.get(path)
        .then(res => {
          console.log(res)
          this.historyQuestionList = res.data.data
        })
    },
    onBookmarkChange (bookmarkId) {
      this.$store.dispatch('bookmark/changeBookmarkById', bookmarkId).then(state => {
        this.clearLayout()
        this.app_setQuestion('')
        this.showLayout = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
