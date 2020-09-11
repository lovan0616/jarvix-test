<template>
  <div class="page-index">
    <preview-data-source
      :key="dataSourceId"
      mode="display"
    />
    <quick-start
      v-if="quickStartQuestionList.length > 0"
      :question-list="quickStartQuestionList"
    />
  </div>
</template>

<script>
import QuickStart from './components/QuickStart'
import { mapGetters } from 'vuex'

export default {
  name: 'PageIndex',
  components: {
    QuickStart
  },
  data () {
    return {
      isLoading: false,
      quickStartQuestionList: []
    }
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId']),
    ...mapGetters('dataFrameAdvanceSetting', ['askCondition']),
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    dataFrameId () {
      return this.$store.state.dataSource.dataFrameId
    }
  },
  watch: {
    dataFrameId (newValue) {
      this.quickStartQuestionList = []
      if (newValue) this.getQuickQuestionList()
    },
    askCondition: {
      deep: true,
      handler (newValue, oldValue) {
        if (
          // 初次開啟設定時不觸發
          (oldValue.isInit === false && oldValue.columnList === null) 
          // 切換 dataframe 清空設定時不觸發
          || newValue.isInit === false
        ) return
        this.getQuickQuestionList()
      }
    }
  },
  created() {
    if (this.dataSourceId !== null) {
      let { dataSourceId, dataFrameId } = this.$route.query
      if (!dataSourceId || !dataFrameId) this.updateUrl()
    }
  },
  mounted () {
    // 變更 dataSource 從其他頁回到首頁的時候，如果是 null 代表如果是直接進首頁的話，會藉由 watch 觸發
    if (this.dataSourceId !== null) {
      this.getQuickQuestionList()
    }
  },
  methods: {
    updateUrl () {
      let { dataSourceId: queryDataSourceId, dataFrameId: queryDataFrameId } = this.$route.query
      let { account_id, group_id } = this.$route.params
      // Watch 在切換 datasource / dataframe 時會觸發＆從連結進來 init 階段改變 datasource / dataframe 也會觸發
      // 需要判定 1：Store 有值但 url query 上沒有時，補上 query string
      // 需要判定 2：init 改變觸發時，需要確認是否跟當前 url 上 query 相同，避免前往相同路徑（一般切換則不影響）
      if (
        queryDataSourceId && queryDataFrameId 
        && (String(queryDataSourceId) ===  String(this.dataSourceId)) 
        && (String(queryDataFrameId) === String(this.dataFrameId))
      ) return


      // 當前無 datasource 時，去除 query string
      this.$router.replace({
        name: 'PageIndex',
        params: {
          account_id,
          group_id
        },
        query: {
          ...(this.dataSourceId && { 
            dataSourceId: this.dataSourceId,
            dataFrameId: this.dataFrameId
          }),
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
