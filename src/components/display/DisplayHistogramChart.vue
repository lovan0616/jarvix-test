<template>
  <div class="display-histogram-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    >
    </v-echart>
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
      color: chartVariable['lightestChartColor']
    },
    data: [],
    type: 'custom',
    label: {},
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

      let newData = this.dataset.data.map(element => {
        return element[1]
      })

      let bins = ecStat.histogram(newData, 'sturges')
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
      chartAddon.xAxis.interval = interval
      chartAddon.xAxis.min = min
      chartAddon.xAxis.max = max
      chartAddon.xAxis.name = this.title.y_title.display_name
      chartAddon.yAxis = {...chartAddon.yAxis, ...histogramChartConfig.yAxis}
      chartAddon.yAxis.name = 'count'

      if (this.isPreview) this.previewChartSetting(chartAddon)

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
