<template>
  <div class="result-page">
    <div class="result-question-select-block">
      <bookmark-select></bookmark-select>
      <question-select class="question-select"></question-select>
      <history-question-list></history-question-list>
    </div>
    <transition name="fade" mode="out-in">
      <result-preview
        v-if="$route.query.type === 'preview'"
      ></result-preview>
      <result-display
        v-else-if="$route.query.type === 'display'"
      ></result-display>
      <div class="search-guide-block"
        v-else
      >
        <div class="search-guide-step"
          v-for="(searchStep, index) in searchGuide"
          :key="index"
        >
          <div class="step-count">{{ index + 1 }}.</div>
          <div class="step-text">{{ searchStep.text }}</div>
          <img :src="require(`@/assets/images/result/${searchStep.img}`)" class="search-img">
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BookmarkSelect from '@/components/select/BookmarkSelect'
import QuestionSelect from '@/components/select/QuestionSelect'
import HistoryQuestionList from '@/pages/result/components/HistoryQuestionList'
import ResultDisplay from './ResultDisplay'
import ResultPreview from './ResultPreview'

export default {
  name: 'PageResult',
  components: {
    HistoryQuestionList,
    BookmarkSelect,
    QuestionSelect,
    ResultDisplay,
    ResultPreview
  },
  data () {
    return {
      searchGuide: [
        {
          text: '输入问题',
          img: 'step1.svg'
        },
        {
          text: '分析结果',
          img: 'step2.svg'
        },
        {
          text: '资料探勘',
          img: 'step3.svg'
        }
      ]
    }
  },
  created () {
    this.getQueryInfo()
    this.$store.dispatch('bookmark/init')
    this.$store.dispatch('bookmark/getHistoryQuestionList')
  },
  activated () {
    // 從個人釘板回到搜尋結果，如果有記錄先組回原有的 router path
    if (this.appQuestion && !this.$route.query.question) {
      if (this.currentResultDisplayType === 'display') {
        this.$store.dispatch('bookmark/updateResultRouter')
      } else {
        this.$store.dispatch('bookmark/updateResultPreviewRouter')
      }
    }
  },
  // 主要針對瀏覽器上下頁、從 preview 回到 searchbar 的一些處理
  watch: {
    '$route.query.type' (value) {
      if (this.$route.name === 'PageResult') {
        this.$store.commit('bookmark/setCurrentResultDisplayType', value)
      }
    },
    '$route.query.bookmarkId' (value) {
      if (this.$route.name === 'PageResult' && value) {
        this.$store.dispatch('bookmark/changeBookmarkById', parseInt(value))
      }
    },
    '$route.query.question' (value) {
      if (this.$route.name === 'PageResult') {
        this.$store.commit('bookmark/setAppQuestion', value)
      }
    }
  },
  computed: {
    ...mapGetters('bookmark', ['bookmarkId', 'bookmarks', 'appQuestion']),
    currentResultDisplayType () {
      return this.$store.state.bookmark.currentResultDisplayType
    }
  },
  methods: {
    getQueryInfo () {
      let question = this.$route.query.question
      let type = this.$route.query.type
      let bookmarkId = parseInt(this.$route.query.bookmarkId)

      if (question) {
        this.$store.commit('bookmark/setAppQuestion', question)
        this.$store.commit('bookmark/setBookmarkById', bookmarkId)
        this.$store.commit('bookmark/setCurrentResultDisplayType', type)
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

  .search-guide-block {
    display: flex;
    justify-content: space-around;

    .search-guide-step {
      width: 24.85%;
      text-align: center;

      .step-count {
        font-weight: bold;
        font-size: 44px;
        line-height: 60px;
        color: #9FC2C6;
      }
      .step-text {
        font-size: 28px;
        line-height: 39px;
        letter-spacing: 10px;
        padding-bottom: 22px;
        border-bottom: 1px solid #9FC2C6;
        margin-bottom: 40px;
      }
      .search-img {
        width: 100%;
        height: auto;
      }
    }
  }
}
</style>
