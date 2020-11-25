<template>
  <div class="display-histogram-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
      @brushselected="brushRegionSelected"
    />
    <selected-region
      v-if="selectedData.length > 0"
      :title="$t('resultDescription.currentChosenData')"
      @save="saveFilter"
    >
      <div slot="selectedFilterRegion">
        <div
          v-for="(singleType, index) in selectedData"
          :key="index"
        >
          <div class="region-description">
            <div class="single-area">
              {{ $t('resultDescription.area') + (index + 1) }}:
              {{ singleType.properties.display_name }} {{ $t('resultDescription.between', {start: roundNumber(singleType.properties.start), end: roundNumber(singleType.properties.end) }) }}
            </div>
          </div>
        </div>
      </div>
    </selected-region>
  </div>
</template>
<script>
import ecStat from 'echarts-stat'
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'
import { getDrillDownTool } from '@/components/display/common/addons'

// 直方圖的參數設定
let histogramChartConfig = {
  xAxis: {
    type: 'value',
    min: null,
    max: null,
    interval: null,
    splitLine: {
      show: false
    }
  },
  chartData: {
    symbolSize: 8,
    itemStyle: {
      color: chartVariable['lightestChartColor']
    },
    data: [],
    type: 'custom',
    label: {},
    renderItem: null,
    large: true,
    encode: {
      x: [0, 1],
      y: 2,
      tooltip: 2,
      label: 2
    }
  }
}

export default {
  name: 'DisplayHistogramChart',
  props: {
    dataset: {
      type: Object,
      default () {
        return {}
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
    }
  },
  data () {
    return {
      selectedData: []
    }
  },
  computed: {
    chartOption () {
      let chartAddon = JSON.parse(JSON.stringify(chartOptions()))
      let interval
      let min = Infinity
      let max = -Infinity
      let newData = this.dataset.data.map(element => {
        return element[1]
      })
      let arrayFirstItem = newData[0]
      // 只有一條 bar
      let allSameValue = newData.every(item => {
        return item === arrayFirstItem
      })
      let bins = {}
      if (allSameValue) {
        bins = {
          bins: [
            {
              samples: newData,
              x0: newData[0],
              x1: newData[0]
            }
          ],
          data: [
            [newData[0], newData.length]
          ]
        }
      } else {
        bins = ecStat.histogram(newData, 'sturges')
      }

      let chartData = bins.data.map((item, index) => {
        let x0 = bins.bins[index].x0
        let x1 = bins.bins[index].x1
        interval = x1 - x0
        min = Math.min(min, x0)
        max = Math.max(max, x1)
        return [x0, x1, item[1]]
      })

      // 數據顯示
      chartAddon.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.series[0].data
        let table = `<div style="text-align: text;padding: 0 16px;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">${this.$t('chart.export')}</button></div>
          <table style="width:100%;padding: 0 16px;margin-top: 48px;"><tbody><tr style="background-color:#2B4D51">` +
          '<td>' + this.title.xAxis[0].display_name + '</td>' +
          '<td>' + this.title.yAxis[0].display_name + '</td>' +
          '</tr>'
        for (let i = 0; i < dataset.length; i++) {
          table += `<tr ${i % 2 === 0 ? 'style="background-color:rgba(50, 75, 78, 0.6)"' : ''}>
            <td>${dataset[i][0]} ~ ${dataset[i][1]}</td><td>${dataset[i][2]}</td>
          </tr>`
        }
        table += '</tbody></table>'
        return table
      }
      // export data
      this.$nextTick(() => {
        this.$el.addEventListener('click', (e) => {
          if (e.target && e.target.id === 'export-btn') {
            let exportData = JSON.parse(JSON.stringify(chartData))
            exportData.unshift([this.$t('chart.rangeStart'), this.$t('chart.rangeEnd'), this.$t('chart.count')])
            this.exportToCSV(this.appQuestion, exportData)
          }
        })
      })

      // set histogram xAxis
      chartAddon.xAxis = {...chartAddon.xAxis, ...histogramChartConfig.xAxis}
      chartAddon.xAxis.interval = allSameValue ? 'auto' : interval
      chartAddon.xAxis.min = allSameValue ? newData[0] / 2 : min
      chartAddon.xAxis.max = allSameValue ? newData[0] * 2 : max
      chartAddon.xAxis.name = this.title.xAxis[0].display_name
      chartAddon.yAxis = {...chartAddon.yAxis, ...histogramChartConfig.yAxis}
      chartAddon.yAxis.name = this.title.yAxis[0].display_name

      histogramChartConfig.chartData.renderItem = this.renderItem
      histogramChartConfig.chartData.data = chartData
      chartAddon.series[0] = histogramChartConfig.chartData

      return {...chartAddon, ...getDrillDownTool(this.$route.name, this.title)}
    },
    chartStyle () {
      return {
        width: '100%',
        height: '420px'
      }
    },
    appQuestion () {
      return this.$store.state.dataSource.appQuestion
    }
  },
  methods: {
    renderItem (params, api) {
      let yValue = api.value(2)
      let start = api.coord([api.value(0), yValue])
      let size = api.size([api.value(1) - api.value(0), yValue])
      let style = api.style()

      return {
        type: 'rect',
        shape: {
          x: start[0] + 1,
          y: start[1],
          width: size[0] - 2,
          height: size[1]
        },
        style: style
      }
    },
    brushRegionSelected (params) {
      if (params.batch[0].areas.length === 0) {
        this.selectedData = []
        return
      }
      this.selectedData = params.batch[0].areas.map(areaElement => {
        let coordRange = areaElement.coordRange
        return {
          type: 'range',
          properties: {
            dc_id: this.title.xAxis[0].dc_id,
            data_type: this.title.xAxis[0].data_type,
            display_name: this.title.xAxis[0].display_name,
            start: coordRange[0],
            end: coordRange[1]
          }
        }
      })
    },
    saveFilter () {
      this.$store.commit('dataSource/setFilterList', this.selectedData)
    }
  },
}
</script>
