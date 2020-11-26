<template>
  <div class="display-line-chart">
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
          <div 
            v-if="singleType.type === 'enum'"
            class="filter-description"
          >
            <div class="column-name">{{ singleType.properties.display_name }} =</div>
            <div 
              v-for="(singleData, propertiesIndex) in singleType.properties.datavalues"
              :key="'enum-' + propertiesIndex"
              class="single-filter"
            >{{ singleData }}<span v-show="propertiesIndex !== singleType.properties.datavalues.length - 1">、</span></div>
          </div>
          <div 
            v-if="singleType.type === 'range'"
            class="region-description"
          >
            <div class="single-area">
              {{ $t('resultDescription.area') + (index + 1) }}:
              {{ singleType.properties.display_name }} {{ $t('resultDescription.between', {start: singleType.properties.start, end: singleType.properties.end }) }}
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
      v-if="showWarning"
      :title="$t('resultDescription.warning')"
      :message-list="dataset.warnings"
      message-type="warning"
      icon-name="alert-circle"
    />
  </div>
</template>

<script>
import EchartAddon from './common/addon.js'
import InsightDescriptionBlock from './InsightDescriptionBlock'
import { commonChartOptions } from '@/components/display/common/chart-addon'
import { getDrillDownTool, monitorMarkLine, lineChartMonitorVisualMap } from '@/components/display/common/addons'
import {
  colorOnly1,
  colorOnly2,
  color5,
  color12,
  gridDefault,
  xAxisDefault,
  yAxisDefault,
  seriesItemLine,
  parallelZoomIn
} from './common/addons'

const echartAddon = new EchartAddon({
  'grid:default': gridDefault(),
  'yAxis:default': yAxisDefault(),
  'seriesItem:line': seriesItemLine()
})

export default {
  name: 'DisplayLineChart',
  components: {
    InsightDescriptionBlock
  },
  props: {
    dataset: { type: [Object, Array, String], default: () => ([]) },
    title: {
      type: Object,
      default: () => {
        return {
          xAxis: null,
          yAxis: null
        }
      }
    },
    height: {
      type: String,
      default: '420px'
    },
    isParallel: {
      type: Boolean,
      default: false
    },
    hasPagination: {
      type: Boolean,
      default: false
    },
    showToolbox: {
      type: Boolean,
      default: true
    },
    showWarning: {
      type: Boolean,
      default: true
    },
    customChartStyle: {
      type: Object,
      default: () => {}
    },
    arrowBtnRight: {
      type: Number,
      default: 80
    },
    isShowLegend: {
      type: Boolean,
      default: true
    },
    isShowLabelData: {
      type: Boolean,
      default: false
    },
    coefficients: {
      type: Array,
      default: null
    },
    formula: {
      type: Array,
      default: null
    },
  },
  data () {
    echartAddon.mapping({
      'seriesItem:line': {
        'large': true
      },
      'grid:default': {},
      'yAxis:default': {}
    })
    return {
      addonOptions: JSON.parse(JSON.stringify(echartAddon.options)),
      addonSeriesItem: JSON.parse(JSON.stringify(echartAddon.seriesItem)),
      addonSeriesItems: JSON.parse(JSON.stringify(echartAddon.seriesItems)),
      selectedData: [],
      showPagination: true
    }
  },
  computed: {
    chartStyle () {
      return {
        width: '100%',
        height: this.height,
        ...this.customChartStyle
      }
    },
    series () {
      if (this.dataset.display_columns) {
        return this.dataset.display_columns.map((element, colIndex) => this.composeColumn(element, colIndex))
      } else {
        return this.dataset.columns.map((element, colIndex) => this.composeColumn(element, colIndex))
      }
    },
    options () {
      let config = {
        xAxis: {
          ...xAxisDefault()
        },
        ...this.addonOptions,
        ...getDrillDownTool(this.$route.name, this.title),
        ...JSON.parse(JSON.stringify((commonChartOptions()))),
        dataset: {
          source: this.datasetTransform(this.dataset)
        },
        series: this.series,
        color: this.colorList
      }

      const seriesAmount = this.dataset.display_columns ? this.dataset.display_columns.length : this.dataset.columns.length
      config.toolbox.feature.myShowLabel.show = seriesAmount <= 4
      config.toolbox.feature.myShowLabel.onclick = () => {
        this.$emit('toggleLabel')
      }

      config.toolbox.feature.dataView.optionToContent = (opt) => {
        if (this.hasPagination) {
          this.$el.addEventListener('click', this.controlPagination, false)
        }
        let dataset = opt.dataset[0].source
        let table = '<div style="text-align: text;padding: 0 16px;position: absolute;width: 100%;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">' + this.$t('chart.export') + '</button></div><table style="width:100%;padding: 0 16px;white-space:nowrap;margin-top: 48px;"><tbody>'
        for (let i = 0; i < dataset.length; i++) {
          let tableData = dataset[i].reduce((acc, cur, idx) => {
            return acc + `<td style="padding: 4px 12px;white-space:nowrap;">${i && idx && cur ? this.formatComma(cur) : cur || ''}</td>`
          }, '')
          table += `<tr ${i % 2 === 0 ? (i === 0 ? 'style="background-color:#2B4D51"' : 'style="background-color:rgba(50, 75, 78, 0.6)"') : ''}>${tableData}</tr>`
        }
        table += '</tbody></table>'
        return table
      }

      // 移除 null 值
      config.tooltip.formatter = (datas) => {
        let res = datas[0].name + '<br/>'
        for (let i = 0, length = datas.length; i < length; i++) {
          let componentIndex = datas[i].componentIndex + 1
          if (datas[i].value[componentIndex] === null || datas[i].value[componentIndex] === undefined) continue
          let marker = datas[i].marker ? datas[i].marker : `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${datas[i].color.colorStops[0].color};"></span>`
          res += marker + datas[i].seriesName + '：' + this.formatComma(datas[i].value[componentIndex]) + '<br/>'
        }
        return res
      }
      // 為了讓只有 line chart 跟 bar chart 才顯示，所以加在這邊
      config.toolbox.feature.magicType.show = true
      // 只有一個分類
      if (this.dataset.columns.length === 1) {
        config.toolbox.feature.magicType.type = ['line', 'bar']
      }
      // 圖表是水平或是垂直
      if (this.isParallel) {
        config.xAxis = yAxisDefault()
        config.xAxis.name = this.title.yAxis[0].display_name
        config.yAxis = xAxisDefault()
        config.yAxis.name = this.title.xAxis[0].display_name ? this.title.xAxis[0].display_name.replace(/ /g, '\r\n') : this.title.xAxis[0].display_name
      } else {
        config.xAxis.name = this.title.xAxis[0].display_name ? this.title.xAxis[0].display_name.replace(/ /g, '\r\n') : this.title.xAxis[0].display_name
        config.yAxis.name = this.title.yAxis[0].display_name
      }
      config.yAxis.scale = true

      // 數量大的時候出現 scroll bar
      if (this.dataset.index.length > 10) {
        config.dataZoom = parallelZoomIn()
      }
      config.toolbox.show = this.showToolbox

      // 是否隱藏 legend
      if (!this.isShowLegend) config.legend.show = false

      // 圖表 threshold
      let upperLimit = this.title.yAxis[0].upperLimit || null
      let lowerLimit = this.title.yAxis[0].lowerLimit || null
      if (upperLimit !== null || lowerLimit !== null) {
        // markline
        config.series[0].markLine = monitorMarkLine(upperLimit, lowerLimit)
        
        // 找出 Y 的最大、最小值
        if(this.dataset.data[0].length === 1) {
          // 找出 Y 的最大、最小值
          let maxY = this.dataset.data[0][0]
          let minY = this.dataset.data[0][0]
          this.dataset.data.forEach(element => {
            if (element[0] !== null) {
              if (maxY === null) maxY = element[0]
              maxY = element[0] > maxY ? element[0] : maxY
              if (minY === null) minY = element[0]
              minY = element[0] < minY ? element[0] : minY
            }
          })

          config.visualMap = []
          config.visualMap.push(lineChartMonitorVisualMap(upperLimit, lowerLimit, maxY, minY, 1))

          // if (upperLimit && lowerLimit) {
          //   config.visualMap = [{
          //     type: 'piecewise',
          //     show: false,
          //     pieces: [{
          //       gt: upperLimit,
          //       color: '#EB5959'
          //     },{
          //       lte: upperLimit,
          //       gt: lowerLimit,
          //       color: '#438AF8'
          //     },{
          //       lte: lowerLimit,
          //       color: '#EB5959'
          //     }]
          //   }]
          // } else if (lowerLimit === null) {
          //   config.visualMap = [{
          //     type: 'piecewise',
          //     show: false,
          //     pieces: upperLimit > minY ? [{
          //       gt: upperLimit,
          //       color: '#EB5959'
          //     },{
          //       lte: upperLimit,
          //       gt: minY,
          //       color: '#438AF8'
          //     }] : [{
          //       lte: maxY,
          //       gt: upperLimit,
          //       color: '#EB5959'
          //     }]
          //   }]
          // } else {
          //   config.visualMap = [{
          //     type: 'piecewise',
          //     show: false,
          //     pieces: lowerLimit > minY ? [{
          //       gt: lowerLimit,
          //       color: '#438AF8'
          //     },{
          //       lte: lowerLimit,
          //       gt: minY,
          //       color: '#EB5959'
          //     }] : [{
          //       lte: maxY,
          //       gt: lowerLimit,
          //       color: '#438AF8'
          //     }]
          //   }]
          // }
        } 
        /* 註解部分是處理多條線的上下限問題
         * 但 chart 的 label 會因為使用 visualMap 的關係
         * 沒辦法應映每條線而有不同的 label 顏色
         * 目前只有加上兩條 mark line 
         * 待找到分別設定多條線的 label 顏色後再使用 visualMap
        */
        // else {
        //   const allIsNull = arr => arr.every(element => element === null)
        //   let maxY = allIsNull(this.dataset.data[0]) ? null : Math.max(...this.dataset.data[0])
        //   let minY = maxY
        //   this.dataset.data.forEach(element => {
        //     if (!allIsNull(element)) {
        //       let maxValue = Math.max(...element)
        //       let minValue = Math.min(...element)
        //       if (maxY === null) maxY = maxValue
        //       maxY = maxValue > maxY ? maxValue : maxY
        //       if (minY === null) minY = minValue
        //       minY = minValue < minY ? minValue : minY
        //     }
        //   })

        //   config.visualMap = []
        //   let dimensionAmount = this.dataset.data[0].length
        //   while(dimensionAmount) {
        //     config.visualMap.push(lineChartMonitorVisualMap(upperLimit, lowerLimit, maxY, minY, dimensionAmount))
        //     dimensionAmount -= 1
        //   }
        // }
      }

      if (this.coefficients) {
        let lineData = []
        let expression = ''
        if (this.coefficients.length === 2) {
          // ax + b
          let offset = this.coefficients[0]
          let gradient = this.coefficients[1]
          // 迴歸線點
          for (let i = 1; i <= this.dataset.index.length; i++) {
            lineData.push(this.roundNumber(gradient * i + offset, 4))
          }
          let displayOffset = this.formula ? this.formula[0] : Number((offset).toFixed(4))
          let displayGradient = this.formula ? this.formula[1] : Number((gradient).toFixed(4))
          expression = `y = ${displayOffset} ${displayGradient > 0 ? '+' : '-'} ${Math.abs(displayGradient)}x`
        } else {
          // ax^2 + bx + c
          let offset = this.coefficients[0]
          let firstDegree = this.coefficients[1]
          let secondDegree = this.coefficients[2]
          // 迴歸線點
          for (let i = 0; i < this.dataset.index.length; i++) {
            lineData.push(secondDegree * i * i + firstDegree * i + offset)
          }
          let displayOffset = this.formula ? this.formula[0] : Number((offset).toFixed(4))
          let displayFirstDegree = this.formula ? this.formula[1] : Number((firstDegree).toFixed(4))
          let displaySecondDegree = this.formula ? this.formula[2] : Number((secondDegree).toFixed(4))
          expression = `y = ${this.formatComma(displayOffset)} ${displayFirstDegree > 0 ? '+' : '-'} ${this.formatComma(Math.abs(displayFirstDegree))}x ${displaySecondDegree > 0 ? '+' : '-'} ${this.formatComma(Math.abs(displaySecondDegree))}x^2`
        }

        // markLine
        config.series.push({
          name: '',
          type: 'line',
          showSymbol: false,
          smooth: true,
          color: '#FF9559',
          symbol: 'none',
          data: lineData,
          markPoint: {
            itemStyle: {
              normal: {
                color: 'transparent'
              }
            },
            label: {
              show: true,
              position: 'left',
              formatter: expression,
              width: '100%',
              lineHeight: 14,
              padding: this.coefficients.length === 2 ? [1, 2, 1, 22] : [1, 2, 1, 50],
              textStyle: {
                color: '#FF9559',
                fontSize: 14
              },
              backgroundColor: '#000'
            },
            data: [
              {
                coord: [lineData.length - 1, lineData[lineData.length - 1]]
              }
            ]
          }
        })
      }

      return config
    },
    colorList () {
      if (this.hasPagination) return color12
      switch (this.series.length) {
        case 1:
          return colorOnly1
        case 2:
          return colorOnly2
        case 3:
        case 4:
        case 5:
          return color5
        default:
          return color12
      }
    },
    appQuestion () {
      return this.$store.state.dataSource.appQuestion
    },
    doDrillDown () {
      return this.$store.state.chatBot.doDrillDown
    }
  },
  watch: {
    doDrillDown (val) {
      if (!val) return
      this.robotDrillDownEvent()
      window.setTimeout(() => {
        this.saveFilter()
      }, 1000)
      this.$store.commit('chatBot/setDoDrillDown', false)
    }
  },
  mounted () {
    this.exportCSVFile(this.$el, this.appQuestion, this)
  },
  methods: {
    robotDrillDownEvent () {
      this.$refs.chart.dispatchAction({
        type: 'brush',
        areas: [
          {
            xAxisIndex: 0,
            brushType: 'lineX',
            coordRange: [
              10, 11
            ]
          }
        ]
      })
      // 為了要看起來有動態效果，只好圈兩次
      window.setTimeout(() => {
        this.$refs.chart.dispatchAction({
          type: 'brush',
          areas: [
            {
              xAxisIndex: 0,
              brushType: 'lineX',
              coordRange: [
                10, 12
              ]
            }
          ]
        })
      }, 0)
    },
    composeColumn (element, colIndex) {
      const shortenNumberMethod = this.shortenNumber
      const seriesAmount = this.dataset.display_columns ? this.dataset.display_columns.length : this.dataset.columns.length
      return {
        // 如果有 column 經過 Number() 後為數字 ，echart 會畫不出來，所以補個空格給他
        name: isNaN(Number(element)) ? element : ' ' + element,
        ...this.addonSeriesItem,
        ...this.addonSeriesItems[colIndex],
        connectNulls: true,
        ...((this.isShowLabelData && seriesAmount <= 4) && {
          label: {
            position: 'top',
            show: true,
            fontSize: 10,
            color: '#fff',
            formatter (value) { return shortenNumberMethod(value.data[colIndex + 1], 0) }
          }
        })
      }
    },
    controlPagination () {
      let exportBtn = document.getElementById('export-btn')
      if (exportBtn) {
        this.showPagination = false
      } else {
        this.showPagination = true
        this.$el.removeEventListener('click', this.controlPagination, false)
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
            start: this.dataset.index[coordRange[0] < 0 ? 0 : coordRange[0]],
            end: this.dataset.index[coordRange[1] > this.dataset.index.length - 1 ? this.dataset.index.length - 1 : coordRange[1]]
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

<style lang="scss" scoped>
.display-line-chart {
  height: 100%;
}
</style>
