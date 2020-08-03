<template>
  <div class="display-sankey-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    />
  </div>
</template>
<script>
import { commonChartOptions } from '@/components/display/common/chart-addon'
import chartVariable from '@/styles/chart/variables.scss'
import { color12 } from './common/addons'
const sankeyConfig = {
  brush: {
    toolbox: [''],
    xAxisIndex: 0,
    yAxisIndex: 0
  },
  tooltip: {
    trigger: 'item',
    triggerOn: 'mousemove'
  },
  color: color12,
  series: [
    {
      type: 'sankey',
      data: [],
      links: [],
      nodeGap: 14,
      top: 16,
      nodeAlign: 'left',
      focusNodeAdjacency: 'allEdges',
      itemStyle: {
        normal: {
          borderWidth: 1,
          borderColor: '#aaa'
        }
      },
      lineStyle: {
        normal: {
          color: 'source',
          curveness: 0.5
        }
      },
      label: {
        color: chartVariable['textColor']
      }
    }
  ]
}

export default {
  name: 'DisplaySankeyChart',
  props: {
    dataset: {
      type: Object,
      default: () => {
        return {
          columns: null,
          data: null
        }
      }
    }
  },
  data () {
    return {
      linkList: [],
      dataList: []
    }
  },
  computed: {
    chartOption () {
      let sankeyOptions = {
        ...JSON.parse(JSON.stringify(sankeyConfig)),
        ...JSON.parse(JSON.stringify(commonChartOptions()))
      }
      // 不顯示“全選”按鈕
      sankeyOptions.legend.selector = false
      sankeyOptions.series[0].data = this.dataList
      sankeyOptions.series[0].links = this.linkList
      sankeyOptions.tooltip.trigger = 'item'
      sankeyOptions.tooltip.formatter = (datas) => {
        if (datas.dataType === 'node') {
          return `${datas.name}: ${this.formatComma(datas.value)}`        
        } else {
          let item = datas.data
          return `${item.source} -- ${item.target}: ${this.formatComma(item.value)}`
        }
      }
      sankeyOptions.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.series[0].links.sort((a, b) => {
          return a.source > b.source ? 1 : -1
        })
        let table = `<div style="text-align: text;padding: 0 16px;position: absolute;width: 100%;"><button style="width: 100%;" class="btn btn-m btn-default" type="button" id="export-btn">${this.$t('chart.export')}</button></div>
          <table style="width:100%;padding: 0 16px;margin-top: 48px;"><tbody><tr style="background-color:#2B4D51">` +
          '<td>' + this.$t('resultDescription.source') + '</td>' +
          '<td>' + this.$t('resultDescription.target') + '</td>' +
          '<td>' + this.$t('resultDescription.value') + '</td>' +
          '</tr>'
        for (let i = 0; i < dataset.length; i++) {
          table += `<tr ${i % 2 === 0 ? 'style="background-color:rgba(50, 75, 78, 0.6)"' : ''}>
            <td>${dataset[i].source}</td><td>${dataset[i].target}</td><td>${dataset[i].value}</td>
          </tr>`
        }
        table += '</tbody></table>'
        return table
      }

      // export data
      this.$nextTick(() => {
        if (this.$el.getAttribute('listener') !== 'true') {
          this.$el.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'export-btn') {
              let exportData = this.linkList.map(element => {
                return [element.source, element.target, element.value]
              })
              exportData.unshift([this.$t('resultDescription.source'), this.$t('resultDescription.target'), this.$t('resultDescription.value')])
              this.exportToCSV(this.appQuestion, exportData)
            }
          }, false)
          this.$el.setAttribute('listener', true)
        }
      })

      return sankeyOptions
    },
    chartStyle () {
      return {
        width: '100%',
        height: this.dataList.length * 32 > 420 ? `${this.dataList.length * 32}px` : '420px'
      }
    },
    appQuestion () {
      return this.$store.state.dataSource.appQuestion
    }
  },
  mounted () {
    this.dataTransform()
  },
  methods: {
    dataTransform () {
      this.dataset.columns.forEach(element => {
        for (let column in this.dataset.data[element]) {
          /**
           * 注意！！
           * 如果 target / source 是數字的話會有問題，只好先轉 String 再送進去
           */
          this.dataset.data[element][column].forEach(singleLink => {
            // null 轉 toString 會壞掉
            if (singleLink[0] === null) singleLink[0] = 'null'
            if (singleLink[1] === null) singleLink[1] = 'null'

            this.linkList.push({
              source: singleLink[0].toString() + '-' + this.dataset.columns[0],
              target: singleLink[1].toString() + '-' + this.dataset.columns[1],
              value: singleLink[2]
            })
            for (let i = 0; i < 2; i++) {
              if (this.dataList.findIndex(node => node.name.toString() === (singleLink[i].toString() + '-' + (i === 0 ? element : column))) < 0) {
                this.dataList.push({
                  name: singleLink[i].toString() + '-' + (i === 0 ? element : column)
                })
              }
            }
          })
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.display-sankey-chart {
  max-height: 420px;
  overflow: auto;
}
</style>
