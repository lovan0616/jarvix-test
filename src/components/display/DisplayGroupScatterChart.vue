<template>
  <div class="display-group-scatter-chart">
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
let groupScatterChartConfig = {
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
      chartAddon.xAxis.name = this.title.xAxis
      chartAddon.yAxis.name = this.title.yAxis
      groupScatterChartConfig.chartData.data = this.dataset.data
      groupScatterChartConfig.chartData.symbolSize = this.dotSize(this.dataset.data.length)
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
        height: '300px'
      }
    },
    groupDataList () {
      let dataList = []
      this.dataset.data.forEach(element => {
        let hasProperty = false
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].name === element[2]) {
            dataList[i].data.push(element)
            hasProperty = true
          }
        }
        if (!hasProperty) {
          dataList.push({
            name: element[2],
            data: [element]
          })
        }
      })
      return dataList
    }
  }
}
</script>
