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
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: '#4CE2F0'
        }, {
          offset: 1, color: '#438AF8'
        }],
        global: false
      }
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
  name: 'DisplayComputedHistogramChart',
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
  data () {
    return {
      selectedData: []
    }
  },
  computed: {
    chartOption () {
      let histogramConfig = JSON.parse(JSON.stringify(histogramChartConfig))
      let chartAddon = JSON.parse(JSON.stringify(chartOptions()))
      let min = this.dataset.range[0]
      let max = this.dataset.range[1]
      let dataLength = this.dataset.data.length
      let interval = this.floatSub(max, min) / dataLength

      // 預設 四捨五入 到小數點後第幾位
      const defaultDisplayDigit = 2

      if (Number(interval) >= 1) {
        interval = Math.round(interval * Math.pow(10, defaultDisplayDigit)) / Math.pow(10, defaultDisplayDigit)
      } else {
        // 找出例如0.0000031432的.到有3之間有幾個零
        let count = 0
        let _interval = interval
        while (_interval < 1) {
          _interval = _interval * 10
          count += 1
        }
        interval = Math.round(this.displayFloat(interval * Math.pow(10, count + defaultDisplayDigit))) / Math.pow(10, count + defaultDisplayDigit)
      }

      let chartData = this.dataset.data.map((element, index) => {
        return [
          // 數字過大或過小時，使用 toFixed 將科學符號轉回來
          this.floatAdd(min, (interval * index).toFixed(20)), this.floatAdd(min, (interval * (index + 1)).toFixed(20)), element
        ]
      })

      // 數據顯示
      chartAddon.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.series[0].data
        let table = `<div style="text-align: text;padding: 0 16px;position: absolute;width: 100%;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">${this.$t('chart.export')}</button></div>
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
      chartAddon.xAxis = {...chartAddon.xAxis, ...histogramConfig.xAxis}
      chartAddon.xAxis.interval = interval
      chartAddon.xAxis.min = min
      chartAddon.xAxis.max = max
      chartAddon.xAxis.name = this.title.xAxis[0].display_name
      chartAddon.yAxis = {...chartAddon.yAxis, ...histogramConfig.yAxis}
      chartAddon.yAxis.name = this.title.yAxis[0].display_name

      histogramConfig.chartData.renderItem = this.renderItem
      histogramConfig.chartData.data = chartData
      chartAddon.series[0] = histogramConfig.chartData
      // 不顯示“全選”按鈕
      chartAddon.legend.selector = false
      chartAddon.toolbox.show = this.showToolbox
      return { ...chartAddon, ...getDrillDownTool(this.$route.name, this.title) }
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
            dc_name: this.title.xAxis[0].dc_name,
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
