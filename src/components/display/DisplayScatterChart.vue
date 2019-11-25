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

let tooltipFormatterWrapper = function ({xAxis, yAxis}) {
  return function (params, ticket, callback) {
    return params.reduce((res, item, index) => {
      return `
        ${xAxis}: ${item.data[0]}<br/>
        ${yAxis}: ${item.data[1]}<br/>
      `
    }, '')
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
    },
    formula: {
      type: Object,
      default: null
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
      let scatterOptions = JSON.parse(JSON.stringify(scatterChartConfig))
      this.$set(chartAddon.xAxis, 'splitLine', scatterOptions.xAxisSplitLine)
      this.$set(chartAddon.yAxis, 'splitLine', scatterOptions.yAxisSplitLine)
      chartAddon.tooltip.formatter = tooltipFormatterWrapper(this.title)
      chartAddon.xAxis.name = this.title.xAxis
      chartAddon.yAxis.name = this.title.yAxis
      scatterOptions.chartData.data = this.dataset.data
      scatterOptions.chartData.symbolSize = this.dotSize(this.dataset.data.length)
      chartAddon.series[0] = scatterOptions.chartData

      if (this.formula) {
        let gradient = (this.formula.a).toFixed(4)
        let offset = (this.formula.b).toFixed(4)
        let expression = `y = ${gradient}x + ${offset}`

        var markLineOpt = {
          label: {
            normal: {
              formatter: expression,
              textStyle: {
                align: 'right'
              }
            }
          },
          lineStyle: {
            normal: {
              type: 'solid',
              color: chartVariable['theme-color']
            }
          },
          tooltip: {
            formatter: expression
          },
          symbol: 'none',
          data: [
            [
              {
                name: expression,
                type: 'min'
              },
              {
                type: 'max'
              }
            ]
          ]
        }

        chartAddon.series[0].markLine = markLineOpt
      }

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
