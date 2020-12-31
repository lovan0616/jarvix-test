<template>
  <div class="display-basic-chart">
    <v-echart
      :style="chartStyle"
      :options="options"
      auto-resize
      @magictypechanged="magicTypeChanged"
      @brushselected="brushRegionSelected"
      @click="chartClicked"
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
              v-for="(singleData, propertiesIndex) in singleType.properties.display_datavalues"
              :key="'enum-' + propertiesIndex"
              class="single-filter"
            >{{ singleData }}<span v-show="propertiesIndex !== singleType.properties.display_datavalues.length - 1">、</span></div>
          </div>
          <div 
            v-if="singleType.type === 'range'"
            class="region-description"
          >
            <div class="single-area">
              {{ $t('resultDescription.area') + (index + 1) }}:
              {{ singleType.properties.display_name }}{{ $t('resultDescription.between', {start: singleType.properties.start, end: singleType.properties.end }) }}
            </div>
          </div>
        </div>
      </div>
    </selected-region>
  </div>
</template>

<script>
import EchartAddon from './common/addon.js'
import { commonChartOptions } from '@/components/display/common/chart-addon'
import { monitorVisualMap, monitorMarkLine, getDrillDownTool } from '@/components/display/common/addons'
import {
  colorOnly1,
  colorOnly2,
  color5,
  color12,
  gridDefault,
  xAxisDefault,
  yAxisDefault,
  seriesItemLine,
  seriesItemLineStack,
  seriesItemBar,
  seriesItemPie,
  seriesItemDoughnut,
  seriesItemMarkLine,
  seriesItemPieLabelWithValue,
  parallelZoomIn
} from './common/addons'

const echartAddon = new EchartAddon({
  'grid:default': gridDefault(),
  'yAxis:default': yAxisDefault(),
  'seriesItem:bar': seriesItemBar(),
  'seriesItem:line': seriesItemLine(),
  'seriesItem:lineStack': seriesItemLineStack(),
  'seriesItem:pie': seriesItemPie(),
  'seriesItem:pieLabelWithValue': seriesItemPieLabelWithValue(),
  'seriesItem:doughnut': seriesItemDoughnut(),
  'seriesItem:markLine': seriesItemMarkLine()
})

export default {
  name: 'DisplayBarChart',
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
    addons: { type: [Object, Array], default: () => ([]) },
    height: {type: String, default: '420px'},
    canDownloadCsv: {
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
    }
  },
  data () {
    echartAddon.mapping({
      'seriesItem:bar': {
        'large': true
      },
      'color:10': {},
      'grid:default': {},
      'yAxis:default': {}
    })
    return {
      addonOptions: JSON.parse(JSON.stringify(echartAddon.options)),
      addonSeriesItem: JSON.parse(JSON.stringify(echartAddon.seriesItem)),
      addonSeriesData: JSON.parse(JSON.stringify(echartAddon.seriesData)),
      addonSeriesItems: JSON.parse(JSON.stringify(echartAddon.seriesItems)),
      selectedData: [],
      showPagination: true,
      currentChartType: 'bar'
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

      config.toolbox.feature.myShowLabel.show = true
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
            // barChart 為 1C1N(2N) 問句，原始資料第一欄為 Category，因此和第一列(header)都不用 formatComma
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
          if (datas[i].value[i + 1] === null || datas[i].value[i + 1] === undefined) continue
          let marker = datas[i].marker ? datas[i].marker : `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${datas[i].color.colorStops[0].color};"></span>`
          res += marker + datas[i].seriesName + '：' + this.formatComma(datas[i].value[i + 1]) + '<br/>'
        }
        return res
      }
      // 為了讓只有 line chart 跟 bar chart 才顯示，所以加在這邊
      config.toolbox.feature.magicType.show = true
      // 只有一個分類
      if (this.dataset.columns.length === 1) {
        config.toolbox.feature.magicType.type = ['line', 'bar']
      }
      config.xAxis.name = this.title.xAxis.length > 0 ? this.title.xAxis[0].display_name.replace(/ /g, '\r\n') : null
      config.yAxis.name = this.title.yAxis.length > 0 ? this.title.yAxis[0].display_name : null
      // 開啟點擊觸發事件
      config.xAxis.triggerEvent = true
      config.yAxis.triggerEvent = true

      // 數量大的時候出現 scroll bar
      if (this.dataset.data.length > 30) {
        // config.xAxis.axisLabel.interval = 0
        // config.dataZoom = xAxisScroll(20 * 100 / this.dataset.data.length)
        config.dataZoom = parallelZoomIn()
        config.animation = false
      }
      config.toolbox.show = this.showToolbox

      // 是否隱藏 legend
      if (!this.isShowLegend) config.legend.show = false
      // 上下限
      if (this.title.yAxis.length > 0) {
        let upperLimit = this.title.yAxis[0].upperLimit || null
        let lowerLimit = this.title.yAxis[0].lowerLimit || null
        if (upperLimit !== null || lowerLimit !== null) {
          // 處理顏色
          config.visualMap = monitorVisualMap(upperLimit, lowerLimit)
          // markline
          config.series[0].markLine = monitorMarkLine(upperLimit, lowerLimit)
        }
      }

      return config
    },
    colorList () {
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
    }
  },
  mounted () {
    this.exportCSVFile(this.$el, this.appQuestion, this)
  },
  methods: {
    chartClicked (params) {
      let dataInfo = []
      // handle click event from axis label
      if ((params.componentType === 'xAxis' || params.componentType === 'yAxis') && params.targetType === 'axisLabel') {
        dataInfo.push({
          ...this.title[params.componentType][0],
          value: params.value
        })
      }

      // handle click event from a bar on the chart
      if (params.componentType === 'series') {
        params.dimensionNames.forEach((name, index) => {
          dataInfo.push({
            ...this.title[index === 0 ? 'xAxis' : 'yAxis'][0],
            value: params.value[index]
          })
        })
      }
      dataInfo = dataInfo.filter(data => data.dc_id && data.stats_type)
      if (dataInfo.length > 0) this.$emit('clickChart', dataInfo)
    },
    composeColumn (element, colIndex) {
      const labelFormatter = this.chartLabelFormatter
      const maxValue = this.getChartMaxData(this.dataset.data)
      return {
        // 如果有 column 經過 Number() 後為數字 ，echart 會畫不出來，所以補個空格給他
        name: isNaN(Number(element)) ? element : ' ' + element,
        ...this.addonSeriesItem,
        ...this.addonSeriesItems[colIndex],
        connectNulls: true,
        ...(this.isShowLabelData && {
          label: {
            position: 'top',
            show: true,
            fontSize: 10,
            color: '#fff',
            formatter (value) { 
              let num = value.data[colIndex + 1]
              return labelFormatter(num, maxValue[colIndex]) 
            }
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
    magicTypeChanged (params) {
      if (!params.currentType || params.currentType === this.currentChartType) return
      this.currentChartType = params.currentType
    },
    brushRegionSelected (params) {
      if (
        (this.currentChartType === 'bar' && params.batch[0].selected[0].dataIndex.length === 0)
        || (this.currentChartType === 'line' && params.batch[0].areas.length === 0)
      ) return this.selectedData = []

      // 垂直方向 drill down
      if (this.title.yAxis[0].drillable) {
        this.selectedData = params.batch[0].areas.map(areaElement => {
          let coordRange = areaElement.coordRange
          return {
            type: 'range',
            properties: {
              dc_id: this.title.yAxis[0].dc_id,
              data_type: this.title.yAxis[0].data_type,
              display_name: this.title.yAxis[0].display_name,
              start: this.roundNumber(coordRange[0]),
              end: this.roundNumber(coordRange[1])
            }
          }
        })
      } else {
        // 水平方向 drill down
        let dataValueIndexs
        if (this.currentChartType === 'bar') {
          dataValueIndexs = params.batch[0].selected[0].dataIndex
        } else if (this.currentChartType === 'line') {
          // 取出所有選項的始末 index 組合
          const allDataValueIndexs = params.batch[0].areas.reduce((accIndexs, curAreaElement) => {
            const [startIndex, endIndex] = curAreaElement.coordRange
            // 補足始末間的連續數值
            accIndexs.push(...[...Array(endIndex - startIndex + 1).keys()].map(i =>  i + startIndex))
            return accIndexs
          }, [])
          // 只取不重複的 index 升冪排序
          dataValueIndexs  = [...new Set(allDataValueIndexs)].sort((a, b) => a - b)
        }

        this.selectedData = [{
          type: 'enum',
          properties: {
            dc_id: this.title.xAxis[0].dc_id,
            data_type: this.title.xAxis[0].data_type,
            display_name: this.title.xAxis[0].display_name,
            datavalues: dataValueIndexs.map(element => this.dataset.index[element]),
            display_datavalues: dataValueIndexs.map(element => {
              return this.dataset.display_index ? this.dataset.display_index[element] : this.dataset.index[element]
            })
          }
        }]
      }
    },
    saveFilter () {
      this.$store.commit('dataSource/setFilterList', this.selectedData)
    }
  }
}
</script>
