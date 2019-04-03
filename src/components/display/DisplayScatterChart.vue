<template>
  <div class="display-scatter-chart">
    <echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    >
    </echart>
  </div>
</template>
<script>
import { chartOptions } from '@/components/display/common/chart-addon.js'
let chartAddon = JSON.parse(JSON.stringify(chartOptions))
let scatterChartConfig = {
  tooltip: {
    trigger: 'item'
  },
  xAxisSplitLine: {
    show: false
  },
  yAxisSplitLine: {
    lineStyle: {
      type: 'dashed'
    }
  },
  chartData: {
    symbolSize: 8,
    itemStyle: {
      color: '#3F5669'
    },
    data: [],
    type: 'scatter'
  }
}

export default {
  name: 'DisplayScatterChart',
  props: {
    dataset: {
      type: Object,
      default: null
    }
  },
  mounted () {
    this.setOptions()
  },
  methods: {
    setOptions () {
      this.$set(chartAddon.xAxis, 'splitLine', scatterChartConfig.xAxisSplitLine)
      this.$set(chartAddon.yAxis, 'splitLine', scatterChartConfig.yAxisSplitLine)
      chartAddon.tooltip = scatterChartConfig.tooltip
    },
    dotSize (dataLength) {
      if (dataLength > 500 && dataLength < 1999) {
        return 4
      } else if (dataLength > 1999 && dataLength < 4999) {
        return 2
      } else if (dataLength > 4999) {
        return 1
      } else {
        return 8
      }
    }
  },
  computed: {
    chartOption () {
      chartAddon.xAxis.name = this.dataset.columns[0]
      chartAddon.yAxis.name = this.dataset.columns[1]
      scatterChartConfig.chartData.data = this.dataset.data
      scatterChartConfig.chartData.symbolSize = this.dotSize(this.dataset.data.length)
      chartAddon.series[0] = scatterChartConfig.chartData

      return chartAddon
    },
    chartStyle () {
      return {
        width: '100%',
        height: '300px'
      }
    }
  }
}
</script>
