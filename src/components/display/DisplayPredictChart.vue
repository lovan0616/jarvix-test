<template>
  <div class="predict-question-block">
    <div class="display-predict-chart">
      <v-echart
        :style="chartStyle"
        :options="options"
        auto-resize
        @brushselected="brushRegionSelected"
      />
    </div>
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
      v-if="info.length > 0"
      class="predict-detail-region"
    >
      <div class="block-title">{{ $t('resultDescription.predictionInfo') }}</div>
      <div class="predict-detail-block">
        <div 
          v-for="(singleInfo, index) in info"
          :key="index"
          class="single-info-block"
        >
          <div class="info-target">{{ $t("resultDescription.timeOfPredictionInterval", {time: singleInfo.time}) }}</div>
          <div class="info-detail"><div class="info-title">{{ $t('resultDescription.predictionMax') }}</div><div class="info-content">{{ singleInfo.max }}</div></div>
          <div class="info-detail"><div class="info-title">{{ $t('resultDescription.predictionMin') }}</div><div class="info-content">{{ singleInfo.min }}</div></div>
          <div class="info-detail"><div class="info-title">{{ $t('resultDescription.confidenceInterval') }}</div><div class="info-content">{{ singleInfo.diff }}</div></div>
          <div class="info-detail"><div class="info-title">{{ $t('resultDescription.confidenceIndex') }}</div><div class="info-content confidence">{{ singleInfo.conf }}</div></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { commonChartOptions } from '@/components/display/common/chart-addon'
import chartVariable from '@/styles/chart/variables.scss'
import {
  getDrillDownTool,
  colorOnly1,
  colorOnly2,
  color5,
  color12,
  xAxisDefault,
  yAxisDefault
} from './common/addons'

export default {
  name: 'DisplayPredictChart',
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
    info: {
      type: Array,
      default () {
        return []
      }
    },
    isShowLabelData: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedData: []
    }
  },
  computed: {
    chartStyle () {
      return {
        width: '100%',
        height: '420px'
      }
    },
    yAxisOffsetValue () {
      let yAxisMinValue = Infinity
      this.dataset.data.forEach(dataset => {
        // 排除 null 值和區間值
        const datasetWithoutNull = dataset.filter((data, index) => data !== null && index !== 4)
        const datasetMinValue = Math.min(...datasetWithoutNull)
        yAxisMinValue = this.roundNumber(Math.min(0, yAxisMinValue, datasetMinValue))
      })
      return yAxisMinValue
    },
    seriesName () {
     return [
        this.title.xAxis[0].display_name,
        ...this.dataset.columns
      ]
   },
    transformedData () {
      const source = []
      source.push(this.seriesName)
      this.dataset.index.forEach((value, index) => {
        source.push([
          value,
          ...this.dataset.data[index].map((data, index) => {
              // 誤差區間值不用調整
              if(index === 4) return data
              return this.adjustValueWithOffsetValue(data)
            }) 
        ])
      })
      return source
    },
    series () {
      return this.dataset.columns.map((v, colIndex) => {
        let item = {
          name: v,
          type: 'line',
          symbol: 'circle',
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
        }
        switch (colIndex) {
          case 1:
            item['itemStyle'] = {
              color: color12[2]
            }
            break
          case 2:
            item['areaStyle'] = {
              color: 'transparent'
            }
            item['itemStyle'] = {
              color: color12[2]
            }
            item['lineStyle'] = {
              type: 'dashed'
            }
            break
          case 3:
            item['stack'] = 'predict'
            item['areaStyle'] = {
              color: 'transparent'
            }
            item['itemStyle'] = {
              color: color12[3]
            }
            item['lineStyle'] = {
              type: 'dashed'
            }
            break
          case 4:
            item['stack'] = 'predict'
            item['areaStyle'] = {
              color: color12[3],
              opacity: 0.2
            }
            item['lineStyle'] = {
              type: 'dashed'
            }
            break
          case 5:
            item['lineStyle'] = {
              type: 'dashed'
            }
            item['itemStyle'] = {
              color: color12[3]
            }
            break
        }
        const shortenNumberMethod = this.shortenNumber
        return {
          ...item,
          ...(this.isShowLabelData && colIndex !== 2 && {
            label: {
              position: colIndex === 1 ? 'bottom' : 'top',
              show: true,
              fontSize: 10,
              color: '#fff',
              formatter (value) { return shortenNumberMethod(value.data[1], 0) }
            }
          })
        }
      })
    },
    options () {
      let config = {
        xAxis: xAxisDefault(),
        yAxis: {
          ...yAxisDefault(),
          name: this.title.yAxis[0].display_name,
          axisLabel: {
            formatter: value => this.roundNumber(this.yAxisOffsetValue + value)
          }
        },
        ...JSON.parse(JSON.stringify(commonChartOptions())),
        ...getDrillDownTool(this.$route.name, this.title),
        dataset: {
          source: this.transformedData
        },
        series: this.series,
        color: this.colorList
      }

      config.toolbox.feature.myShowLabel.show = true
      config.toolbox.feature.myShowLabel.onclick = () => {
        this.$emit('toggleLabel')
      }

      // 為了讓只有 line chart 跟 bar chart 才顯示，所以加在這邊
      // xAxis.name 先不顯示，原因是y軸會因處理 offset 重新畫
      // config.xAxis.name = this.title.xAxis[0].display_name ? this.title.xAxis[0].display_name.replace(/ /g, '\r\n') : this.title.xAxis[0].display_name
      config.yAxis.name = this.title.yAxis[0].display_name
      config.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.dataset[0].source
        let table = '<div style="text-align: text;padding: 0 16px;position: absolute;width: 100%;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">' + this.$t('chart.export') + '</button></div><table style="width:100%;padding: 0 16px;white-space:nowrap;margin-top: 48px;"><tbody>'
        for (let i = 0; i < dataset.length; i++) {
          let tableData = dataset[i].reduce((acc, cur, index) => {
            let displayedValue = cur
            // 判斷是不是後端補 0 的地方，這邊不用三元表示式純粹因為排版不好看
            if (cur === 0 && dataset[i][2] === 0 && dataset[i][3] === 0 && dataset[i][4] === null) {
              return acc + '<td style="padding: 4px 12px;">' + null + '</td>'
            } else {
              // 如果畫圖表時有因為 offset 做調整，欲顯示原始資訊時，需要 undo
              if (i !== 0 && index !== 5 && displayedValue && displayedValue !== '') displayedValue += this.yAxisOffsetValue
              return acc + '<td style="padding: 4px 12px;">' + displayedValue + '</td>'
            }
          }, '')
          table += `<tr style='background-color:${i % 2 !== 0 ? 'rgba(35, 61, 64, 0.6)' : 'background: rgba(50, 75, 78, 0.6)'}'>${tableData}</tr>`
        }
        table += '</tbody></table>'
        return table
      }

      // 移除 null 值
      config.tooltip.formatter = (datas) => {
        let res = datas[0].name + '<br/>'
        for (let i = 0, length = datas.length; i < length; i++) {
          let componentIndex = datas[i].componentIndex + 1
          // 過濾掉 null、undefined、以及 為了 stck 的 0 和模擬預測的第一個點
          if (datas[i].value[componentIndex] === null || datas[i].value[componentIndex] === undefined || (datas[i].value[componentIndex] === 0 && datas[i].value[2] === 0 && datas[i].value[3] === 0 && datas[i].value[4] === null) || (componentIndex === 3 && datas[i].value[componentIndex] && datas[i].value[componentIndex - 1])) continue
          // 如果畫圖表時有因為 offset 做調整，欲顯示原始資訊時，需要 undo
          let displayValue = datas[i].value[componentIndex]
          displayValue += (i === 4) ? 0 :this.yAxisOffsetValue
          let marker = datas[i].marker ? datas[i].marker : `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${datas[i].color.colorStops[0].color};"></span>`
          res += marker + datas[i].seriesName + '：' + this.formatComma(displayValue) + '<br/>'
        }
        return res
      }

      // export data
      this.$nextTick(() => {
        if (this.$el.getAttribute('listener') !== 'true') {
          this.$el.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'export-btn') {
              let exportData = this.options.dataset.source.map((element, row) => {
                if (element[2] === 0 && element[3] === 0 && element[4] === null) {
                  return [element[0]+ this.yAxisOffsetValue, element[1]+ this.yAxisOffsetValue, null, null, null]
                } else {
                  if(row === 0) return element 
                  element = element.map((item, index) => (index === 0 || index === 5 || item === null) ? item : item + this.yAxisOffsetValue)
                  return element
                }
              })

              this.exportToCSV(this.appQuestion, exportData)
            }
          }, false)
          this.$el.setAttribute('listener', true)
        }
      })

      return config
    },
    colorList () {
      switch (this.series.length) {
        case 2:
          return colorOnly1
        case 3:
          return colorOnly2
        case 4:
        case 5:
        case 6:
          return color5
        default:
          return color12
      }
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
.predict-question-block {
  .display-predict-chart {
    width: 100%;
    margin-bottom: 16px;
  }
  .predict-detail-region {
    .block-title {
      font-size: 24px;
      margin-bottom: 24px;
      font-weight: 600;
    }
  }
  .predict-detail-block {
    display: flex;
    flex-wrap: wrap;

    .single-info-block {
      width: 24.25%;
      background-color: var(--color-bg-5);
      border-radius: 8px;
      padding: 20px;
      margin-right: 1%;

      &:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
  .info-title {
    width: 100px;
  }
  .info-detail {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .info-target {
    color: $theme-color-primary;
    margin-bottom: 8px;
  }
}
</style>
