<template>
  <div class="result-page">
    <result-display/>
  </div>
</template>

<script>
import ResultDisplay from './ResultDisplay'
import { mapGetters } from 'vuex'

export default {
  name: 'PageResult',
  components: {
    ResultDisplay
  },
  computed: {
    ...mapGetters('userManagement', ['getCurrentGroupId'])
  },
  // 主要針對瀏覽器上下頁、從 preview 回到 searchbar 的一些處理
  watch: {
    '$route.query.dataSourceId': {
      immediate: true,
      handler: function (value) {
        if (this.$route.name === 'PageResult' && value) {
          this.$store.dispatch('dataSource/changeDataSourceById', {
            dataSourceId: parseInt(value),
            dataFrameId: this.$route.query.dataFrameId === 'all' ? 'all' : parseInt(this.$route.query.dataFrameId)
          })
        }
      }
    },
    '$route.query.dataFrameId'(value) {
      if (this.$route.name === 'PageResult' && value) {
        const dataFrameId = value === 'all' ? 'all' : parseInt(value)
        this.$store.dispatch('dataSource/changeDataFrameById', dataFrameId)
      }
    },
    '$route.query.question': {
      immediate: true,
      handler: function (value) {
        if (this.$route.name === 'PageResult') {
          this.$store.commit('dataSource/setAppQuestion', value)
        }
      }
    }
  },
  // 暫時用來處理使用者切換群組後點擊上一頁或直接輸入連結
  // beforeRouteEnter: function (to, from, next) {
  //   const groupId = to.query.groupId
  //   const currentGroupId = store.getters['userManagement/getCurrentGroupId']
  //   if (!currentGroupId || (groupId && (groupId.toString() !== currentGroupId.toString()))) { return next('/') }
  //   next()
  // },
  created () {
    this.getQueryInfo()
  },
  methods: {
    getQueryInfo () {
      let question = this.$route.query.question
      if (question) {
        this.$store.commit('dataSource/setAppQuestion', question)
      } else {
        const groupId = this.$route.params.group_id
        this.$router.push({ name: 'PageIndex', params: { 'group_id': groupId } })
      }
    }
  }
}
</script>
