<template>
  <div class="display-average-bar-chart">
    <echart
      :style="chartStyle"
      :options="chartOptions"
      auto-resize
    >
    </echart>
  </div>
</template>

<script>
import chartAddon from '@/components/display/common/chart-addon.js'
let scatterChartConfig = {
  chartData: {
    type: 'bar',
    itemStyle: {
      color: '#E0E0E0'
    },
    legendHoverLink: false,
    emphasis: {
      itemStyle: {
        color: '#E0E0E0'
      }
    },
    barMaxWidth: '18',
    markLine: {
      symbol: ['none', 'none'],
      lineStyle: {
        color: '#006464'
      },
      data: [
        {
          type: 'average',
          name: '平均值',
          symbol: 'none',
          label: {
            position: 'start',
            formatter: 'AVG'
          }
        }
      ]
    }
  }
}

export default {
  name: 'DisplayAverageBarChart',
  props: {
    dataset: { type: Object, default: () => ([]) }
  },
  mounted () {
    this.setOptions()
  },
  methods: {
    setOptions () {
      chartAddon.xAxis.data = this.dataset.index
      // chartAddon.yAxis.name = this.dataset.columns
    }
  },
  computed: {
    chartStyle () {
      return {
        width: '100%',
        height: '280px'
      }
    },
    chartOptions () {
      let seriesArray = this.dataset.data.map(element => {
        return element[0]
      })
      let minValue = Math.min(...seriesArray)
      let maxValue = Math.max(...seriesArray)

      seriesArray = seriesArray.map(element => {
        if (element === maxValue || element === minValue) {
          return {
            value: element,
            itemStyle: {
              color: element === maxValue ? '#09B8C3' : '#F1616D'
            },
            emphasis: {
              itemStyle: {
                color: element === maxValue ? '#09B8C3' : '#F1616D'
              }
            }
          }
        } else {
          return element
        }
      })
      scatterChartConfig.chartData.data = seriesArray
      chartAddon.series[0] = scatterChartConfig.chartData

      return chartAddon
    }
  }
}
</script>
