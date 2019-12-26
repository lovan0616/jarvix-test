<template>
  <div class="display-sankey-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    >
    </v-echart>
  </div>
</template>
<script>
import { commonChartOptions } from '@/components/display/common/chart-addon'
import chartVariable from '@/styles/chart/variables.scss'
import { color12 } from './common/addons'
const sankeyConfig = {
  ...JSON.parse(JSON.stringify(commonChartOptions())),
  brush: {
    toolbox: [''],
    xAxisIndex: 0,
    yAxisindex: 0
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
      type: Array
    },
    rowFields: {
      type: Array
    },
    colFields: {
      type: Array
    },
    valFields: {
      type: Array
    }
  },
  data () {
    return {
      linkList: [],
      dataList: []
    }
  },
  mounted () {
    this.dataTransform()
  },
  methods: {
    dataTransform () {
      let source = this.rowFields[0]
      let target = this.colFields[0]
      let count = this.valFields[0]

      // 組出要送進 echarts 的資料
      this.dataset.forEach((element, index) => {
        if (index === 0) {
          this.dataList.push({
            name: element[source]
          })
          this.dataList.push({
            name: element[target]
          })
          this.linkList.push({
            source: element[source],
            target: element[target],
            value: element[count]
          })
        } else {
          if (this.dataList.findIndex(node => node.name === element[source]) < 0) {
            this.dataList.push({
              name: element[source]
            })
          }
          if (this.dataList.findIndex(node => node.name === element[target]) < 0) {
            this.dataList.push({
              name: element[target]
            })
          }
          let linkIndex = this.linkList.findIndex(link => link.source === element[source] && link.target === element[target])
          if (linkIndex < 0) {
            this.linkList.push({
              source: element[source],
              target: element[target],
              value: element[count]
            })
          } else {
            this.linkList[linkIndex].value += 1
          }
        }
      })
    }
  },
  computed: {
    chartOption () {
      let sankeyOptions = JSON.parse(JSON.stringify(sankeyConfig))

      sankeyOptions.series[0].data = this.dataList
      sankeyOptions.series[0].links = this.linkList
      sankeyOptions.toolbox.feature.dataZoom.show = false
      sankeyOptions.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.series[0].links.sort((a, b) => {
          return a.source > b.source ? 1 : -1
        })
        let table = `<div style="text-align: text;padding: 0 16px;"><button style="width: 100%;" class="btn btn-m btn-secondary" type="button" id="export-btn">${this.$t('chart.export')}</button></div>
          <table style="margin-top: 16px;width:100%;padding: 0 16px;"><tbody><tr style="background-color:#2B4D51">` +
          '<td>' + this.rowFields[0] + '</td>' +
          '<td>' + this.colFields[0] + '</td>' +
          '<td>' + this.valFields[0] + '</td>' +
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
        this.$el.addEventListener('click', (e) => {
          if (e.target && e.target.id === 'export-btn') {
            let exportData = this.linkList.map(element => {
              return [element.source, element.target, element.value]
            })
            console.log(exportData)
            exportData.unshift([this.rowFields[0], this.colFields[0], this.valFields[0]])
            this.exportToCSV(this.appQuestion, exportData)
          }
        })
      })

      return sankeyOptions
    },
    chartStyle () {
      return {
        width: '100%',
        height: '380px'
      }
    },
    appQuestion () {
      return this.$store.state.dataSource.appQuestion
    }
  }
}
</script>
<style lang="scss">
.display-sankey {
}
</style>
