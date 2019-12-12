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
import { color12, getDrillDownTool } from './common/addons'

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
    options () {
      let config = {
        ...JSON.parse(JSON.stringify(commonChartOptions())),
        ...getDrillDownTool(this.title),
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

      // 數據顯示
      config.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.dataset[0].source
        let valueSum = dataset.reduce((acc, cur, index) => {
          return index === 0 ? acc : acc + cur[1]
        }, 0)

        let table = '<table style="width:100%;padding: 0 16px;"><tbody><tr>' +
          '<td>' + dataset[0][0] + '</td>' +
          '<td>' + dataset[0][1] + '</td>' +
          '<td>' + 'percentage(%)' + '</td>' +
          '</tr>'
        for (let i = 1; i < dataset.length; i++) {
          table += `<tr style='background-color:${i % 2 !== 0 ? 'rgba(35, 61, 64, 0.6)' : 'background: rgba(50, 75, 78, 0.6)'}'>
            <td>${dataset[i][0]}</td><td>${dataset[i][1]}</td><td>${(dataset[i][1] * 100 / valueSum).toFixed(2)}</td>
          </tr>`
        }
        table += '</tbody></table>'
        return table
      }

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
