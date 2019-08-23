<template>
  <div class="display-scatter-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    >
    </v-echart>
  </div>
</template>
<script>
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'
let scatterChartConfig = {
  tooltip: {
    trigger: 'item'
  },
  xAxisSplitLine: {
    show: false
  },
  yAxisSplitLine: {
    lineStyle: {
      type: 'dashed',
      color: chartVariable['splitLineColor']
    }
  },
  chartData: {
    symbolSize: 8,
    itemStyle: {
      color: chartVariable['lightestChartColor']
    },
    data: [],
    type: 'scatter',
    large: true
  },
  isPreview: {
    type: Boolean,
    default: false
  }
}

export default {
  name: 'DisplayScatterChart',
  props: {
    dataset: {
      type: Object,
      default: null
    },
    title: {
      type: Object,
      default: () => {
        return {
          xAxis: null,
          yAxis: null
        }
      }
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  methods: {
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
      let chartAddon = JSON.parse(JSON.stringify(chartOptions))
      this.$set(chartAddon.xAxis, 'splitLine', scatterChartConfig.xAxisSplitLine)
      this.$set(chartAddon.yAxis, 'splitLine', scatterChartConfig.yAxisSplitLine)
      chartAddon.tooltip.trigger = scatterChartConfig.tooltip.trigger
      chartAddon.xAxis.name = this.dataset.xAxis
      chartAddon.yAxis.name = this.dataset.yAxis
      scatterChartConfig.chartData.data = this.dataset.data
      scatterChartConfig.chartData.symbolSize = this.dotSize(this.dataset.data.length)
      chartAddon.series[0] = scatterChartConfig.chartData

      if (this.isPreview) this.previewChartSetting(chartAddon)

      return chartAddon
    },
    chartStyle () {
      return {
        width: '100%',
        height: this.isPreview ? '200px' : '380px'
      }
    }
  }
}
</script>
