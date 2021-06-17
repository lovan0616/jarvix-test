<template>
  <div class="page-index">
    <preview-data-source
      :key="dataSourceId"
      mode="display"
    />
  </div>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      isLoading: false
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
  created() {
    if (this.dataSourceId !== null) {
      let { dataSourceId, dataFrameId } = this.$route.query
      if (!dataSourceId || !dataFrameId) this.updateUrl()
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
          })
        }
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
