<template>
  <div class="display-box-plot-chart">
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

let boxPlotChartConfig = {
  tooltip: {
    trigger: 'item'
  },
  chartData: {
    name: 'boxplot',
    type: 'boxplot',
    data: [],
    itemStyle: {
      color: chartVariable['lightestChartColor']
    },
    tooltip: {
      formatter (param) {
        return [
          'upper: ' + param.data[5],
          'Q3: ' + param.data[4],
          'median: ' + param.data[3],
          'Q1: ' + param.data[2],
          'lower: ' + param.data[1]
        ].join('<br/>')
      }
    }
  },
  outlier: {
    name: 'outlier',
    type: 'scatter',
    data: []
  }
}

export default {
  name: 'DisplayComputedBoxPlotChart',
  props: {
    dataset: {
      type: Object,
      default () {
        return {
          index: [
            '收入',
            '利潤'
          ],
          data: [
            {
              low: 655,
              q1: 850,
              q2: 940,
              q3: 980,
              high: 1000,
              outliers: [200, 300]
            },
            {
              low: 760,
              q1: 800,
              q2: 845,
              q3: 885,
              high: 960,
              outliers: [100, 1030, 1200]
            }
          ]
        }
      }
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
    showToolbox: {
      type: Boolean,
      default: true
    },
    customChartStyle: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    chartOption () {
      let chartAddon = JSON.parse(JSON.stringify(chartOptions()))
      let boxPlotConfig = JSON.parse(JSON.stringify(boxPlotChartConfig))

      chartAddon.xAxis = {...chartAddon.xAxis, ...boxPlotConfig.xAxis}
      chartAddon.tooltip.trigger = boxPlotConfig.tooltip.trigger
      chartAddon.xAxis.data = this.dataset.index
      chartAddon.xAxis.name = this.title.xAxis[0].display_name
      chartAddon.yAxis.name = this.title.yAxis.length > 0 ? this.title.yAxis[0].display_name : null
      boxPlotConfig.chartData.data = this.dataset.data.map(element => {
        return [element.low, element.q1, element.q2, element.q3, element.high]
      })
      boxPlotConfig.outlier.data = this.dataset.data.reduce((acc, cur, index) => {
        if (cur.outliers.length > 0) {
          let outliers = cur.outliers.map(element => {
            return [index, element]
          })
          return acc.concat(outliers)
        } else {
          return acc
        }
      }, [])
      chartAddon.series[0] = boxPlotConfig.chartData
      chartAddon.series[0].itemStyle.borderColor = '#4DE2F0'
      chartAddon.series[0].itemStyle.color = '#000'
      chartAddon.series[1] = boxPlotConfig.outlier
      chartAddon.series[1].itemStyle = {
        color: chartVariable['chartColorList-2']
      }
      // 數據顯示
      chartAddon.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.series[0].data
        let table = `<div style="text-align: text;padding: 0 16px;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">${this.$t('chart.export')}</button></div>
          <table style="margin-top: 16px;width:100%;padding: 0 16px;"><tbody><tr style="background-color:#2B4D51"><td></td>`
        for (let i = 0; i < this.dataset.index.length; i++) {
          table += `<td>${this.dataset.index[i]}</td>`
        }
        table += '</tr>'
        for (let i = 0; i < 5; i++) {
          table += `<tr ${i % 2 === 0 ? 'style="background-color:rgba(50, 75, 78, 0.6)"' : ''}>`
          switch (i) {
            case 0:
              table += `<td>${this.$t('resultDescription.min')}</td>`
              break
            case 1:
              table += `<td>${this.$t('resultDescription.lowerQuartile')}</td>`
              break
            case 2:
              table += `<td>${this.$t('resultDescription.median')}</td>`
              break
            case 3:
              table += `<td>${this.$t('resultDescription.higherQuartile')}</td>`
              break
            case 4:
              table += `<td>${this.$t('resultDescription.max')}</td>`
              break
          }
          for (let j = 0; j < dataset.length; j++) {
            table += `<td>${dataset[j][i]}</<td>`
          }
          table += `</tr>`
        }
        table += '</tbody></table>'
        return table
      }
      // 是否顯示 toolbox
      chartAddon.toolbox.show = this.showToolbox
      // export data
      this.$nextTick(() => {
        this.$el.addEventListener('click', (e) => {
          if (e.target && e.target.id === 'export-btn') {
            let exportData = []
            let indexArray = JSON.parse(JSON.stringify(this.dataset.index))
            indexArray.unshift('')
            exportData.push(indexArray)

            for (let i = 0; i < 5; i++) {
              let rowData
              switch (i) {
                case 0:
                  rowData = [this.$t('resultDescription.min')]
                  break
                case 1:
                  rowData = [this.$t('resultDescription.lowerQuartile')]
                  break
                case 2:
                  rowData = [this.$t('resultDescription.median')]
                  break
                case 3:
                  rowData = [this.$t('resultDescription.higherQuartile')]
                  break
                case 4:
                  rowData = [this.$t('resultDescription.max')]
                  break
              }
              for (let j = 0; j < boxPlotConfig.chartData.data.length; j++) {
                rowData.push(boxPlotConfig.chartData.data[j][i])
              }
              exportData.push(rowData)
            }
            this.exportToCSV(this.appQuestion, exportData)
          }
        })
      })

      return {
        ...chartAddon,
        brush: {
          toolbox: [''],
          xAxisIndex: 0,
          yAxisIndex: 0
        }
      }
    },
    chartStyle () {
      return {
        width: '100%',
        height: '420px',
        ...this.customChartStyle
      }
    },
    appQuestion () {
      return this.$store.state.dataSource.appQuestion
    }
  }
}
</script>
