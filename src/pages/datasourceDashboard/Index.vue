<template>
  <div class="page-index">
    <filter-info/>
    <preview-data-source
      :key="dataSourceId"
    />
    <quick-start
      v-if="quickStartQuestionList.length > 0"
      :question-list="quickStartQuestionList"
    />
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
      isLoading: false,
      quickStartQuestionList: []
    }
  },
  computed: {
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    dataFrameId () {
      return this.$store.state.dataSource.dataFrameId
    }
  },
  watch: {
    dataFrameId (newValue, oldValue) {
      this.quickStartQuestionList = []
      if (newValue && (newValue !== oldValue)) {
        this.getQuickQuestionList()
        this.updateUrl()
      }
    }
  },
  created() {
    if (this.dataSourceId !== null) {
      let {dataSourceId, dataFrameId} = this.$route.query
      if (!dataSourceId || !dataFrameId) this.updateUrl()
    }
  },
  mounted () {
    // 變更 bookmark 從其他頁回到首頁的時候，如果是 null 代表如果是直接進首頁的話，會藉由 watch 觸發
    if (this.dataSourceId !== null) {
      this.getQuickQuestionList()
    }
  },
  methods: {
    updateUrl () {
      let {dataSourceId: queryDataSourceId, dataFrameId: queryDataFrameId} = this.$route.query
      // 無值補值 ＆ 避免前往相同路徑
      if (
        queryDataSourceId && queryDataFrameId 
        && (String(queryDataSourceId) ===  String(this.dataSourceId)) 
        && (String(queryDataFrameId) === String(this.dataFrameId))
      ) return
      this.$router.replace({
        query: {
          dataSourceId: this.dataSourceId,
          dataFrameId: this.dataFrameId
        }
      })
    },
    getQuickQuestionList () {
      this.isLoading = true
      this.$store.dispatch('chatBot/getQuickStartQuestion', this.dataSourceId)
      .then(response => {
        this.quickStartQuestionList = response
        this.isLoading = false
      }).catch(() => {
        this.isLoading = false
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
