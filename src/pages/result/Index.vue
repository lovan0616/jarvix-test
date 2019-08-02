<template>
  <div class="result-page">
    <div class="result-question-select-block">
      <question-select class="question-select"></question-select>
    </div>
    <result-display></result-display>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import QuestionSelect from '@/components/select/QuestionSelect'
import ResultDisplay from './ResultDisplay'

export default {
  name: 'PageResult',
  components: {
    QuestionSelect,
    ResultDisplay
  },
  data () {
    return {}
  },
  created () {
    this.getQueryInfo()
    this.$store.dispatch('bookmark/init')
    this.$store.dispatch('bookmark/getHistoryQuestionList')
  },
  mounted () {
    // 如果 bookmark 切換時，畫面還原成空狀態
    this.$store.watch(
      (state, getters) => getters['bookmark/bookmarkId'],
      () => {
        this.$store.commit('bookmark/setAppQuestion', null)
        this.$router.replace({
          router: {}
        })
      }
    )
  },
  activated () {
    // 從個人釘板回到搜尋結果，如果有記錄先組回原有的 router path
    if (this.appQuestion && !this.$route.query.question) {
      this.$store.dispatch('bookmark/updateResultRouter')
    }
  },
  // 主要針對瀏覽器上下頁、從 preview 回到 searchbar 的一些處理
  watch: {
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
    ...mapGetters('bookmark', ['bookmarkId', 'appQuestion'])
  },
  methods: {
    getQueryInfo () {
      let question = this.$route.query.question
      let bookmarkId = parseInt(this.$route.query.bookmarkId)

      if (question) {
        this.$store.commit('bookmark/setAppQuestion', question)
        this.$store.dispatch('bookmark/changeBookmarkById', bookmarkId)
      } else {
        this.$router.push('/')
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
