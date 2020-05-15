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
import { chartOptions } from '@/components/display/common/chart-addon.js'

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
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: '#4CE2F0'
        }, {
          offset: 1, color: '#438AF8'
        }],
        global: false
      }
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
  name: 'DisplayComputedHistogramChart',
  props: {
    dataset: {
      type: Object,
      default () {
        return {}
      }
    },
    title: {
      type: Object,
      default () {
        return ({
          xAxis: {
            name: ''
          },
          yAxis: {
            name: ''
          }
        })
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
    chartOption () {
      let histogramConfig = JSON.parse(JSON.stringify(histogramChartConfig))
      let chartAddon = JSON.parse(JSON.stringify(chartOptions()))

      let min = this.dataset.range[0]
      let max = this.dataset.range[1]
      let dataLength = this.dataset.data.length
      let interval = this.floatSub(max, min) / dataLength
      let chartData = this.dataset.data.map((element, index) => {
        return [
          this.floatAdd(min, interval * index), this.floatAdd(min, interval * (index + 1)), element
        ]
      })

      delete chartAddon.toolbox
      delete chartAddon.legend

      // set histogram xAxis
      chartAddon.xAxis = {...chartAddon.xAxis, ...histogramConfig.xAxis}
      chartAddon.xAxis.interval = interval
      chartAddon.xAxis.min = min
      chartAddon.xAxis.max = max
      chartAddon.xAxis.axisLabel.rotate = 0
      chartAddon.xAxis.axisLabel.showMinLabel = true
      chartAddon.xAxis.axisLabel.showMaxLabel = true
      chartAddon.xAxis.axisLine.show = false
      const shortenNumberMethod = this.shortenNumber
      chartAddon.xAxis.axisLabel.formatter = function (value, index) {
        if (!index || index === dataLength) return shortenNumberMethod(value, 2)
      }

      // set histogram yAxis
      chartAddon.yAxis = {...chartAddon.yAxis, ...histogramConfig.yAxis}
      chartAddon.yAxis.scale = false
      chartAddon.yAxis.splitLine = { show: false }
      chartAddon.yAxis.axisLabel.show = false

      chartAddon.grid = {
        top: 0,
        bottom: 20
      }

      // const axisName = this.title
      // chartAddon.tooltip.formatter = function (params, ticket, callback) {
      //   return `${axisName.xAxis.name}: ${params[0].data[0]} <br> ${axisName.yAxis.name}: ${params[0].data[2]}`
      // }

      histogramConfig.chartData.renderItem = this.renderItem
      histogramConfig.chartData.data = chartData
      chartAddon.series[0] = histogramConfig.chartData
      return chartAddon
    },
    chartStyle () {
      return {
        width: '100%',
        height: '126px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.display-histogram-chart {
  overflow: hidden;
}
</style>
