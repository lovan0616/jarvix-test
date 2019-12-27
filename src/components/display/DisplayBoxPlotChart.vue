<template>
  <div class="display-box-plot-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
      @brushselected="brushRegionSelected"
    >
    </v-echart>
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
          <div class="filter-description"
            v-if="singleType.type === 'enum'"
          >
            <div class="column-name">{{singleType.properties.display_name}} =</div>
            <div class="single-filter"
              v-for="(singleData, propertiesIndex) in singleType.properties.datavalues"
              :key="'enum-' + propertiesIndex"
            >{{ singleData }}<span v-show="propertiesIndex !== singleType.properties.datavalues.length - 1">、</span></div>
          </div>
          <div class="region-description"
            v-if="singleType.type === 'range'"
          >
            <div class="single-area">
              {{ $t('resultDescription.area') + (index + 1) }}:
              {{ singleType.properties.display_name }}{{ $t('resultDescription.between', {start: singleType.properties.start, end: singleType.properties.end }) }}
            </div>
          </div>
        </div>
      </div>
    </selected-region>
  </div>
</template>
<script>
import dataTool from 'echarts/dist/extension/dataTool'
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'

let boxPlotChartConfig = {
  tooltip: {
    trigger: 'item'
  },
  chartData: {
    name: 'boxplot',
    type: 'boxplot',
    data: [],
    itemStyle: {
      color: chartVariable['lightestChartColor']
    },
    tooltip: {
      formatter (param) {
        return [
          'upper: ' + param.data[5],
          'Q3: ' + param.data[4],
          'median: ' + param.data[3],
          'Q1: ' + param.data[2],
          'lower: ' + param.data[1]
        ].join('<br/>')
      }
    }
  },
  outlier: {
    name: 'outlier',
    type: 'scatter',
    data: []
  }
}

export default {
  name: 'DisplayBoxPlotChart',
  props: {
    dataset: {
      type: Object,
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
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedData: []
    }
  },
  methods: {
    brushRegionSelected (params) {
      if (params.batch[0].selected[0].dataIndex.length === 0) {
        this.selectedData = []
        return
      }
      this.selectedData = [{
        type: 'enum',
        properties: {
          dc_name: this.title.xAxis.dc_name,
          data_type: this.title.xAxis.data_type,
          display_name: this.title.xAxis.display_name,
          datavalues: params.batch[0].selected[0].dataIndex.map(element => {
            return this.dataset.index[element]
          })
        }
      }]
    },
    saveFilter () {
      this.$store.commit('dataSource/setFilterList', this.selectedData)
    }
  },
  computed: {
    chartData () {
      return dataTool.prepareBoxplotData(this.dataset.data)
    },
    chartOption () {
      let chartAddon = JSON.parse(JSON.stringify(chartOptions))
      chartAddon.xAxis = {...chartAddon.xAxis, ...boxPlotChartConfig.xAxis}
      chartAddon.tooltip.trigger = boxPlotChartConfig.tooltip.trigger
      chartAddon.xAxis.data = this.dataset.index
      chartAddon.xAxis.name = this.title.xAxis.display_name
      chartAddon.yAxis.name = this.title.yAxis.display_name
      boxPlotChartConfig.chartData.data = this.chartData.boxData
      boxPlotChartConfig.outlier.data = this.chartData.outliers
      chartAddon.series[0] = boxPlotChartConfig.chartData
      chartAddon.series[0].itemStyle.borderColor = '#4DE2F0'
      chartAddon.series[0].itemStyle.color = '#000'
      chartAddon.series[1] = boxPlotChartConfig.outlier
      chartAddon.series[1].itemStyle = {
        color: chartVariable['chartColorList-2']
      }
      // chartAddon.toolbox.feature.dataView.show = false
      // 數據顯示
      chartAddon.toolbox.feature.dataView.optionToContent = (opt) => {
        console.log(opt, 'opt')
        let dataset = opt.series[0].data
        let table = `<div style="text-align: text;padding: 0 16px;"><button style="width: 100%;" class="btn btn-m btn-secondary" type="button" id="export-btn">${this.$t('chart.export')}</button></div>
          <table style="margin-top: 16px;width:100%;padding: 0 16px;"><tbody><tr style="background-color:#2B4D51"><td></td>`
        for (let i = 0; i < this.dataset.index.length; i++) {
          table += `<td>${this.dataset.index[i]}</td>`
        }
        table += '</tr>'
        for (let i = 0; i < 5; i++) {
          table += `<tr ${i % 2 === 0 ? 'style="background-color:rgba(50, 75, 78, 0.6)"' : ''}>`
          switch (i) {
            case 0:
              table += `<td>${this.$t('resultDescription.min')}</td>`
              break
            case 1:
              table += `<td>${this.$t('resultDescription.lowerQuartile')}</td>`
              break
            case 2:
              table += `<td>${this.$t('resultDescription.average')}</td>`
              break
            case 3:
              table += `<td>${this.$t('resultDescription.higherQuartile')}</td>`
              break
            case 4:
              table += `<td>${this.$t('resultDescription.max')}</td>`
              break
          }
          for (let j = 0; j < dataset.length; j++) {
            table += `<td>${dataset[j][i]}</<td>`
          }
          table += `</tr>`
        }
        table += '</tbody></table>'
        return table
      }
      // export data
      this.$nextTick(() => {
        this.$el.addEventListener('click', (e) => {
          if (e.target && e.target.id === 'export-btn') {
            let exportData = []
            let indexArray = JSON.parse(JSON.stringify(this.dataset.index))
            indexArray.unshift('')
            exportData.push(indexArray)

            for (let i = 0; i < 5; i++) {
              let rowData
              switch (i) {
                case 0:
                  rowData = [this.$t('resultDescription.min')]
                  break
                case 1:
                  rowData = [this.$t('resultDescription.lowerQuartile')]
                  break
                case 2:
                  rowData = [this.$t('resultDescription.average')]
                  break
                case 3:
                  rowData = [this.$t('resultDescription.higherQuartile')]
                  break
                case 4:
                  rowData = [this.$t('resultDescription.max')]
                  break
              }
              for (let j = 0; j < this.chartData.boxData.length; j++) {
                rowData.push(this.chartData.boxData[j][i])
              }
              exportData.push(rowData)
            }
            this.exportToCSV(this.appQuestion, exportData)
          }
        })
      })

      if (this.isPreview) this.previewChartSetting(chartAddon)

      return {
        ...chartAddon,
        brush: {
          toolbox: [''],
          xAxisIndex: 0,
          yAxisindex: 0
        }
      }
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
