<template>
  <div class="display-group-scatter-chart">
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
import {
  colorDefault,
  colorOnly2,
  color3,
  color12
} from './common/addons'
let chartAddon = JSON.parse(JSON.stringify(chartOptions))
let groupScatterChartConfig = {
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
      color: null
    },
    data: [],
    type: 'scatter',
    large: true
  }
}

export default {
  name: 'DisplayGroupScatterChart',
  props: {
    dataset: {
      type: Object
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
      this.$set(chartAddon.xAxis, 'splitLine', groupScatterChartConfig.xAxisSplitLine)
      this.$set(chartAddon.yAxis, 'splitLine', groupScatterChartConfig.yAxisSplitLine)
      chartAddon.tooltip.trigger = groupScatterChartConfig.tooltip.trigger
      chartAddon.tooltip.formatter = params => {
        let marker = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color.colorStops[0].color};"></span>`
        return `<p>${marker}${params.value[3]}（${params.value[2]}）<br>${this.title.xAxis}： ${params.value[0]}<br>${this.title.yAxis}： ${params.value[1]}</p>`
      }
      chartAddon.xAxis.name = this.title.xAxis
      chartAddon.yAxis.name = this.title.yAxis
      groupScatterChartConfig.chartData.data = this.dataset.data
      groupScatterChartConfig.chartData.symbolSize = this.dotSize(this.dataset.data.length)
      chartAddon.color = this.colorList
      chartAddon.series = this.groupDataList.map(dataSet => {
        let chartConfig = JSON.parse(JSON.stringify(groupScatterChartConfig.chartData))
        chartConfig.data = dataSet.data
        chartConfig.name = dataSet.name
        return chartConfig
      })
      if (this.isPreview) this.previewChartSetting(chartAddon)

      return chartAddon
    },
    chartStyle () {
      return {
        width: '100%',
        height: '380px'
      }
    },
    colorList () {
      switch (this.groupDataList.length) {
        case 2:
          return colorOnly2
        case 3:
          return color3
        case 5:
        case 6:
          return colorDefault
        default:
          return color12
      }
    },
    groupDataList () {
      let dataList = []
      this.dataset.data.forEach((element, arrayIndex) => {
        let cloneElement = JSON.parse(JSON.stringify(element))
        // 將 index 對應到的名稱塞進去，為了 tooltip 的顯示
        cloneElement.push(this.dataset.index[arrayIndex])
        let hasProperty = false
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].name === cloneElement[2]) {
            dataList[i].data.push(cloneElement)
            hasProperty = true
          }
        }
        if (!hasProperty) {
          dataList.push({
            name: cloneElement[2],
            data: [cloneElement]
          })
        }
      })
      return dataList
    }
  }
}
</script>
