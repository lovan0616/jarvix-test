<template>
  <div class="display-scatter-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
      @brushselected="brushRegionSelected"
    />
    <selected-region
      v-if="selectedData.length > 0"
      :title="$t('resultDescription.currentChosenArea')"
      @save="saveFilter"
    >
      <div 
        slot="selectedFilterRegion" 
        class="region-description">
        <div 
          v-for="(singleArea, index) in selectedData"
          :key="index"
          class="single-area"
        >
          {{ $t('resultDescription.area') + (index + 1) }}:
          <span
            v-for="(singleRestraint, restraintIndex) in singleArea.restraints"
            :key="'restraint' + index + '-' + restraintIndex"
          >
            {{ singleRestraint.properties.display_name }} {{ $t('resultDescription.between', {start: roundNumber(singleRestraint.properties.start), end: roundNumber(singleRestraint.properties.end) }) }}
            <span
              v-show="restraintIndex !== singleArea.restraints.length - 1"
            >、</span>
          </span>
        </div>
      </div>
    </selected-region>
  </div>
</template>
<script>
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'
import { getDrillDownTool, parallelZoomIn, verticalZoomIn } from '@/components/display/common/addons.js'
let scatterChartConfig = {
  xAxisSplitLine: {
    show: false
  },
  yAxisSplitLine: {
    lineStyle: {
      type: 'dashed',
      color: chartVariable['splitLineColor']
    }
  },
  chartData: {
    symbolSize: 8,
    itemStyle: {
      color: chartVariable['lightestChartColor']
    },
    data: [],
    type: 'scatter',
    large: true
  }
}

export default {
  name: 'DisplayScatterChart',
  props: {
    dataset: {
      type: Object,
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
    formula: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      selectedData: [],
      correlationLinePoint: 100
    }
  },
  computed: {
    chartOption () {
      let chartAddon = {...JSON.parse(JSON.stringify(chartOptions())), ...getDrillDownTool(this.$route.name, this.title)}
      let scatterOptions = JSON.parse(JSON.stringify(scatterChartConfig))
      this.$set(chartAddon.xAxis, 'splitLine', scatterOptions.xAxisSplitLine)
      this.$set(chartAddon.yAxis, 'splitLine', scatterOptions.yAxisSplitLine)
      chartAddon.tooltip = {
        confine: true,
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          axis: 'auto',
          snap: true
        },
        formatter: (params, ticket, callback) => {
          return params.reduce((res, item, index) => {
            // 過濾掉回歸線
            if (item.seriesType !== 'scatter') return
            // 多個點同一個 x 軸時增加間距
            if (index > 0 && index < params.length) res += '<div style="padding-bottom: 4px;"></div>'
            return res + `
              ${this.title.xAxis[0].display_name}: ${this.formatComma(item.data[0])}<br/>
              ${this.title.yAxis[0].display_name}: ${this.formatComma(item.data[1])}
            `
          }, '')
        }
      }

      // 不顯示“全選”按鈕
      chartAddon.legend.selector = false
      // 開啟工具列的 dataZoom 工具
      chartAddon.toolbox.feature.dataZoom.show = true
      chartAddon.xAxis.name = this.title.xAxis[0].display_name
      chartAddon.yAxis.name = this.title.yAxis[0].display_name
      
      /**
       * 處理 dataZoom
       **/
      // 找出 X 的最大值和最小值
      let minX = this.dataset.data[0][0]
      let maxX = this.dataset.data[0][0]
      let minY = this.dataset.data[0][1]
      let maxY = this.dataset.data[0][1]
      this.dataset.data.forEach(element => {
        if (element[0] !== null) {
          if (minX === null) minX = element[0]
          if (maxX === null) maxX = element[0]
          maxX = element[0] > maxX ? element[0] : maxX
          minX = element[0] < minX ? element[0] : minX
        }
        if (element[1] !== null) {
          if (minY === null) minY = element[1]
          if (maxY === null) maxY = element[1]
          maxY = element[1] > maxY ? element[1] : maxY
          minY = element[1] < minY ? element[1] : minY
        }
      })

      /**
       * 處理 X 軸
       */
      let displayXaxisMin
      let displayXaxisMax
      const parallelZoomConfig = parallelZoomIn()
      let xAxisBuffer = (maxX - minX) / 2
      let xAxisPadding = (maxX - minX) / 10
      displayXaxisMax = maxX + xAxisBuffer < 0 ? 0 : maxX + xAxisBuffer
      displayXaxisMin = minX - xAxisBuffer > 0 ? 0 : minX - xAxisBuffer
      let xAxisDisplayRange = displayXaxisMax - displayXaxisMin
      parallelZoomConfig[0].start = (minX - xAxisPadding - displayXaxisMin) * 100 / xAxisDisplayRange
      parallelZoomConfig[0].end = (maxX + xAxisPadding - displayXaxisMin) * 100 / xAxisDisplayRange
      // x 軸顯示區間
      chartAddon.xAxis.max = this.roundNumber(displayXaxisMax, 4)
      chartAddon.xAxis.min = this.roundNumber(displayXaxisMin, 4)

      /**
       * 處理 Y 軸
       */
      let displayYaxisMin
      let displayYaxisMax
      let yAxisBuffer = (maxY - minY) / 2

      displayYaxisMax = maxY + yAxisBuffer < 0 ? 0 : maxY + yAxisBuffer
      displayYaxisMin = minY - yAxisBuffer > 0 ? 0 : minY - yAxisBuffer

      scatterOptions.chartData.data = this.dataset.data
      scatterOptions.chartData.symbolSize = this.dotSize(this.dataset.data.length)
      chartAddon.series[0] = scatterOptions.chartData
      chartAddon.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.series[0].data
        let maxLength = dataset.length > 1000 ? 1000 : dataset.length
        let table = '<div style="text-align: text;padding: 0 16px;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">' + this.$t('chart.export') + '</button></div>' +
          `<div style="margin-top: 16px;padding: 0 16px;">${maxLength === 1000 ? this.$t('resultDescription.displayTopData', {count: maxLength}) : this.$t('resultDescription.displayTotalData', {count: maxLength})}</div>` +
          '<table style="width:100%;padding: 0 16px;"><tbody><tr>' +
          '<td style="padding: 4px 12px;">' + this.title.xAxis[0].display_name + '</td>' +
          '<td style="padding: 4px 12px;">' + this.title.yAxis[0].display_name + '</td>' +
          '</tr>'
        for (let i = 1; i < maxLength; i++) {
          table += `<tr style='background-color:${i % 2 !== 0 ? 'rgba(35, 61, 64, 0.6)' : 'background: rgba(50, 75, 78, 0.6)'}'>
            <td style="padding: 4px 12px;">${dataset[i][0]}</td><td style="padding: 4px 12px;">${dataset[i][1]}</td>
          </tr>`
        }
        table += '</tbody></table>'
        return table
      }
      // export data
      this.$nextTick(() => {
        this.$el.addEventListener('click', (e) => {
          if (e.target && e.target.id === 'export-btn') {
            let exportData = JSON.parse(JSON.stringify(this.dataset.data))
            exportData.unshift([this.title.xAxis[0].display_name, this.title.yAxis[0].display_name])
            this.exportToCSV(this.appQuestion, exportData)
          }
        })
      })

      if (this.formula) {
        let lineData = []
        let expression = ''
        let interval = this.floatSub(maxX, minX) / this.correlationLinePoint
        if (this.formula.length === 2) {
          // ax + b
          let offset = Number((this.formula[0]).toFixed(4))
          let gradient = Number((this.formula[1]).toFixed(4))
          // 迴歸線點
          for (let i = 0; i < this.correlationLinePoint; i++) {
            let xPoint = minX + interval * i
            lineData.push([xPoint, this.roundNumber(gradient * xPoint + offset, 4)])
          }
          expression = `y = ${offset} ${gradient > 0 ? '+' : '-'} ${Math.abs(gradient)}x`
        } else {
          // ax^2 + bx + c
          let offset = this.formula[0]
          let firstDegree = this.formula[1]
          let secondDegree = this.formula[2]
          // 迴歸線點
          for (let i = 0; i < this.correlationLinePoint; i++) {
            let xPoint = minX + interval * i
            lineData.push([xPoint, secondDegree * xPoint * xPoint + firstDegree * xPoint + offset])
          }
          expression = `y = ${Number((offset).toFixed(4))} ${firstDegree > 0 ? '+' : '-'} ${Math.abs(Number((firstDegree).toFixed(4)))}x ${secondDegree > 0 ? '+' : '-'} ${Math.abs(Number((secondDegree).toFixed(4)))}x^2`
        }

        // 確保回歸線最後一個點要顯示在畫面上，因為 label 標示在最後一個點
        let lastFormulaPoint = lineData[lineData.length - 1]
        displayYaxisMax = lastFormulaPoint[1] > displayYaxisMax ? lastFormulaPoint[1] + yAxisBuffer : displayYaxisMax
        displayYaxisMin = lastFormulaPoint[1] < displayYaxisMin ? lastFormulaPoint[1] - yAxisBuffer : displayYaxisMin

        // markLine
        chartAddon.series[1] = {
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
              padding: this.formula.length === 2 ? [1, 2, 1, 22] : [1, 2, 1, 50],
              textStyle: {
                color: '#FF9559',
                fontSize: 14
              },
              backgroundColor: '#000'
            },
            data: [
              {
                coord: lineData[lineData.length - 1]
              }
            ]
          }
        }
      }

      
      // y 的顯示區間，暫時先不調整
      // let yAxisBuffer = (maxY - minY) / 2
      // let yAxisPadding = (maxY - minY) / 10
      // displayYaxisMax = maxY + yAxisBuffer < 0 ? 0 : maxY + yAxisBuffer
      // displayYaxisMin = minY - yAxisBuffer > 0 ? 0 : minY - yAxisBuffer
      // let yAxisDisplayRange = displayYaxisMax - displayYaxisMin
      // verticalZoomConfig[0].start = (minY - yAxisPadding - displayYaxisMin) * 100 / yAxisDisplayRange
      // verticalZoomConfig[0].end = (maxY + yAxisPadding - displayYaxisMin) * 100 / yAxisDisplayRange

      // zoom 的預設範圍，因為需要考慮回歸線的點所以寫在這邊
      const verticalZoomConfig = verticalZoomIn()
      chartAddon.yAxis.max = this.roundNumber(displayYaxisMax, 4)
      chartAddon.yAxis.min = this.roundNumber(displayYaxisMin, 4)
      chartAddon.dataZoom = [...parallelZoomConfig, ...verticalZoomConfig]

      return chartAddon
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
    dotSize (dataLength) {
      if (dataLength > 500 && dataLength < 1999) {
        return 4
      } else if (dataLength > 1999 && dataLength < 4999) {
        return 2
      } else if (dataLength > 4999) {
        return 1
      } else {
        return 8
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
          type: 'compound',
          restraints: [
            {
              type: 'range',
              properties: {
                dc_name: this.title.xAxis[0].dc_name,
                data_type: this.title.xAxis[0].data_type,
                display_name: this.title.xAxis[0].display_name,
                start: this.title.xAxis[0].stats_type === 'numeric' ? coordRange[0][0] : this.dataset.index[coordRange[0][0]],
                end: this.title.xAxis[0].stats_type === 'numeric' ? coordRange[0][1] : this.dataset.index[coordRange[0][1]]
              }
            },
            {
              type: 'range',
              properties: {
                dc_name: this.title.yAxis[0].dc_name,
                data_type: this.title.yAxis[0].data_type,
                display_name: this.title.yAxis[0].display_name,
                start: coordRange[1][0],
                end: coordRange[1][1]
              }
            }
          ]
        }
      })
    },
    saveFilter () {
      this.$store.commit('dataSource/setFilterList', this.selectedData)
    }
  },
}
</script>
