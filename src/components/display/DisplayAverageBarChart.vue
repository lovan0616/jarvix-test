<template>
  <div class="display-average-bar-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    />
  </div>
</template>

<script>
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'

function averageBarChartConfig (t) {
  return {
    chartData: {
      type: 'bar',
      itemStyle: {
        color: chartVariable.averageBarColor
      },
      legendHoverLink: false,
      emphasis: {
        itemStyle: {
          color: chartVariable.averageBarColor
        }
      },
      barMaxWidth: '18',
      markLine: {
        symbol: ['none', 'none'],
        lineStyle: {
          color: chartVariable.averageLineColor
        },
        data: [
          {
            type: 'average',
            name: t('aggregatedValue.mean'),
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
}

export default {
  name: 'DisplayAverageBarChart',
  props: {
    dataset: { type: Object, default: () => ([]) },
    title: {
      type: Object,
      default: () => {
        return {
          xAxis: null,
          yAxis: null
        }
      }
    }
  },
  computed: {
    chartStyle () {
      return {
        width: '100%',
        height: '280px'
      }
    },
    chartOption () {
      let chartAddon = JSON.parse(JSON.stringify(chartOptions()))
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
              color: element === maxValue ? chartVariable.maxValueColor : chartVariable.minValueColor
            },
            emphasis: {
              itemStyle: {
                color: element === maxValue ? chartVariable.maxValueColor : chartVariable.minValueColor
              }
            }
          }
        } else {
          return element
        }
      })
      let config = averageBarChartConfig(this.$t)
      config.chartData.data = seriesArray
      chartAddon.series[0] = config.chartData
      chartAddon.xAxis.data = this.dataset.index
      chartAddon.xAxis.name = this.title.xAxis[0].display_name
      chartAddon.yAxis.name = this.title.yAxis[0].display_name

      return chartAddon
    }
  }
}
</script>
