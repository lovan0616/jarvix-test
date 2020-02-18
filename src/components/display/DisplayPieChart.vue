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
    height: {type: String, default: '380px'}
  },
  computed: {
    chartStyle () {
      return {
        width: '100%',
        height: this.height
      }
    },
    options () {
      let config = {
        ...JSON.parse(JSON.stringify(commonChartOptions())),
        ...getDrillDownTool(this.title),
        dataset: {
          source: this.tobeDataset(this.dataset)
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

        let table = `<div style="text-align: text;padding: 0 16px;"><button style="width: 100%;" class="btn btn-m btn-secondary" type="button" id="export-btn">${this.$t('chart.export')}</button></div>` +
          '<table style="margin-top: 16px;width:100%;padding: 0 16px;"><tbody><tr style="background-color:#2B4D51">' +
          '<td>' + dataset[0][0] + '</td>' +
          '<td>' + dataset[0][1] + '</td>' +
          '<td>' + 'percentage(%)' + '</td>' +
          '</tr>'
        for (let i = 1; i < dataset.length; i++) {
          table += `<tr ${i % 2 === 0 ? 'style="background-color:rgba(50, 75, 78, 0.6)"' : ''}>
            <td>${dataset[i][0]}</td><td>${dataset[i][1]}</td><td>${(dataset[i][1] * 100 / valueSum).toFixed(2)}</td>
          </tr>`
        }
        table += '</tbody></table>'
        return table
      }
      // export data
      this.$nextTick(() => {
        this.exportCSVFile(this.$el, this.appQuestion, config.dataset.source)
      })

      return config
    },
    colorList () {
      return color12
    },
    appQuestion () {
      return this.$store.state.dataSource.appQuestion
    }
  },
  methods: {
    tobeDataset (dataset) {
      // 如果有 index 經過 Number() 後為數字 ，echart 會畫不出來，所以補個 [] 給他
      if (dataset.index) {
        dataset.index = dataset.index.map(element => {
          return isNaN(Number(element)) ? element : '[' + element + ']'
        })
      }

      let result = dataset.data.map((element, index) => {
        return [dataset.index[index], ...element]
      })
      return [['index', ...dataset.columns], ...result]
    }
  }
}
</script>
