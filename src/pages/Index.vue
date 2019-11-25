<template>
  <div class="page-index">
    <spinner class="layout-spinner"
      v-if="isLoading"
      :title="$t('resultDescription.analysisProcessing')"
      size="50"
    ></spinner>
    <empty-result
      v-else-if="isNoResult"
      :title="$t('editing.indexErrorTitle')"
      :description="$t('editing.indexErrorDescription')"
    ></empty-result>
    <div v-if="quickStartQuestionList.length > 0">
      <quick-start
        :question-list="quickStartQuestionList"
      ></quick-start>
    </div>
  </div>
</template>

<script>
import { askQuestion } from '@/API/NewAsk'
import { getDataPreviewSample } from '@/API/Bookmark'

export default {
  name: 'PageIndex',
  data () {
    return {
      isLoading: false,
      isNoResult: false,
      layout: null,
      quickStartQuestionList: []
    }
  },
  mounted () {
    this.$store.commit('updateChatRoomStatus', true)
    // 變更 bookmark 從其他頁回到首頁的時候，如果是 null 代表如果是直接進首頁的話，會藉由 watch 觸發
    if (this.dataSourceId !== null) {
      this.getLandingInfo()
    }
  },
  computed: {
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    }
  },
  methods: {
    getLandingInfo () {
      this.isLoading = true
      this.$store.commit('chatBot/updateAnalyzeStatus', true)
      askQuestion({'question': null, 'dataSourceId': this.dataSourceId}).then(res => {
        this.isLoading = false
        this.quickStartQuestionList = res.quickQuestionList
        this.$store.commit('chatBot/updateAnalyzeStatus', false)
        this.$store.commit('chatBot/addSystemConversation', res.quickQuestionList)
      }).catch(() => {
        this.isLoading = false
        this.isNoResult = true
        this.$store.commit('chatBot/updateAnalyzeStatus', false)
      })
      this.getPreviewBookmark()
    },
    getPreviewBookmark () {
      getDataPreviewSample(this.dataSourceId).then(response => {
        console.log(response)
      })
    }
  },
  watch: {
    dataSourceId (value) {
      if (!value) return
      this.layout = null
      this.isNoResult = false
      this.getLandingInfo()
    }
  }
}
</script>
<style lang="scss" scoped>
.page-index {
  margin: 0 auto;
}
</style>
