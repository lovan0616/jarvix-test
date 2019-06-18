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
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'
let chartAddon = JSON.parse(JSON.stringify(chartOptions))
let averageBarChartConfig = {
  chartData: {
    type: 'bar',
    itemStyle: {
      color: chartVariable['averageBarColor']
    },
    legendHoverLink: false,
    emphasis: {
      itemStyle: {
        color: chartVariable['averageBarColor']
      }
    },
    barMaxWidth: '18',
    markLine: {
      symbol: ['none', 'none'],
      lineStyle: {
        color: chartVariable['averageLineColor']
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
              color: element === maxValue ? chartVariable['maxValueColor'] : chartVariable['minValueColor']
            },
            emphasis: {
              itemStyle: {
                color: element === maxValue ? chartVariable['maxValueColor'] : chartVariable['minValueColor']
              }
            }
          }
        } else {
          return element
        }
      })
      averageBarChartConfig.chartData.data = seriesArray
      chartAddon.series[0] = averageBarChartConfig.chartData

      return chartAddon
    }
  }
}
</script>
