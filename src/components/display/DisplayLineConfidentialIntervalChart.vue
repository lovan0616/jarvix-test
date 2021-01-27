<template>
  <div class="display-line-confidential-interval-chart">
    <v-echart
      ref="chart"
      :style="chartStyle"
      :options="options"
      auto-resize
      @brushselected="brushRegionSelected"
    />
    <arrow-button
      v-show="showPagination"
      v-if="hasPagination"
      :right="arrowBtnRight"
      @click.native="$emit('next')"
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
              {{ singleType.properties.display_name }} {{ $t('resultDescription.between', {start: customerTimeFormatter(singleType.properties.start, singleType.properties.timeScope), end: customerTimeFormatter(singleType.properties.end, singleType.properties.timeScope, true) }) }}
            </div>
          </div>
        </div>
      </div>
    </selected-region>
    <insight-description-block
      :title="$t('resultDescription.dataInsight')"
      :message-list="dataset.descriptions"
      icon-name="len-with-line-chart"
    />
    <insight-description-block
      :title="$t('resultDescription.warning')"
      :message-list="dataset.warnings"
      message-type="warning"
      icon-name="alert-circle"
    />
  </div>
</template>
<script>
import InsightDescriptionBlock from './InsightDescriptionBlock'
import { commonChartOptions } from '@/components/display/common/chart-addon'
import chartVariable from '@/styles/chart/variables.scss'
import {
  getDrillDownTool,
  xAxisDefault,
  yAxisDefault
} from './common/addons'

export default {
  name: 'DisplayLineConfidentialIntervalChart',
  components: {
    InsightDescriptionBlock
  },
  props: {
    dataset: { type: [Object, Array, String], default: () => ([]) },
    componentId: {
      type: Number,
      default: null
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
    hasPagination: {
      type: Boolean,
      default: false
    },
    canDownloadCsv: {
      type: Boolean,
      default: false
    },
    arrowBtnRight: {
      type: Number,
      default: 80
    },
    customChartStyle: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      selectedData: [],
      showPagination: true
    }
  },
  computed: {
    chartStyle () {
      return {
        width: '100%',
        height: '420px',
        ...this.customChartStyle
      }
    },
   seriesName () {
    const middleLineName = this.isAnomalyTwoNumericDependence 
      ? this.$t(`chart.feature.${this.dataset.midlineType.toLowerCase()}`)
      : this.$t('chart.forecastValue')
     return [
        this.title.xAxis[0].display_name,
        middleLineName,
        this.$t('chart.lowerBoundValue'),
        this.$t('chart.upperBoundValue'),
        this.$t('chart.normalValue'),
        this.$t('chart.anomalousValue')
      ]
   },
    zValue () {
      const confidentialValue = this.dataset.confidenceLevel || 99
      switch (confidentialValue) {
        case 90:
          return 1.645
        case 95:
          return 1.960
        case 99: 
          return 2.576
        case 99.7:
          return 3
      }
    },
    isAnomalyTwoNumericDependence () {
      return !this.dataset.predictDataList && !!this.dataset.midlineValue
    },
    standardLine () {
      const dataAmount = this.dataset.data.length
      return this.isAnomalyTwoNumericDependence 
        ? Array(dataAmount).fill(this.dataset.midlineValue)
        : this.dataset.predictDataList
    },
    lowerBoundList () {
      return this.standardLine.map(item => item - this.zValue * this.dataset.sigma)
    },
    yAxisMinValue () {
      const invalidDataList = this.actualDataList.invalidDataList.filter(item => item !== null)
      return Math.floor(this.adjustValueWithOffsetValue(Math.min(...this.lowerBoundList, ...invalidDataList)))*0.9
    },
    yAxisOffsetValue () {
      return Math.floor(Math.min(0, ...this.lowerBoundList))
    },
    toUpperBoundIntervalList () {
      return this.standardLine.map(item => 2 * this.zValue * this.dataset.sigma)
    },
    actualDataList () {
      const actualDataList = {
        validDataList: [],
        invalidDataList: []
      }
      this.dataset.data.forEach((actualValue, index) => {
        const upperBound = this.lowerBoundList[index] + this.toUpperBoundIntervalList[index]
        const lowerBound = this.lowerBoundList[index]
        const isValidValue = actualValue <= upperBound && actualValue >= lowerBound
        actualDataList.validDataList.push(isValidValue ? actualValue : null)
        actualDataList.invalidDataList.push(isValidValue ? null : actualValue)
      })
      return actualDataList
    },
    transformedData () {
      const source = []
      source.push(this.seriesName)
      this.dataset.index.forEach((value, index) => {
        source.push([
          value, 
          this.adjustValueWithOffsetValue(this.standardLine[index]),
          this.adjustValueWithOffsetValue(this.lowerBoundList[index]), 
          this.toUpperBoundIntervalList[index],
          //this.adjustValueWithOffsetValue(this.actualDataList.validDataList[index]),
          // 2N 異常需要把原始資料點連起來，因此要使用原始資料
          this.adjustValueWithOffsetValue(this.isAnomalyTwoNumericDependence ? this.dataset.data[index] : this.actualDataList.validDataList[index]),
          this.adjustValueWithOffsetValue(this.actualDataList.invalidDataList[index])
        ])
      })
      return source
    },
    series () {
      const stackName = 'confidentialInterval'
      return [
        // predict data
        {
          name: this.seriesName[1],
          type: 'line',
          symbol: 'none'
        },
        // lowerbound data
        {
          name: this.seriesName[2],
          type: 'line',
          stack: stackName,
          areaStyle: {
            opacity: 0
          },
          symbol: 'none',
          lineStyle: {
            type: 'dashed',
            opacity: 0
          },
          markLine: {
            symbol: 'none',
            lineStyle: {
              color: chartVariable['xAxisColor'],
              type: 'solid'
            },
            animation: false,
            data: [
              // 暫時不顯示左側 0 以避免和自動產生的 label 重疊
              // {
              //   yAxis: Math.abs(this.yAxisOffsetValue),
              //   label: {
              //     position: 'start',
              //     formatter: '0',
              //   },
              // }, 
              {
                yAxis: Math.abs(this.yAxisOffsetValue),
                label: {
                  position: 'end',
                  formatter: this.title.xAxis[0].display_name
                },
              }
            ],
            silent: true
          }
        },
        // upperbound data
        {
          name: this.seriesName[3],
          type: 'line',
          stack: stackName,
          symbol: 'none',
          areaStyle: {
            color: chartVariable['intervalLineColor'],
            opacity: 0.2
          },
          lineStyle: {
            type: 'dashed',
            opacity: 0
          },
        },
        // valid data
        {
          name: this.seriesName[4],
          type: 'line',
          symbol: 'circle',
          connectNulls: false,
          itemStyle: {
            color: chartVariable['normalValueColor']
          },
          lineStyle: {
            opacity: Number(this.isAnomalyTwoNumericDependence) * 0.5
          },
          // 顯示所有點，不省略
          showAllSymbol: true
        },
        // invalid data
        {
          name: this.seriesName[5],
          type: 'line',
          symbol: 'circle',
          connectNulls: false,
          itemStyle: {
            color: chartVariable['anomalousValueColor']
          },
          lineStyle: {
            opacity: 0
          },
          // 顯示所有點，不省略
          showAllSymbol: true
        }
      ]
    },
    options () {
      let config = {
        xAxis: {
          ...xAxisDefault(),
          axisLine: {
            show: false
          }
        },
        yAxis: {
          ...yAxisDefault(),
          min: this.yAxisMinValue,
          name: this.title.yAxis[0].display_name,
          axisLabel: {
            formatter: value => this.yAxisOffsetValue + value
          }
        },
        ...JSON.parse(JSON.stringify(commonChartOptions())),
        ...getDrillDownTool(this.$route.name, this.title),
        dataset: {
          source: this.transformedData
        },
        series: this.series,
        // 用來控制預測線和上下限顏色，原始值獨立在 serie 裡設定
        color: chartVariable['intervalLineColor']
      }

      // 不顯示上下限和實際資料的 legend 選項
      config.legend.data = [this.seriesName[4], this.seriesName[5]]

      // 準備 tooltip 內容
      config.tooltip.formatter = (params) => {
        let hasAnomalyData = params[0].value[5] !== null
        let res = params[0].name + '<br/>'
        for (let i = 0, length = params.length; i < length; i++) {
          let componentIndex = params[i].componentIndex + 1
          // 過濾掉 null 值
          if ((i === 3 || i === 4) && params[i].value[componentIndex] === null) continue
          // upperbound 需額外計算
          let displayValue = i === 2 ? params[i].value[componentIndex] + params[i].value[2] : params[i].value[componentIndex]
          // 如果畫圖表時有因為 offset 做調整，欲顯示原始資訊時，需要 undo
          displayValue += this.yAxisOffsetValue
          let marker = params[i].marker ? params[i].marker : `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[i].color.colorStops[0].color};"></span>`
          // 有異常分析的時候，不顯示正常值
          if(i !== 3 || !hasAnomalyData) res += marker + params[i].seriesName + '：' + this.formatComma(displayValue) + '<br/>'
        }
        return res
      }

      // 準備原始資料
      config.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.dataset[0].source
        let table = '<div style="text-align: text;padding: 0 16px;position: absolute;width: 100%;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">' + this.$t('chart.export') + '</button></div><table style="width:100%;padding: 0 16px;white-space:nowrap;margin-top: 48px;"><tbody>'
        for (let i = 0; i < dataset.length; i++) {
          let tableData = dataset[i].reduce((acc, cur, index) => {
            let displayedValue = cur
            // 計算上限值
            if (index === 3) displayedValue = dataset[i][2] + cur
            // 如果為 null 則留空
            if ((index === 4 || index === 5) && cur === null) displayedValue = ''
            // 如果畫圖表時有因為 offset 做調整，欲顯示原始資訊時，需要 undo
            if (i !== 0 && index !== 0 && displayedValue !== '') displayedValue += this.yAxisOffsetValue
            return acc + '<td style="padding: 4px 12px;">' + displayedValue + '</td>'
          }, '')
          table += `<tr style='background-color:${i % 2 !== 0 ? 'rgba(35, 61, 64, 0.6)' : 'background: rgba(50, 75, 78, 0.6)'}'>${tableData}</tr>`
        }
        table += '</tbody></table>'
        return table
      }

      // export data
      this.$nextTick(() => {
        if (this.$el.getAttribute('listener') !== 'true') {
          this.$el.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'export-btn') {
              const exportData = this.options.dataset.source.map((element, index) => {
                // header 不額外處理
                if (index === 0) return element
                // 計算上限值
                element[3] = element[2] + element[3]
                // 如果畫圖表時有因為 offset 做調整，欲顯示原始資訊時，需要 undo
                element = element.map((item, index) => (index === 0 || item === null) ? item : item + this.yAxisOffsetValue)
                return element
              })
              if (this.hasPagination && this.canDownloadCsv) return this.addCSVDownloadTask(this.appQuestion + this.$t('denotation.anomalyAnalysis'), this.componentId)
              this.exportToCSV(this.appQuestion, exportData)
            }
          }, false)
          this.$el.setAttribute('listener', true)
        }
      })

      return config
    },
    appQuestion () {
      return this.$store.state.dataSource.appQuestion
    }
  },
  methods: {
    // 處理堆疊圖目前無法處理橫跨正負的計算：正值只能加正值的區間值，負值只能加負值的區間值
    // 追蹤當前 echarts issue: https://github.com/apache/incubator-echarts/issues/9317
    adjustValueWithOffsetValue (value) {
      // 如果堆疊區間沒有橫跨正負值或當前的值是空值則保留原狀
      if (this.yAxisOffsetValue === 0 || value === null) return value
      return value +  Math.abs(this.yAxisOffsetValue)
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
            start: this.dataset.timeStampList[coordRange[0] < 0 ? 0 : coordRange[0]],
            end: this.dataset.timeStampList[coordRange[1] > this.dataset.timeStampList.length - 1 ? this.dataset.timeStampList.length - 1 : coordRange[1]],
            timeScope: this.dataset.timeScope
          }
        }
      })
    },
    saveFilter () {
      this.$store.commit('dataSource/setFilterList', this.selectedData)
    }
  }
}
</script>