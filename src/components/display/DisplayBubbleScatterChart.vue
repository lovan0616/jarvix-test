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
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      maxValue: null,
      minValue: null,
      maxXaxis: null,
      maxYaxis: null
    }
  },
  methods: {
    bubbleSize (data) {
      // 先 normalize 到 1 - 10
      return  data[2]*(10 - 1)/(this.maxValue - this.minValue)*(this.maxXaxis/4)
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
      this.maxValue = -Infinity
      this.minValue = Infinity
      this.maxXaxis = -Infinity
      this.maxYaxis = -Infinity

      for (let i = 0; i < this.dataset.data.length; i++) {
        this.dataset.data[i].forEach((element, index) => {
          // 塞入資料名稱
          element[3] = this.dataset.index[index]
          // 塞入類別（組別）名稱
          element[4] = this.dataset.columns[i]
          // x軸最大值
          if (element[0] > this.maxXaxis) {
            this.maxXaxis = element[0]
          }
          // y軸最大值
          if (element[1] > this.maxYaxis) {
            this.maxYaxis = element[1]
          }
          // 資料最大值
          if (element[2] > this.maxValue) {
            this.maxValue = element[2]
          }
          // 資料最小值
          if (element[2] < this.minValue) {
            this.minValue = element[2]
          }
        })

        let config = JSON.parse(JSON.stringify(scatterBubleChartConfig))
        config.chartData.symbolSize = this.bubbleSize
        config.chartData.name = this.dataset.columns[i]
        config.chartData.itemStyle.color = this.colorList[i] || this.colorList[i % 10]
        config.chartData.data = this.dataset.data[i]

        chartAddon.series.push(config.chartData)
      }

      chartAddon.xAxis = {...chartAddon.xAxis, ...scatterBubleChartConfig.xAxis}
      chartAddon.yAxis = {...chartAddon.yAxis, ...scatterBubleChartConfig.yAxis}
      chartAddon.tooltip = scatterBubleChartConfig.tooltip

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
