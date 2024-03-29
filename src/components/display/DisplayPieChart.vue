<template>
  <div class="display-basic-chart">
    <v-echart
      :style="chartStyle"
      :options="options"
      auto-resize
      @click="chartClicked"
    />
    <arrow-button
      v-show="showPagination"
      v-if="hasPagination"
      is-vertical
      @click.native="$emit('next')"
    />
    <hint-info-block
      v-if="hasNegativeData"
      :msg-list="[$t('resultNote.pieChartFilterNote')]"
      inline
    />
  </div>
</template>

<script>
import { commonChartOptions } from '@/components/display/common/chart-addon'
import { color12, getDrillDownTool } from './common/addons'
import HintInfoBlock from '@/components/display/HintInfoBlock'

export default {
  name: 'DisplayPieChart',
  components: {
    HintInfoBlock
  },
  props: {
    dataset: { type: [Object, Array, String], default: () => ([]) },
    componentId: {
      type: Number,
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
    total: {
      type: Number,
      default: 0
    },
    itemCount: {
      type: Number,
      default: 0
    },
    height: { type: String, default: '420px' },
    hasPagination: {
      type: Boolean,
      default: false
    },
    canDownloadCsv: {
      type: Boolean,
      default: false
    },
    isShowToolbox: {
      type: Boolean,
      default: true
    },
    isShowLegend: {
      type: Boolean,
      default: true
    },
    isShowLabelData: {
      type: Boolean,
      default: false
    },
    customChartStyle: {
      type: Object,
      default: () => {}
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
        height: this.height,
        ...this.customChartStyle
      }
    },
    options () {
      let config = {
        ...JSON.parse(JSON.stringify(commonChartOptions())),
        ...getDrillDownTool(this.$route.name, this.title),
        dataset: {
          source: this.tobeDataset(this.dataset)
        },
        series: {
          type: 'pie',
          minShowLabelAngle: 10,
          label: {
            fontSize: 12,
            alignTo: 'labelLine',
            ...(this.isShowLabelData && { formatter: '{b}({d}%)' })
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
      config.tooltip.formatter = params => `${this.dataset.columns[0]}<br>${params.marker}${params.name}: ${this.formatComma(params.value[1])}（${params.percent}%）`

      config.toolbox.feature.myShowLabel.show = true
      config.toolbox.feature.myShowLabel.onclick = () => {
        this.$emit('toggleLabel')
      }

      // 數據顯示
      config.toolbox.feature.dataView.optionToContent = (opt) => {
        if (this.hasPagination) {
          this.$el.addEventListener('click', this.controlPagination, false)
        }
        let dataset = opt.dataset[0].source

        let table = `<div style="text-align: text;padding: 0 16px;position: absolute;width: 100%;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">${this.$t('chart.export')}</button></div>` +
          '<table style="width:100%;padding: 0 16px;margin-top: 48px;"><tbody><tr style="background-color:#2B4D51">' +
          '<td>' + dataset[0][0] + '</td>' +
          '<td>' + dataset[0][1] + '</td>' +
          '<td>' + dataset[0][2] + '</td>' +
          '</tr>'

        for (let i = 1; i < dataset.length; i++) {
          table += `<tr ${i % 2 === 0 ? 'style="background-color:rgba(50, 75, 78, 0.6)"' : ''}>
            <td>${dataset[i][0]}</td><td>${this.formatComma(dataset[i][1])}</td><td>${dataset[i][2]}</td>
          </tr>`
        }
        table += '</tbody></table>'
        return table
      }

      // 是否隱藏 legend
      if (!this.isShowLegend) config.legend.show = false
      config.toolbox.show = this.isShowToolbox

      return config
    },
    colorList () {
      return color12
    },
    appQuestion () {
      return this.$store.state.dataSource.appQuestion
    },
    hasNegativeData () {
      return this.dataset.data.some(element => element[0] < 0)
    }
  },
  mounted () {
    this.exportCSVFile(this.$el, this.appQuestion, this)
  },
  methods: {
    chartClicked (params) {
      let dataInfo = []

      // handle click event from a piece of pie
      if (params.componentType === 'series') {
        for (let i = 0; i < 2; i++) {
          if (params.dimensionNames[i] === 'index') {
            dataInfo.push({
              ...this.title.xAxis[0],
              value: params.value[i]
            })
          } else {
            dataInfo.push({
              ...this.title.yAxis[0],
              value: params.value[i]
            })
          }
        }
      }
      dataInfo = dataInfo.filter(data => data.dc_id && data.stats_type)
      if (dataInfo.length > 0) this.$emit('clickChart', dataInfo)
    },
    controlPagination () {
      let exportBtn = document.getElementById('export-btn')
      if (exportBtn) {
        this.showPagination = false
      } else {
        this.showPagination = true
        this.$el.removeEventListener('click', this.controlPagination, false)
      }
    },
    modifyPureNumber (element) {
      return isNaN(Number(element)) ? element : '[' + element + ']'
    },
    tobeDataset (dataset) {
      // 如果有 index 經過 Number() 後為數字 ，echart 會畫不出來，所以補個 [] 給他
      if (dataset.display_index) {
        dataset.display_index = dataset.display_index.map(element => this.modifyPureNumber(element))
      } else if (dataset.index) {
        dataset.index = dataset.index.map(element => this.modifyPureNumber(element))
      }
      /**
       * 檢查是否有 “其他” 的類別
       * 透過 total 扣除資料的總和的餘額來判斷是不是有 “其他”
       **/
      let totalSum = dataset.data.reduce((acc, cur) => acc + cur[0], 0)
      let otherCount = this.total - totalSum
      // 這邊注意塞的時候多塞了一個自己算的百分比欄位
      let result = dataset.data.map((element, index) => {
        let display_index = dataset.display_index ? dataset.display_index[index] : dataset.index[index]
        // 注意 total 有可能為 0
        let percentage = this.total === 0 ? element[0] : (element[0] * 100 / this.total).toFixed(2)
        return [display_index, ...element, percentage]
      }).filter((element, index) => {
        // 過濾負值
        return element[1] >= 0
      })
      if (this.itemCount - dataset.data.length > 0 && otherCount > 0) {
        let percentage = this.total === 0 ? otherCount : (otherCount * 100 / this.total).toFixed(2)
        result.push([this.$t('resultDescription.other'), otherCount, percentage])
      }
      return [['index', ...dataset.display_columns ? dataset.display_columns : dataset.columns, 'percentage(%)'], ...result]
    }
  }
}
</script>
