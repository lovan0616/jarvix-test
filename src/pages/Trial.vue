<template>
  <!-- <component
        :is="componentName"
        :has-pagination="hasNextPage"
        :dataset="componentData.dataset"
        :title="componentData.title"
        :message="componentData.message"
        :segmentation="componentData.segmentation"
        :info="componentData.info || componentData.data"
        :features="componentData.features"
        :confidence="componentData.confidence"
        :formula="componentData.ax_b"
        :text="componentData.text"
        :chart-data="componentData.chart_data"
        :notes="componentData.notes"
        :causes="componentData.causes"
        :description="componentData.description"
        :total="componentData.total"
        @next="getNewPageInfo"
      ></component> -->
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
      resultId: null,
      diagram: null,
      loading: true,
      componentName: null,
      componentData: null,
      isError: false,
      errorMessage: '',
      notes: [],
      timeoutFunction: null,
      pagination: {
        currentPage: 0,
        totalPages: 1
      },
      isGetPagination: false,
      // 是否有下一頁資料
      hasNextPage: false,
      maxDataLengthPerPage: 200
    }
  },
  components: {
    DisplayHeatMapChartDataSet
  },
  mounted () {
    this.fetchData()
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
  },
  methods: {
    fetchData () {
      this.componentData = {
        dataset: {
          data: dummyData,
          index: [['a', 'b', 'c', 'd'], ['a', 'b', 'c', 'd', 'e']],
          columns: ['x 軸名稱', 'y 軸名稱']
        }
      }
    },
    getNewPageInfo () {
      this.pagination.currentPage += 1
      this.fetchData()
    },
    appendNote (note) {
      this.notes.push(note)
    },
    genSamplingNote (randomLimit) {
      return this.$t('resultNote.samplingNote', {randomLimit})
    },
    genGroupLimitNote (randomLimit) {
      return this.$t('resultNote.groupLimitNote', {randomLimit})
    }
  }
}
</script>
<style lang="scss" scoped>
.task {
  position: relative;
  width: 100%;

  .task-note {
    &::before {
      content: '#';
    }
    color: #A7A7A7;
    font-size: 12px;
  }

  // pagination 遮罩
  &.task-mask {
    position: relative;
    background: repeating-linear-gradient(to right, rgba(34, 64, 68, 0) 0%, rgba(34, 64, 68, 1) 50%, rgba(34, 64, 68, 0) 100%);
    width: 100%;
    background-size: 200% auto;
    background-position: 0 100%;
    animation: gradient 1s infinite;
    animation-fill-mode: forwards;
    animation-timing-function: linear;

    @keyframes gradient {
      0%   { background-position: 0 0; }
      100% { background-position: -200% 0; }
    }
  }
}
</style>
