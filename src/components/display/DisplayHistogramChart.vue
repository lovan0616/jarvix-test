<template>
  <div class="display-histogram-chart">
    <echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    >
    </echart>
  </div>
</template>
<script>
import ecStat from 'echarts-stat'
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'
let chartAddon = JSON.parse(JSON.stringify(chartOptions))
// 直方圖的參數設定
let histogramChartConfig = {
  xAxis: {
    type: 'value',
    min: null,
    max: null,
    interval: null,
    splitLine: {
      show: false
    }
  },
  chartData: {
    symbolSize: 8,
    itemStyle: {
      color: chartVariable['basicChartColor']
    },
    data: [],
    type: 'custom',
    label: {
      normal: {
        show: true,
        position: 'insideTop'
      }
    },
    renderItem: null,
    large: true,
    encode: {
      x: [0, 1],
      y: 2,
      tooltip: 2,
      label: 2
    }
  }
}

export default {
  name: 'DisplayHistogramChart',
  props: {
    dataset: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    renderItem (params, api) {
      let yValue = api.value(2)
      let start = api.coord([api.value(0), yValue])
      let size = api.size([api.value(1) - api.value(0), yValue])
      let style = api.style()

      return {
        type: 'rect',
        shape: {
          x: start[0] + 1,
          y: start[1],
          width: size[0] - 2,
          height: size[1]
        },
        style: style
      }
    }
  },
  computed: {
    chartData () {
      let interval
      let min = Infinity
      let max = -Infinity
      let bins = ecStat.histogram(this.dataset.data)
      let chartData = bins.data.map((item, index) => {
        let x0 = bins.bins[index].x0
        let x1 = bins.bins[index].x1
        interval = x1 - x0
        min = Math.min(min, x0)
        max = Math.max(max, x1)
        return [x0, x1, item[1]]
      })

      // set histogram xAxis
      chartAddon.xAxis = {...chartAddon.xAxis, ...histogramChartConfig.xAxis}
      chartAddon.yAxis = {...chartAddon.yAxis, ...histogramChartConfig.yAxis}
      chartAddon.xAxis.interval = interval
      chartAddon.xAxis.min = min
      chartAddon.xAxis.max = max
      chartAddon.xAxis.name = this.dataset.columns[0]

      return chartData
    },
    chartOption () {
      histogramChartConfig.chartData.renderItem = this.renderItem
      histogramChartConfig.chartData.data = this.chartData
      chartAddon.series[0] = histogramChartConfig.chartData

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