<template>
  <div class="display-average-bar-chart">
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
let chartAddon = JSON.parse(JSON.stringify(chartOptions))

function averageBarChartConfig (t) {
  return {
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
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    this.setOptions()
  },
  methods: {
    setOptions () {
      chartAddon.xAxis.data = this.dataset.index
      chartAddon.xAxis.name = this.title.xAxis
      chartAddon.yAxis.name = this.title.yAxis
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
      let config = averageBarChartConfig(this.$t)
      config.chartData.data = seriesArray
      chartAddon.series[0] = config.chartData
      if (this.isPreview) this.previewChartSetting(chartAddon)

      return chartAddon
    }
  }
}
</script>
