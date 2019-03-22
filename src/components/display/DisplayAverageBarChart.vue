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
export default {
  name: 'DisplayAverageBarChart',
  props: {
    dataset: { type: Object, default: () => ([]) }
  },
  data () {
    return {
      options: {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          // name: '地區',
          nameLocation: 'middle',
          nameGap: 40,
          nameTextStyle: {
            fontWeight: 'bold',
            fontSize: 16,
            color: '#444'
          },
          data: [],
          axisLabel: {
            rotate: 45,
            color: '#979797'
          },
          // 刻度
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          // name: '(1000RMB)價格',
          nameGap: 58,
          nameLocation: 'middle',
          nameTextStyle: {
            fontWeight: 'bold',
            fontSize: 16,
            color: '#444'
          },
          axisLabel: {
            color: '#999999'
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            // name:'地區',
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
            barWidth: 20,
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
        ]
      }
    }
  },
  mounted () {
    this.setOptions()
  },
  methods: {
    setOptions () {
      this.options.xAxis.data = this.dataset.index
      this.options.yAxis.name = this.dataset.columns
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
      this.$set(this.options.series[0], 'data', seriesArray)

      return this.options
    }
  }
}
</script>
