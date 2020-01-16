<template>
  <div class="result-page">
    <result-display></result-display>
  </div>
</template>

<script>
import ResultDisplay from './ResultDisplay'

export default {
  name: 'PageResult',
  components: {
    ResultDisplay
  },
  data () {
    return {}
  },
  created () {
    this.getQueryInfo()
  },
  // 主要針對瀏覽器上下頁、從 preview 回到 searchbar 的一些處理
  watch: {
    '$route.query.dataSourceId' (value) {
      if (this.$route.name === 'PageResult' && value) {
        this.$store.dispatch('dataSource/changeDataSourceById', parseInt(value))
      }
    },
    '$route.query.question' (value) {
      if (this.$route.name === 'PageResult') {
        this.$store.commit('dataSource/setAppQuestion', value)
      }
    }
  },
  methods: {
    getQueryInfo () {
      let question = this.$route.query.question

      if (question) {
        this.$store.commit('dataSource/setAppQuestion', question)
      } else {
        this.$router.push('/')
      }
    }
  }
}
</script>
