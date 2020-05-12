<template>
  <section class="display">
    <DisplayHeatMapChartDataSet :dataset="componentData.dataset" />
  </section>
</template>
<script>
import DisplayHeatMapChartDataSet from '@/components/display/DisplayHeatMapChartDataSet'

const dummyData = [['a', 'a', 0.5], ['b', 'a', 0.1], ['c', 'a', 0.4], ['d', 'a', 0.4], ['a', 'b', 0.7], ['b', 'b', 0.3], ['c', 'b', 0.2], ['d', 'b', 0.0], ['a', 'c', 0.3], ['b', 'c', 0.1], ['c', 'c', 0.3], ['d', 'c', 0.6], ['a', 'd', 0.9], ['b', 'd', 0.5], ['c', 'd', 0.3], ['d', 'd', 0.6], ['a', 'e', 0.3], ['b', 'e', 0.1], ['c', 'e', 0.3], ['d', 'e', 0.6]]

export default {
  name: 'Trial',
  data () {
    return {
      loading: true,
      componentData: null
    }
  },
  components: {
    DisplayHeatMapChartDataSet
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.componentData = {
        dataset: {
          data: dummyData,
          index: [['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd', 'e']],
          columns: ['x 軸名稱', 'y 軸名稱'],
          range: [0, 1]
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
