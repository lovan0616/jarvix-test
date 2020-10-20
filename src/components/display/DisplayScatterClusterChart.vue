<template>
  <div class="display-scatter-cluster-chart">
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
    <div 
      v-if="dataset.descriptions && dataset.descriptions.length > 0"
      class="description"
    >
      <span 
        v-for="(description, index) in dataset.descriptions" 
        :key="index" 
        class="description__item">{{ description }}</span>
    </div>
  </div>
</template>
<script>
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'
import { 
  getDrillDownTool, 
  parallelZoomIn, 
  verticalZoomIn,
  color5,
  color12,
  convertHexToRGBA 
} from '@/components/display/common/addons.js'
import i18n from '@/lang/index.js'
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
    // itemStyle: {
    //   color: chartVariable['lightestChartColor']
    // },
    data: [],
    type: 'scatter',
    large: true
  }
}

const dummyDataSet =  {
  data: [
    [
      [
        328,
        328
      ],
      [
        2132,
        1066
      ],
      [
        685,
        228.33
      ],
      [
        111,
        37
      ],
      [
        2161,
        1080.5
      ],
      [
        122,
        40.67
      ],
      [
        2520,
        1260
      ],
      [
        55,
        18.33
      ],
      [
        167,
        167
      ],
      [
        1691,
        563.67
      ],
      [
        496,
        248
      ],
      [
        11,
        5.5
      ],
      [
        200,
        66.67
      ],
      [
        441,
        147
      ],
      [
        60,
        60
      ],
      [
        722,
        240.67
      ],
      [
        415,
        415
      ],
      [
        183,
        61
      ],
      [
        2252,
        750.67
      ],
      [
        899,
        899
      ],
      [
        2246,
        2246
      ],
      [
        157,
        52.33
      ],
      [
        384,
        128
      ],
      [
        1030,
        343.33
      ],
      [
        399,
        399
      ],
      [
        2762,
        920.67
      ],
      [
        2945,
        2945
      ],
      [
        1630,
        543.33
      ],
      [
        2612,
        2612
      ],
      [
        37,
        37
      ],
      [
        104,
        34.67
      ],
      [
        164,
        164
      ],
      [
        172,
        57.33
      ],
      [
        112,
        112
      ],
      [
        143,
        71.5
      ],
      [
        61,
        61
      ],
      [
        123,
        123
      ],
      [
        338,
        338
      ],
      [
        352,
        176
      ],
      [
        174,
        87
      ],
      [
        618,
        618
      ],
      [
        1252,
        626
      ],
      [
        215,
        71.67
      ],
      [
        110,
        36.67
      ]
    ],
    [
      [
        268,
        89.33
      ],
      [
        920,
        920
      ],
      [
        570,
        570
      ],
      [
        1100,
        1100
      ],
      [
        1141,
        570.5
      ],
      [
        866,
        433
      ],
      [
        1122,
        374
      ],
      [
        2480,
        2480
      ],
      [
        1133,
        377.67
      ],
      [
        1006,
        1006
      ],
      [
        206,
        68.67
      ],
      [
        1168,
        1168
      ],
      [
        236,
        118
      ],
      [
        367,
        122.33
      ],
      [
        1054,
        1054
      ],
      [
        18,
        18
      ]
    ]
  ],
  outliersBuckets: [
    [
      200,
      66.67
    ],
    [
      441,
      147
    ],
    [
      60,
      60
    ],
    [
      722,
      240.67
    ],
    [
      415,
      415
    ]
  ],
  columns: [
    '分群1',
    '分群2',
    '分群3',
    '分群4'
  ],
  descriptions: [
    'JarviX發現收入有 4 種群體並且有 0 %的異常資料。',
    '各群體佔比是相近的'
  ],
}

export default {
  name: 'DisplayScatterClusterChart',
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
    },
    coefficients: {
      type: Array,
      default: null
    },
    clusterInfos: {
      type: Array,
      default: () => ([])
    },
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

      // 不顯示"全選"按鈕
      if (dummyDataSet.data.length < 1) chartAddon.legend.selector = false

      // legend 顯示設定
      chartAddon.legend = {
        ...chartAddon.legend,
        data: [
          ...dummyDataSet.columns,
          ...((dummyDataSet.outliersBuckets && dummyDataSet.outliersBuckets.length > 0) && [this.$t('clustering.outlier')])
        ]
      }
      
      // 開啟工具列的 dataZoom 工具
      chartAddon.toolbox.feature.dataZoom.show = true
      chartAddon.xAxis.name = this.title.xAxis[0].display_name
      chartAddon.yAxis.name = this.title.yAxis[0].display_name
      
      /**
       * 處理 dataZoom
       **/
      // 找出 X 的最大值和最小值
      let minX = dummyDataSet.data[0][0][0]
      let maxX = dummyDataSet.data[0][0][0]
      let minY = dummyDataSet.data[0][0][1]
      let maxY = dummyDataSet.data[0][0][1]
      dummyDataSet.data.forEach(group => {
        group.forEach(element => {
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

      const dotsAmount = [].concat.apply([], [
        ...dummyDataSet.data,
        ...((dummyDataSet.outliersBuckets && dummyDataSet.outliersBuckets.length > 0) && [dummyDataSet.outliersBuckets])
      ]).length
      
      dummyDataSet.data.forEach((group, index) => {
        chartAddon.series.push({
          ...scatterOptions.chartData,
          symbolSize: this.dotSize(dotsAmount),
          data: group,
          name: dummyDataSet.columns[index]
        })
      })

      // 處理分群分群
      if (dummyDataSet.outliersBuckets && dummyDataSet.outliersBuckets.length > 0) {
        scatterOptions.chartData.symbolSize = this.dotSize(dummyDataSet.data.length)
        chartAddon.series.push({
          ...scatterOptions.chartData,
          data: dummyDataSet.outliersBuckets,
          name: this.$t('clustering.outlier')
        })
      }

      chartAddon.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.series[0].data
        let maxLength = dataset.length > 1000 ? 1000 : dataset.length
        let table = '<div style="text-align: text;padding: 0 16px;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">' + this.$t('chart.export') + '</button></div>' +
          `<div style="margin-top: 16px;padding: 0 16px;">${maxLength === 1000 ? this.$t('resultDescription.displayTopData', {count: maxLength}) : this.$t('resultDescription.displayTotalData', {count: maxLength})}</div>` +
          '<table style="width:100%;padding: 0 16px;"><tbody><tr>' +
          `<td style="padding: 4px 12px;">${i18n.t('clustering.cluster')}</td>` +
          '<td style="padding: 4px 12px;">' + this.title.xAxis[0].display_name + '</td>' +
          '<td style="padding: 4px 12px;">' + this.title.yAxis[0].display_name + '</td>' +
          '</tr>'

        for (let serieIndex = 0; serieIndex < opt.series.length; serieIndex++) {
          for (let itemIndex = 0; itemIndex < opt.series[serieIndex].data.length; itemIndex++) {
            table += `<tr style='background-color:${maxLength % 2 !== 0 ? 'rgba(35, 61, 64, 0.6)' : 'background: rgba(50, 75, 78, 0.6)'}'>
              <td style="padding: 4px 12px;">${opt.series[serieIndex].name}</td><td style="padding: 4px 12px;">${opt.series[serieIndex].data[itemIndex][0]}</td><td style="padding: 4px 12px;">${opt.series[serieIndex].data[itemIndex][1]}</td>
            </tr>`
            maxLength--
            if (maxLength === 0) break
          }
        }

        table += '</tbody></table>'
        return table
      }
      // export data
      this.$nextTick(() => {
        this.$el.addEventListener('click', (e) => {
          if (e.target && e.target.id === 'export-btn') {
            let exportData = JSON.parse(JSON.stringify(dummyDataSet.data))
            exportData.unshift([this.title.xAxis[0].display_name, this.title.yAxis[0].display_name])
            this.exportToCSV(this.appQuestion, exportData)
          }
        })
      })

      // if (this.coefficients) {
      //   let lineData = []
      //   let expression = ''
      //   let interval = this.floatSub(maxX, minX) / this.correlationLinePoint
      //   if (this.coefficients.length === 2) {
      //     // ax + b
      //     let offset = this.coefficients[0]
      //     let gradient = this.coefficients[1]
      //     // 迴歸線點
      //     for (let i = 0; i < this.correlationLinePoint; i++) {
      //       let xPoint = minX + interval * i
      //       lineData.push([xPoint, this.roundNumber(gradient * xPoint + offset, 4)])
      //     }
      //     let displayOffset = this.formula ? this.formula[0] : Number((offset).toFixed(4))
      //     let displayGradient = this.formula ? this.formula[1] : Number((gradient).toFixed(4))
      //     expression = `y = ${displayOffset} ${displayGradient > 0 ? '+' : '-'} ${Math.abs(displayGradient)}x`
      //   } else {
      //     // ax^2 + bx + c
      //     let offset = this.coefficients[0]
      //     let firstDegree = this.coefficients[1]
      //     let secondDegree = this.coefficients[2]
      //     // 迴歸線點
      //     for (let i = 0; i < this.correlationLinePoint; i++) {
      //       let xPoint = minX + interval * i
      //       lineData.push([xPoint, secondDegree * xPoint * xPoint + firstDegree * xPoint + offset])
      //     }
      //     let displayOffset = this.formula ? this.formula[0] : Number((offset).toFixed(4))
      //     let displayFirstDegree = this.formula ? this.formula[1] : Number((firstDegree).toFixed(4))
      //     let displaySecondDegree = this.formula ? this.formula[2] : Number((secondDegree).toFixed(4))
      //     expression = `y = ${displayOffset} ${displayFirstDegree > 0 ? '+' : '-'} ${Math.abs(displayFirstDegree)}x ${displaySecondDegree > 0 ? '+' : '-'} ${Math.abs(displaySecondDegree)}x^2`
      //   }

      //   // 確保回歸線最後一個點要顯示在畫面上，因為 label 標示在最後一個點
      //   let lastFormulaPoint = lineData[lineData.length - 1]
      //   displayYaxisMax = lastFormulaPoint[1] > displayYaxisMax ? lastFormulaPoint[1] + yAxisBuffer : displayYaxisMax
      //   displayYaxisMin = lastFormulaPoint[1] < displayYaxisMin ? lastFormulaPoint[1] - yAxisBuffer : displayYaxisMin

      //   // markLine
      //   chartAddon.series[dummyDataSet.data.length] = {
      //     name: '',
      //     type: 'line',
      //     showSymbol: false,
      //     smooth: true,
      //     color: '#FF9559',
      //     symbol: 'none',
      //     data: lineData,
      //     markPoint: {
      //       itemStyle: {
      //         normal: {
      //           color: 'transparent'
      //         }
      //       },
      //       label: {
      //         show: true,
      //         position: 'left',
      //         formatter: expression,
      //         width: '100%',
      //         lineHeight: 14,
      //         padding: this.coefficients.length === 2 ? [1, 2, 1, 22] : [1, 2, 1, 50],
      //         textStyle: {
      //           color: '#FF9559',
      //           fontSize: 14
      //         },
      //         backgroundColor: '#000'
      //       },
      //       data: [
      //         {
      //           coord: lineData[lineData.length - 1]
      //         }
      //       ]
      //     }
      //   }
      // }

      // zoom 的預設範圍，因為需要考慮回歸線的點所以寫在這邊
      const verticalZoomConfig = verticalZoomIn()
      chartAddon.yAxis.max = this.roundNumber(displayYaxisMax, 4)
      chartAddon.yAxis.min = this.roundNumber(displayYaxisMin, 4)
      chartAddon.dataZoom = [...parallelZoomConfig, ...verticalZoomConfig]
      chartAddon.color = color5
      return chartAddon
    },
    chartStyle () {
      return {
        width: '100%',
        height: '420px'
      }
    },
    colorSet () {
      // 設定透明度讓 scatter chart 中重疊的點能被凸顯出來
      const opacity = 0.7
      // 如果沒有 outlier 會拿到空陣列
      const hasOutlier = dummyDataSet.outliersBuckets.length > 0
      const colorAmountNeeded = hasOutlier ? dummyDataSet.columns.length + 1 : dummyDataSet.columns.length
      let colorList
      switch (colorAmountNeeded) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          colorList = color5
          break
        default:
          colorList = color12
          break
      }
      return colorList.map(color => convertHexToRGBA(color, opacity))
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
                start: this.title.xAxis[0].stats_type.toLowerCase() === 'numeric' ? coordRange[0][0] : dummyDataSet.index[coordRange[0][0]],
                end: this.title.xAxis[0].stats_type.toLowerCase() === 'numeric' ? coordRange[0][1] : dummyDataSet.index[coordRange[0][1]]
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

<style lang="scss" scoped>
.display-scatter-cluster-chart {
  .description {
    margin-top: 40px;
    background: #141C1D;
    border-radius: 8px;
    padding: 10px 20px;

    &__item {
      font-size: 14px;
      letter-spacing: 0.1em;
    }
  }
}
</style>