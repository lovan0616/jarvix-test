<template>
  <div class="display-basic-chart">
    <v-echart
      :style="chartStyle"
      :options="options"
      auto-resize
    >
    </v-echart>
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
    return {}
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
        ...this.addonOptions,
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
      // tooltip
      config.tooltip.trigger = 'item'
      config.tooltip.formatter = params => `<p>${params.marker}${params.name}: ${params.value[1]}（${params.percent}%）</p>`

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
    }
  }
}
</script>
