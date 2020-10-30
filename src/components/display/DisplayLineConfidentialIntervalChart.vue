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
              {{ singleType.properties.display_name }} {{ $t('resultDescription.between', {start: singleType.properties.start, end: singleType.properties.end }) }}
            </div>
          </div>
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
import { commonChartOptions } from '@/components/display/common/chart-addon'
import chartVariable from '@/styles/chart/variables.scss'
import {
  getDrillDownTool,
  xAxisDefault,
  yAxisDefault
} from './common/addons'

const dummyResponse = {
  success: true,
  data: {
    id: 337345,
    resultId: 65821,
    diagram: 'line_confidential_interval_chart',
    data: {
      title: {
        xAxis: [
          {
            dc_id: null,
            dc_name: 'date',
            operator: null,
            data_type: 'datetime',
            drillable: true,
            is_feature: null,
            lowerLimit: null,
            stats_type: 'datetime',
            upperLimit: null,
            display_name: '日期(月)'
          }
        ],
        yAxis: [
          {
            dc_id: null,
            dc_name: null,
            operator: null,
            data_type: null,
            drillable: false,
            is_feature: null,
            lowerLimit: null,
            stats_type: null,
            upperLimit: null,
            display_name: '數量的平均值'
          }
        ]
      },
      dataset: {
        data: [
          240, 
          222, 
          80, 
          294, 
          300, 
          300, 
          340
        ],
        predictData: [
          270, 
          232, 
          241, 
          284, 
          340, 
          380, 
          360
        ],
        index: [
          '2018年12月',
          '2019年01月',
          '2019年02月',
          '2019年03月',
          '2019年04月',
          '2019年05月',
          '2019年06月'
        ],
        sigma: 3.2,
        // 先給死
        confidenceLevel: 99,
        descriptions: [
          'JarviX發現收入有 4 種群體並且有 0 %的異常資料。',
          '各群體佔比是相近的'
        ],
      }
    },
    status: 'Complete',
    handlerFunction: null,
    // 要做分頁
    page: 0,
    singlePage: false,
    isAutoRefresh: null
  },
  meta: {
    responseTime: '312 ms',
    timestamp: '2020-10-23 02:18:10.355'
  }
}

const dummyDataset = {
        data: [
          287.1,
          288.63,
          289.42,
          288.57,
          292.49,
          288.62,
          289.47,
          289.33,
          292.67,
          289.24,
          291.12,
          288.07
        ],
        index: [
          "2015年01月",
          "2015年02月",
          "2015年03月",
          "2015年04月",
          "2015年05月",
          "2015年06月",
          "2015年07月",
          "2015年08月",
          "2015年09月",
          "2015年10月",
          "2015年11月",
          "2015年12月"
        ],
        sigma: 1.5,
        descriptions: [
          "异常值上下界为模型在95.0%信心水准下展出的预测信赖区间。",
          "模型发现2015年05月时间收入有最大的正异常，异常值为287.4855522070555。"
        ],
        confidenceLevel: 95,
        predictDataList: [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12
        ]
      }

export default {
  name: 'DisplayLineConfidentialIntervalChart',
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
    hasPagination: {
      type: Boolean,
      default: false
    },
    arrowBtnRight: {
      type: Number,
      default: 80
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
        height: '420px'
      }
    },
   seriesName () {
     return [
        this.title.xAxis[0].display_name,
        this.$t('chart.forecastValue'),
        this.$t('chart.lowerBoundValue'),
        this.$t('chart.upperBoundValue'),
        this.$t('chart.normalValue'),
        this.$t('chart.anomalousValue')
      ]
   },
    zValue () {
      const confidentialValue = dummyDataset.confidenceLevel || 99
      switch (confidentialValue) {
        case 90:
          return 1.645
        case 95:
          return 1.960
        case 99: 
          return 2.576
      }
    },
    lowerBoundList () {
      return dummyDataset.predictDataList.map(item => item - this.zValue * dummyDataset.sigma)
    },
    yAxisOffsetValue () {
      return Math.floor(Math.min(0, ...this.lowerBoundList))
    },
    toUpperBoundIntervalList () {
      return dummyDataset.predictDataList.map(item => 2 * this.zValue * dummyDataset.sigma)
    },
    actualDataList () {
      const actualDataList = {
        validDataList: [],
        invalidDataList: []
      }
      dummyDataset.data.forEach((actualValue, index) => {
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
      dummyDataset.index.forEach((value, index) => {
        source.push([
          value, 
          this.adjustValueWithOffsetValue(dummyDataset.predictDataList[index]),
          this.adjustValueWithOffsetValue(this.lowerBoundList[index]), 
          this.toUpperBoundIntervalList[index],
          this.adjustValueWithOffsetValue(this.actualDataList.validDataList[index]),
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
            type: 'dashed'
          },
          markLine: {
            symbol: 'none',
            lineStyle: {
              color: chartVariable['xAxisColor'],
              type: 'solid'
            },
            animation: false,
            data: [{
              yAxis: Math.abs(this.yAxisOffsetValue),
              label: {
              position: 'start',
              formatter: '0',
            },
            }, {
              yAxis: Math.abs(this.yAxisOffsetValue),
              label: {
                position: 'end',
                formatter: this.title.xAxis[0].display_name
              },
            }],
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
            type: 'dashed'
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
            opacity: 0
          },
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
        let res = params[0].name + '<br/>'
        for (let i = 0, length = params.length; i < length; i++) {
          let componentIndex = params[i].componentIndex + 1
          // upperbound 需額外計算
          let diaplayValue = i === 2 ? params[i].value[componentIndex] + params[i].value[2] : params[i].value[componentIndex]
          // 過濾掉 null 值
          if ((i === 3 || i === 4) && params[i].value[componentIndex] === null) continue
          let marker = params[i].marker ? params[i].marker : `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params[i].color.colorStops[0].color};"></span>`
          res += marker + params[i].seriesName + '：' + this.formatComma(diaplayValue) + '<br/>'
        }
        return res
      }

      // 準備原始資料
      config.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.dataset[0].source
        let table = '<div style="text-align: text;padding: 0 16px;position: absolute;width: 100%;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">' + this.$t('chart.export') + '</button></div><table style="width:100%;padding: 0 16px;white-space:nowrap;margin-top: 48px;"><tbody>'
        for (let i = 0; i < dataset.length; i++) {
          let tableData = dataset[i].reduce((acc, cur, index) => {
            let diaplayedValue = cur
            // 計算上限值
            if (index === 3) diaplayedValue = dataset[i][1] + cur
            // 如果為 null 則留空
            if ((index === 4 || index === 5) && cur === null) diaplayedValue = ''
            return acc + '<td style="padding: 4px 12px;">' + diaplayedValue+ '</td>'
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
                element[3] = element[1] + element[3]
                return element
              })

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
            dc_name: this.title.xAxis[0].dc_name,
            data_type: this.title.xAxis[0].data_type,
            display_name: this.title.xAxis[0].display_name,
            start: dummyDataset.index[coordRange[0] < 0 ? 0 : coordRange[0]],
            end: dummyDataset.index[coordRange[1] > dummyDataset.index.length - 1 ? dummyDataset.index.length - 1 : coordRange[1]]
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
.display-line-confidential-interval-chart {
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
