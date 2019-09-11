<template>
  <div class="display-predict-chart">
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
import {
  colorDefault,
  colorOnly1,
  colorOnly2,
  color3,
  color10,
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
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
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
    chartStyle () {
      return {
        width: '100%',
        height: this.isPreview ? '200px' : '380px'
      }
    },
    dataList () {
      if ((this._dataset instanceof Array)) return this._dataset
      else return this.tobeDataset(this._dataset)
    },
    series () {
      return this._dataset.columns.map((v, colIndex) => {
        let item = {
          name: v,
          type: 'line'
        }
        switch (colIndex) {
          case 0:
            item['stack'] = 'predict'
            item['areaStyle'] = {
              color: 'transparent'
            }
            break
          case 1:
            item['stack'] = 'predict'
            item['areaStyle'] = {
              color: 'transparent'
            }
            item['lineStyle'] = {
              type: 'dashed'
            }
            break
          case 2:
            item['stack'] = 'predict'
            item['areaStyle'] = {
              color: colorOnly1
            }
            item['lineStyle'] = {
              type: 'dashed'
            }
            break
          case 3:
            item['lineStyle'] = {
              type: 'dashed'
            }
            break
        }
        return item
      })
    },
    options () {
      let config = {
        xAxis: xAxisDefault(),
        yAxis: yAxisDefault(),
        ...JSON.parse(JSON.stringify(commonChartOptions)),
        dataset: {
          source: this.dataList
        },
        series: this.series,
        color: this.colorList
      }
      // 為了讓只有 line chart 跟 bar chart 才顯示，所以加在這邊
      config.toolbox.feature.magicType.show = true
      config.xAxis.name = this.title.xAxis ? this.title.xAxis.replace(/ /g, '\r\n') : this.title.xAxis
      config.yAxis.name = this.title.yAxis

      if (this.isPreview) this.previewChartSetting(config)
      return config
    },
    colorList () {
      switch (this.dataList[0].length) {
        case 2:
          return colorOnly1
        case 3:
          return colorOnly2
        case 4:
          return color3
        case 6:
          return colorDefault
        default:
          return color10
      }
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
<style lang="scss" scoped>
.display-predict-chart {
}
</style>
