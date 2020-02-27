<template>
  <div class="display-basic-chart">
    <v-echart
      :style="chartStyle"
      :options="options"
      auto-resize
    >
    </v-echart>
    <arrow-button
      v-show="showPagination"
      v-if="hasPagination"
      isVertical
      @click.native="$emit('next')"
    ></arrow-button>
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
    total: {
      type: Number,
      default: 0
    },
    height: {type: String, default: '420px'},
    hasPagination: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showPagination: true
    }
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
        if (this.hasPagination) {
          this.$el.addEventListener('click', this.controlPagination, false)
        }
        let dataset = opt.dataset[0].source
        let valueSum = dataset.reduce((acc, cur, index) => {
          return index === 0 ? acc : acc + cur[1]
        }, 0)

        let table = `<div style="text-align: text;padding: 0 16px;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">${this.$t('chart.export')}</button></div>` +
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
    controlPagination () {
      let exportBtn = document.getElementById('export-btn')
      if (exportBtn) {
        this.showPagination = false
      } else {
        this.showPagination = true
        this.$el.removeEventListener('click', this.controlPagination, false)
      }
    },
    tobeDataset (dataset) {
      // 如果有 index 經過 Number() 後為數字 ，echart 會畫不出來，所以補個 [] 給他
      if (dataset.index) {
        dataset.index = dataset.index.map(element => {
          return isNaN(Number(element)) ? element : '[' + element + ']'
        })
      }
      /**
       * 檢查是否有 “其他” 的類別
       * 透過 total 扣除資料的總和的餘額來判斷是不是有 “其他”
       **/
      let totalSum = this.dataset.data.reduce((acc, cur) => acc + cur[0], 0)
      let otherCount = this.total - totalSum

      let result = dataset.data.map((element, index) => {
        return [dataset.index[index], ...element]
      })
      if (otherCount > 0) {
        result.push([this.$t('resultDescription.other'), otherCount])
      }
      return [['index', ...dataset.columns], ...result]
    }
  }
}
</script>
