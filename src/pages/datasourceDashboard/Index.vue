<template>
  <div class="page-index">
    <filter-info/>
    <spinner
      v-if="isLoading"
      :title="$t('resultDescription.analysisProcessing')"
      class="layout-spinner"
      size="50"
    />
    <empty-result
      v-else-if="isNoResult"
      :title="$t('editing.indexErrorTitle')"
      :description="$t('editing.indexErrorDescription')"
    />
    <preview-data-source
      v-else
      :key="dataSourceId"
    />
    <div v-if="quickStartQuestionList.length > 0">
      <quick-start
        :question-list="quickStartQuestionList"
      />
    </div>
  </div>
</template>

<script>
import FilterInfo from '@/components/display/FilterInfo'
import QuickStart from './components/QuickStart'

export default {
  name: 'PageIndex',
  components: {
    FilterInfo,
    QuickStart
  },
  data () {
    return {
      isLoading: true,
      isNoResult: false,
      dataFrameInfo: null,
      quickStartQuestionList: []
    }
  },
  computed: {
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    }
  },
  watch: {
    dataSourceId (value) {
      this.dataFrameInfo = null
      this.quickStartQuestionList = []
      this.isNoResult = false
      if (value) this.getLandingInfo()
    }
  },
  mounted () {
    // 變更 bookmark 從其他頁回到首頁的時候，如果是 null 代表如果是直接進首頁的話，會藉由 watch 觸發
    if (this.dataSourceId !== null) {
      this.getLandingInfo()
    }
  },
  methods: {
    getLandingInfo () {
      this.isLoading = true
      this.$store.commit('chatBot/updateAnalyzeStatus', true)

      this.$store.dispatch('chatBot/getQuickStartQuestion', this.dataSourceId).then(response => {
        this.isLoading = false
        this.quickStartQuestionList = response
        this.$store.commit('chatBot/updateAnalyzeStatus', false)
        this.$store.commit('chatBot/addSystemConversation',
          this.quickStartQuestionList.length > 0
            ? {text: this.$t('bot.welcomeMessageWithSuggestions'), options: response}
            : {text: this.$t('bot.welcomeMessage')}
        )
      }).catch(() => {
        this.isLoading = false
        this.$store.commit('chatBot/updateAnalyzeStatus', false)
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.page-index {
  margin: 0 auto;
}
</style>
