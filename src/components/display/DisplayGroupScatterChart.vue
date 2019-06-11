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
      type: Object,
      default: function () {
        return {
          'columns': [
            'price',
            'cost',
            'currency'
          ],
          'index': [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
          ],
          'data': [
            [1000, 500, 'TWD'],
            [2000, 1000, 'TWD'],
            [2200, 2300, 'USD'],
            [4100, 5000, 'USD'],
            [4321, 3100, 'RUB'],
            [1900, 4500, 'RUB'],
            [800, 670, 'TWD'],
            [120, 4000, 'AED'],
            [9800, 2000, 'YER'],
            [6700, 8900, 'GTQ'],
            [1200, 2300, 'PYG'],
            [4100, 5000, 'USD'],
            [4321, 3100, 'RUB'],
            [1900, 4500, 'RUB'],
            [800, 670, 'TWD'],
            [120, 4000, 'AED'],
            [9800, 2000, 'YER'],
            [9800, 2000, 'YER'],
            [6700, 8900, 'GTQ'],
            [1200, 2300, 'PYG'],
            [9800, 2000, 'YER']
          ]
        }
      }
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
      chartAddon.tooltip = groupScatterChartConfig.tooltip
      chartAddon.xAxis.name = this.dataset.columns[0]
      chartAddon.yAxis.name = this.dataset.columns[1]
      groupScatterChartConfig.chartData.data = this.dataset.data
      groupScatterChartConfig.chartData.symbolSize = this.dotSize(this.dataset.data.length)
      chartAddon.series = this.groupDataList.map(dataSet => {
        let chartConfig = JSON.parse(JSON.stringify(groupScatterChartConfig.chartData))
        chartConfig.data = dataSet.data
        chartConfig.name = dataSet.name
        return chartConfig
      })

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
