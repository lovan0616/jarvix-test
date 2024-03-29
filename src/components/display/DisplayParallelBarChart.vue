<template>
  <div class="display-basic-chart">
    <button
      v-if="lineChartData"
      class="btn-m btn-default change-diagram-btn"
      @click="changeDiagram"
    >
      {{ $t('button.changeDiagram') }}
    </button>
    <display-line-chart
      v-if="showLineChart && lineChartData"
      :dataset="lineChartData.dataset"
      :title="lineChartData.title"
    />
    <v-echart
      v-else
      :style="chartStyle"
      :options="options"
      auto-resize
      @brushselected="brushRegionSelected"
      @click="chartClicked"
    />
    <arrow-button
      v-show="showPagination"
      v-if="hasPagination"
      is-vertical
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
          <div class="filter-description">
            <div class="column-name">
              {{ $t('resultDescription.restrict') + (index + 1) }}:
            </div>
            <div
              v-for="(singleData, propertiesIndex) in singleType.restraints"
              :key="'enum-' + propertiesIndex"
              class="single-filter"
            >
              {{ singleData.properties.display_name }} = {{ singleData.properties.display_datavalues[0] }}<span v-show="propertiesIndex !== singleType.restraints.length - 1">、</span>
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
import { getDrillDownTool, monitorVisualMap, monitorMarkLine } from '@/components/display/common/addons'
import {
  parallelColorOnly1,
  parallelColorOnly2,
  color5,
  color12,
  gridDefault,
  yAxisParallel,
  yAxisDefault,
  seriesItemBar,
  seriesItemMarkLine,
  verticalZoomIn
} from './common/addons'

const echartAddon = new EchartAddon({
  'grid:default': gridDefault(),
  'yAxis:parallel': yAxisParallel(),
  'xAxis:parallel': yAxisDefault(),
  'seriesItem:bar': seriesItemBar(),
  'seriesItem:markLine': seriesItemMarkLine()
})

export default {
  name: 'DisplayParallelBarChart',
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
    height: { type: String, default: '420px' },
    hasPagination: {
      type: Boolean,
      default: false
    },
    canDownloadCsv: {
      type: Boolean,
      default: false
    },
    isShowToolbox: {
      type: Boolean,
      default: true
    },
    customChartStyle: {
      type: Object,
      default: () => {}
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
        large: true
      },
      'color:10': {},
      'grid:default': {},
      'xAxis:parallel': {},
      'yAxis:parallel': {}
    })
    return {
      addonOptions: JSON.parse(JSON.stringify(echartAddon.options)),
      addonSeriesItem: JSON.parse(JSON.stringify(echartAddon.seriesItem)),
      addonSeriesItems: JSON.parse(JSON.stringify(echartAddon.seriesItems)),
      selectedData: [],
      showPagination: true,
      showLineChart: false
    }
  },
  computed: {
    chartStyle () {
      return {
        width: '100%',
        // minHeight: this.height,
        overflow: 'auto',
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
        ...this.addonOptions,
        ...getDrillDownTool(this.$route.name, this.title, true, true),
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
      // 目前 echarts 4.9.0 看起來切換有問題，先隱藏
      // config.toolbox.feature.magicType.show = true
      // 圖表是水平
      config.xAxis = yAxisDefault()
      config.xAxis.name = this.title.yAxis.length > 0 ? this.title.yAxis[0].display_name : null
      config.yAxis = yAxisParallel()
      config.yAxis.name = this.title.xAxis.length > 0 ? this.title.xAxis.reduce((acc, cur, index) => acc + (index !== 0 ? ', ' : '') + cur.display_name.replace(/ /g, '\r\n'), '') : null
      // 如果是 bar chart
      config.yAxis.scale = true
      // 開啟點擊觸發事件
      config.xAxis.triggerEvent = true
      config.yAxis.triggerEvent = true

      // 數量大的時候出現 scroll bar
      if (this.dataset.data.length > 20) {
        // config.yAxis.axisLabel.interval = 0
        // config.dataZoom = yAxisScroll(20 * 100 / this.dataset.data.length)
        config.dataZoom = verticalZoomIn()
        config.animation = false
      }
      config.toolbox.show = this.isShowToolbox

      // 是否隱藏 legend
      if (!this.isShowLegend) config.legend.show = false
      // 上下限
      let upperLimit = this.title.yAxis[0].upperLimit || null
      let lowerLimit = this.title.yAxis[0].lowerLimit || null
      let customMarkLine = this.title.yAxis[0].markLine || []
      if (upperLimit !== null || lowerLimit !== null) {
        config.visualMap = monitorVisualMap(upperLimit, lowerLimit, parallelColorOnly1[0])
        // 門檻線
        config.series[0].markLine = monitorMarkLine([upperLimit, lowerLimit, ...customMarkLine], true)
      } else if (upperLimit === null && lowerLimit === null && customMarkLine.length > 0) {
        // markline
        config.series[0].markLine = monitorMarkLine(customMarkLine)
        config.visualMap = monitorVisualMap(null, { value: 0 }, parallelColorOnly1[0])
      }
      return config
    },
    colorList () {
      switch (this.series.length) {
        case 1:
          return parallelColorOnly1
        case 2:
          return parallelColorOnly2
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
    lineChartData () {
      // 判斷是否為 2c1t
      if (this.dataset.index.length === 0) return false
      if (this.dataset.index[0].length !== 2) return false
      if (this.dataset.columns.length > 1) return false
      // 在戰情室的話也不讓他切換圖表
      if (!this.isShowToolbox) return false

      let lineChartIndex = []
      let lineChartColumns = []
      let lineChartData = []
      this.dataset.index.forEach((element, index) => {
        let xAxisIndex = lineChartIndex.findIndex(value => value === element[0])
        let currentIndexLength = lineChartIndex.length
        let seriesIndex = lineChartColumns.findIndex(value => value === element[1])
        let currentSeriesLength = lineChartColumns.length
        if (xAxisIndex < 0) {
          lineChartIndex.push(element[0])
          xAxisIndex = currentIndexLength
          currentIndexLength += 1
          lineChartData.push(Array(currentSeriesLength).fill(null))
        }
        if (seriesIndex < 0) {
          lineChartColumns.push(element[1])
          seriesIndex = currentSeriesLength
          currentSeriesLength += 1

          for (let i = 0; i < currentIndexLength; i++) {
            lineChartData[i].push(null)
          }
        }
        lineChartData[xAxisIndex][seriesIndex] += this.dataset.data[index][0]
      })
      // 關掉 drill down
      let xAxis = { ...this.title.xAxis[0] }
      xAxis.drillable = false

      return {
        dataset: {
          index: lineChartIndex,
          data: lineChartData,
          columns: lineChartColumns
        },
        title: {
          xAxis: [xAxis],
          yAxis: this.title.yAxis
        }
      }
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
        const columnList = params.value.split(',')
        columnList.forEach((name, index) => {
          const axis = params.componentType === 'xAxis' ? 'yAxis' : 'xAxis'
          dataInfo.push({
            ...this.title[axis][index],
            value: name
          })
        })
      }

      // handle click event from a bar on the chart
      if (params.componentType === 'series') {
        params.dimensionNames.forEach((name, index) => {
          if (name === 'index') {
            params.value[index].split(',').forEach((column, columnIndex) => {
              dataInfo.push({
                ...this.title.xAxis[columnIndex],
                value: column
              })
            })
          } else {
            dataInfo.push({
              ...this.title.yAxis[0],
              value: params.value[index]
            })
          }
        })
      }
      dataInfo = dataInfo.filter(data => data.dc_id && data.stats_type)
      if (dataInfo.length > 0) this.$emit('clickChart', dataInfo)
    },
    changeDiagram () {
      this.showLineChart = !this.showLineChart
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
            position: 'right',
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
    brushRegionSelected (params) {
      if (params.batch[0].selected[0].dataIndex.length === 0) {
        this.selectedData = []
        return false
      }

      this.selectedData = params.batch[0].selected[0].dataIndex.map(indexValue => {
        let restraints = this.title.xAxis.map((axis, index) => {
          return {
            type: 'enum',
            properties: {
              dc_id: axis.dc_id,
              data_type: axis.data_type,
              display_name: axis.display_name,
              datavalues: [this.dataset.index[indexValue][index]],
              display_datavalues: this.dataset.display_index ? [this.dataset.display_index[indexValue][index]] : [this.dataset.index[indexValue][index]]
            }
          }
        }).filter((element, index) => {
          return this.title.xAxis[index].drillable
        })

        return {
          type: 'compound',
          restraints: restraints
        }
      }).filter((element, index, self) => {
        return self.findIndex((item, restrictionIndex) => {
          let mapArray = item.restraints.filter((restrict, restrictIndex) => {
            return restrict.properties.dc_id === element.restraints[restrictIndex].properties.dc_id && restrict.properties.datavalues[0] === element.restraints[restrictIndex].properties.datavalues[0]
          })
          return mapArray.length === item.restraints.length
        }) === index
      })
    },
    saveFilter () {
      this.$store.dispatch('dataFrameAdvanceSetting/updateFilterListByData', this.selectedData)
    }
  }
}
</script>
<style lang="scss" scoped>
.display-basic-chart {
  position: relative;

  .change-diagram-btn {
    position: absolute;
    right: 0;
    top: -32px;
  }
}
</style>
