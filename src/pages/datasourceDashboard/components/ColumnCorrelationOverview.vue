<template>
  <section class="column-correlation">
    <spinner
      v-if="isLoading"
    ></spinner>
    <display-heat-map-chart
      :dataset="componentData.dataset"
      v-else-if="!isLoading && componentData && !hasError"
    />
    <empty-info-block
      v-else
      :msg="hasError ? $t('message.systemIsError') : $t('message.noData')"
    ></empty-info-block>
  </section>
</template>

<script>
import DisplayHeatMapChart from '@/pages/datasourceDashboard/components/DisplayHeatMapChart'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'

const dummyData = {
  data: [['apple22222222', 'apple22222222', 0.5], ['dddddddddd', 'apple22222222', 0.1], ['c', 'apple22222222', 0.4], ['d', 'apple22222222', 0.4], ['apple22222222', 'dddddddddd', 0.7], ['dddddddddd', 'dddddddddd', 0.3], ['c', 'dddddddddd', 0.2], ['d', 'dddddddddd', 0.0], ['apple22222222', 'c', 0.3], ['dddddddddd', 'c', 0.1], ['c', 'c', 0.3], ['d', 'c', 0.6], ['apple22222222', 'd', 0.9], ['dddddddddd', 'd', 0.5], ['c', 'd', 0.3], ['d', 'd', 0.6], ['apple22222222', 'e', 0.3], ['dddddddddd', 'e', 0.1], ['c', 'e', 0.3], ['d', 'e', 0.6]],
  index: [['apple22222222', 'dddddddddd', 'c', 'd'], ['apple22222222', 'dddddddddd', 'c', 'd', 'e']]
}

export default {
  components: {
    DisplayHeatMapChart,
    EmptyInfoBlock
  },
  props: {
    dataSourceTableId: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      componentData: null,
      isLoading: true,
      hasError: false
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      this.$store.dispatch('dataSource/getDataFrameColumnCorrelation', {id: this.dataSourceTableId})
        .then(response => {
          // TODO: 處理從 API 取得的資料
          this.componentData = {
            dataset: {
              data: dummyData.data,
              index: dummyData.index,
              range: [0, 1]
            }
          }
          this.isLoading = false
        })
        .catch(() => {
          this.hasError = true
          this.isLoading = false
        })
    }
  }
}
</script>
