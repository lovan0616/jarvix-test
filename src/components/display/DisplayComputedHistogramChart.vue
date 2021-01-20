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
    <feature-information-block
      v-if="dataset.featureInformation"
      :feature-information="dataset.featureInformation"
      class="feature-information"
    />
  </div>
</template>
<script>
import FeatureInformationBlock from './FeatureInformationBlock'
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'
import { monitorVisualMap, monitorMarkLine, colorOnly1, getDrillDownTool } from '@/components/display/common/addons'

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
      color: colorOnly1[0]
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
  components: {
    FeatureInformationBlock
  },
  props: {
    dataset: {
      type: Object,
      default: () => {}
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
    isShowToolbox: {
      type: Boolean,
      default: true
    },
    isShowLabelData: {
      type: Boolean,
      default: false
    },
    customChartStyle: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      selectedData: [],
      lineChartPointAmount: 130
    }
  },
  computed: {
    isNormalityTestChart () {
      return this.dataset.featureInformation !== null
    },
    lineChartAxisTick () {
      const xAxisMin = this.dataset.range[0]
      const xAxisMax = this.dataset.range[1]
      const getSingleAxisTick = currentIndex => xAxisMin + currentIndex * ((xAxisMax - xAxisMin) / this.lineChartPointAmount)
      const axisTickList = [...Array(this.lineChartPointAmount).keys()].map(getSingleAxisTick)
      return [
        // 依照給定要畫的點數量依序產生的 x 軸 index
        ...axisTickList,
        // 適時在最後補值來確保 x 軸最後一個值對齊資料最大值
        ...((axisTickList[axisTickList.length - 1] !== xAxisMax) && [xAxisMax])
      ]
    },
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
          // bar start
          this.displayFloat(min + interval * index),
          // bar end
          index === dataLength - 1 ? max : this.displayFloat(min + interval * (index + 1)),
          element
        ]
      })

      chartAddon.toolbox.feature.myShowLabel.show = true
      chartAddon.toolbox.feature.myShowLabel.onclick = () => {
        this.$emit('toggleLabel')
      }

      // 數據顯示
      chartAddon.toolbox.feature.dataView.optionToContent = (chartData) => {
        let dataset = chartData.series[0].data
        let table = `<div style="text-align: text;padding: 0 16px;position: absolute;width: 100%;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">${this.$t('chart.export')}</button></div>
          <table style="width:100%;padding: 0 16px;margin-top: 48px;"><tbody><tr style="background-color:#2B4D51">` +
          '<td>' + this.title.xAxis[0].display_name + '</td>' +
          '<td>' + this.title.yAxis[0].display_name + '</td>' +
          '</tr>'
        for (let i = 0; i < dataset.length; i++) {
          table += `<tr ${i % 2 === 0 ? 'style="background-color:rgba(50, 75, 78, 0.6)"' : ''}>
            <td>${ this.formatComma(dataset[i][0]) } ~ ${ this.formatComma(dataset[i][1]) }</td><td>${ this.formatComma(dataset[i][2]) }</td>
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
      // let labelInterval = Math.floor(dataLength / 15)
      // let labelCount = 0
      // chartAddon.xAxis.axisLabel.formatter = (value, index) => {
      //   if (dataLength > 20) {
      //     if (index === Math.floor(labelCount + labelInterval)) {
      //       labelCount += labelInterval
      //       return value
      //     }
      //   } else {
      //     return index === dataLength ? max : value
      //   }
      // }
      // 考慮要不要用
      chartAddon.xAxis.axisLabel.formatter = (value, index) => {
        if (dataLength > 20) {
          let labelInterval = Math.floor(dataLength / 15)
          if (index % labelInterval === 0) return this.formatComma(value)
        } else {
          return index === dataLength ? this.formatComma(max) : this.formatComma(value)
        }
      }
      histogramConfig.chartData.renderItem = this.renderItem
      histogramConfig.chartData.data = chartData 
      const labelFormatter = this.chartLabelFormatter
      const maxValue = Math.max(...this.dataset.data)
      chartAddon.series = [{
        ...histogramConfig.chartData,
        ...(this.isShowLabelData && {
          label: {
            position: 'top',
            show: true,
            fontSize: 10,
            color: '#fff',
            formatter (value) { return labelFormatter(value.data[2], maxValue) }
          }
        })
      }]
      // 常態檢定分佈圖
      if(this.isNormalityTestChart) {
        histogramConfig.chartData.itemStyle.color = chartVariable['chartColorList-1']
        chartAddon.series.push({
          type: 'line',
          name: this.$t('chart.normalDistribution'),
          smooth: true,
          symbol: 'none',
          data: this.lineChartAxisTick.map(tick => this.calculateProbability(this.dataset.featureInformation.mean, this.dataset.featureInformation.sigma, tick)),
          tooltip: {
            show: false
          }, 
          itemStyle: {
            color: '#FF9559'
          }
        })
      }
      
      let upperLimit = this.title.yAxis[0].upperLimit || null
      let lowerLimit = this.title.yAxis[0].lowerLimit || null
      if (upperLimit !== null || lowerLimit !== null) {
        // 處理顏色
        chartAddon.visualMap = monitorVisualMap(upperLimit, lowerLimit)
        // markline
        chartAddon.series.push({
          type: 'line',
          markLine: monitorMarkLine(upperLimit, lowerLimit)
        })
      }

      // 不顯示“全選”按鈕
      chartAddon.legend.selector = false
      chartAddon.toolbox.show = this.isShowToolbox
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
    calculateProbability (mean, sigma, xAxisIndex) {
      return [xAxisIndex, (1 / (Math.sqrt(2 * Math.PI) * sigma)) * Math.exp(-1 * (Math.pow((xAxisIndex - mean), 2) / (2 * Math.pow(sigma, 2))))]
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

<style lang="scss" scoped>
.feature-information {
  height: 120px;
}
</style>