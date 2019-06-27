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
import { colorOnly1, colorOnly2, color3, color10 } from './common/addons'
import { chartOptions } from '@/components/display/common/chart-addon.js'
let chartAddon = JSON.parse(JSON.stringify(chartOptions))
let scatterBubleChartConfig = {
  tooltip: {
    trigger: 'item'
  },
  xAxis: {
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  yAxis: {
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    scale: true
  },
  chartData: {
    name: null,
    type: 'scatter',
    large: true,
    symbolSize: null,
    label: {
      emphasis: {
        show: true,
        formatter (param) {
          return param.data[3]
        },
        position: 'top'
      }
    },
    itemStyle: {
      color: null
    },
    data: []
  }
}

export default {
  name: 'DisplayBubbleScatterChart',
  props: {
    dataset: {
      type: Object
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    colorList () {
      switch (this.dataset.data.length) {
        case 1:
          return colorOnly1
        case 2:
          return colorOnly2
        case 3:
          return color3
        default:
          return color10
      }
    },
    chartOption () {
      chartAddon.series = []
      let maxValue = -Infinity
      let minValue = Infinity
      let maxXaxis = -Infinity
      let maxYaxis = -Infinity

      for (let i = 0; i < this.dataset.data.length; i++) {
        this.dataset.data[i].forEach((element, index) => {
          // 塞入資料名稱
          element[3] = this.dataset.index[index]
          // 塞入類別（組別）名稱
          element[4] = this.dataset.columns[i]
          // x軸最大值
          maxXaxis = Math.max(maxXaxis, element[0])
          // y軸最大值
          maxYaxis = Math.max(maxYaxis, element[1])
          // 資料最大值
          maxValue = Math.max(maxValue, element[2])
          // 資料最小值
          minValue = Math.min(minValue, element[2])
        })

        let config = JSON.parse(JSON.stringify(scatterBubleChartConfig))
        config.chartData.symbolSize = function (data) {
          // 先 normalize 到 1 - 10
          return data[2] * (10 - 1) / (maxValue - minValue) * (maxXaxis / 4)
        }
        config.chartData.label.emphasis.formatter = function (param) {
          return param.data[3]
        }
        config.chartData.name = this.dataset.columns[i]
        config.chartData.itemStyle.color = this.colorList[i] || this.colorList[i % 10]
        config.chartData.data = this.dataset.data[i]

        chartAddon.series.push(config.chartData)
      }
      chartAddon.xAxis = {...chartAddon.xAxis, ...scatterBubleChartConfig.xAxis}
      chartAddon.yAxis = {...chartAddon.yAxis, ...scatterBubleChartConfig.yAxis}
      chartAddon.tooltip.trigger = scatterBubleChartConfig.tooltip.trigger
      if (this.isPreview) this.previewChartSetting(chartAddon)

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
