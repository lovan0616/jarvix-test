<template>
  <div class="display-basic-chart">
    <div class="button-block">
      <button class="btn-m btn-default"
        v-show="!isShowData"
        @click="showData"
      >{{ $t('resultDescription.displayData') }}</button>
      <button class="btn-m btn-default"
        v-show="isShowData"
        @click="showChart"
      >{{ $t('resultDescription.displayChart') }}</button>
    </div>
    <v-echart
      v-show="!isShowData"
      :style="chartStyle"
      :options="options"
      auto-resize
    >
    </v-echart>
    <sy-table
      v-show="isShowData"
      :dataset="dataForTable"
      :index-width="250"
    ></sy-table>
  </div>
</template>

<script>
import { commonChartOptions } from '@/components/display/common/chart-addon'
import { color12 } from './common/addons'

export default {
  name: 'DisplayPieChart',
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
    isPreview: {
      type: Boolean,
      default: false
    },
    height: {type: String, default: '380px'}
  },
  data () {
    return {
      isShowData: false
    }
  },
  computed: {
    _dataset () {
      let result
      if (typeof this.dataset === 'string') result = JSON.parse(this.dataset)
      else result = this.dataset

      // 如果有 column 經過 Number() 後為數字 ，echart 會畫不出來，所以補個空格給他
      if (result.columns) {
        result.columns = result.columns.map(element => {
          return isNaN(Number(element)) ? element : ' ' + element
        })
      }

      return result
    },
    dataForTable () {
      let dataSet = JSON.parse(JSON.stringify(this._dataset))
      dataSet.columns.push('percentage(%)')
      let valueSum = dataSet.data.reduce((acc, cur) => {
        return acc + cur[0]
      }, 0)

      dataSet.data.map(element => {
        return element.push((element[0] * 100 / valueSum).toFixed(2))
      })
      return dataSet
    },
    chartStyle () {
      return {
        width: '100%',
        height: this.isPreview ? '200px' : this.height
      }
    },
    dataList () {
      if ((this._dataset instanceof Array)) return this._dataset
      else return this.tobeDataset(this._dataset)
    },
    series () {
      return this._dataset.columns.map((v, colIndex) => {
        let data
        const needSeriesData = Object.keys(this.addonSeriesData).length > 0
        const isStack = (this.addonSeriesItem.stack)
        if (needSeriesData && isStack) {
          data = this._dataset.data.reduce((result, row, rowIndex) => {
            result.push({
              value: row[colIndex],
              ...this.addonSeriesData
            })
            return result
          }, [])
        }
        return {
          name: v,
          ...this.addonSeriesItem,
          ...this.addonSeriesItems[colIndex],
          data
        }
      })
    },
    options () {
      let config = {
        ...JSON.parse(JSON.stringify(commonChartOptions)),
        dataset: {
          source: this.dataList
        },
        series: {
          type: 'pie',
          label: {
            fontSize: 12
          },
          labelLine: {
            normal: {
              length: 10,
              length2: 10
            }
          }
        },
        color: this.colorList
      }
      config.tooltip.trigger = 'item'
      config.tooltip.formatter = params => `${this.dataset.columns[0]}<br>${params.marker}${params.name}: ${params.value[1]}（${params.percent}%）`

      if (this.isPreview) {
        config.legend.show = false
        config.tooltip.show = false
        config.toolbox.show = false
      }
      return config
    },
    colorList () {
      return color12
    }
  },
  methods: {
    tobeDataset (data) {
      const result = [['index']]
      result[0] = result[0].concat(data.columns)
      data.data.forEach((row, rowIndex) => {
        const rowData = [data.index[rowIndex]].concat(row)
        result.push(rowData)
      })
      return result
    },
    showData () {
      this.isShowData = true
    },
    showChart () {
      this.isShowData = false
    }
  }
}
</script>
<style lang="scss" scoped>
.display-basic-chart {
  .button-block {
    position: absolute;
    right: 0;
    top: -36px;
  }
}
</style>
