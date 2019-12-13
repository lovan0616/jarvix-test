<template>
  <div class="display-scatter-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
      @brushselected="brushRegionSelected"
    >
    </v-echart>
    <selected-region
      v-if="selectedData.length > 0"
      :title="$t('resultDescription.currentChosenArea')"
      @save="saveFilter"
    >
      <div class="region-description" slot="selectedFilterRegion">
        <div class="single-area"
          v-for="(singleArea, index) in selectedData"
          :key="index"
        >
          {{ $t('resultDescription.area') + (index + 1) }}:
          <span
            v-for="(singleRestraint, restraintIndex) in singleArea.restraints"
            :key="'restraint' + index + '-' + restraintIndex"
          >
            {{ singleRestraint.properties.display_name }}{{ $t('resultDescription.between', {start: roundNumber(singleRestraint.properties.start), end: roundNumber(singleRestraint.properties.end) }) }}
            <span
              v-show="restraintIndex !== singleArea.restraints.length - 1"
            >、</span>
          </span>
        </div>
      </div>
    </selected-region>
  </div>
</template>
<script>
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'
import { getDrillDownTool } from '@/components/display/common/addons.js'
let scatterChartConfig = {
  xAxisSplitLine: {
    show: false
  },
  yAxisSplitLine: {
    lineStyle: {
      type: 'dashed',
      color: chartVariable['splitLineColor']
    }
  },
  chartData: {
    symbolSize: 8,
    itemStyle: {
      color: chartVariable['lightestChartColor']
    },
    data: [],
    type: 'scatter',
    large: true
  },
  isPreview: {
    type: Boolean,
    default: false
  }
}

let tooltipFormatterWrapper = function ({xAxis, yAxis}) {
  return function (params, ticket, callback) {
    return params.reduce((res, item, index) => {
      return `
        ${xAxis.display_name}: ${item.data[0]}<br/>
        ${yAxis.display_name}: ${item.data[1]}<br/>
      `
    }, '')
  }
}

export default {
  name: 'DisplayScatterChart',
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
    },
    formula: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      selectedData: []
    }
  },
  methods: {
    dotSize (dataLength) {
      if (dataLength > 500 && dataLength < 1999) {
        return 4
      } else if (dataLength > 1999 && dataLength < 4999) {
        return 2
      } else if (dataLength > 4999) {
        return 1
      } else {
        return 8
      }
    },
    brushRegionSelected (params) {
      this.selectedData = params.batch[0].areas.map(areaElement => {
        let coordRange = areaElement.coordRange
        return {
          type: 'compound',
          restraints: [
            {
              type: 'range',
              properties: {
                dc_name: this.title.xAxis.dc_name,
                data_type: this.title.xAxis.data_type,
                display_name: this.title.xAxis.display_name,
                start: this.title.xAxis.stats_type === 'numeric' ? coordRange[0][0] : this.dataset.index[coordRange[0][0]],
                end: this.title.xAxis.stats_type === 'numeric' ? coordRange[0][1] : this.dataset.index[coordRange[0][1]]
              }
            },
            {
              type: 'range',
              properties: {
                dc_name: this.title.yAxis.dc_name,
                data_type: this.title.yAxis.data_type,
                display_name: this.title.yAxis.display_name,
                start: coordRange[1][0],
                end: coordRange[1][1]
              }
            }
          ]
        }
      })
    },
    saveFilter () {
      this.$store.commit('dataSource/setFilterList', this.selectedData)
    }
  },
  computed: {
    chartOption () {
      let chartAddon = {...JSON.parse(JSON.stringify(chartOptions)), ...getDrillDownTool(this.title)}
      let scatterOptions = JSON.parse(JSON.stringify(scatterChartConfig))
      this.$set(chartAddon.xAxis, 'splitLine', scatterOptions.xAxisSplitLine)
      this.$set(chartAddon.yAxis, 'splitLine', scatterOptions.yAxisSplitLine)
      chartAddon.tooltip.formatter = tooltipFormatterWrapper(this.title)
      chartAddon.xAxis.name = this.title.xAxis.display_name
      chartAddon.yAxis.name = this.title.yAxis.display_name
      scatterOptions.chartData.data = this.dataset.data
      scatterOptions.chartData.symbolSize = this.dotSize(this.dataset.data.length)
      chartAddon.series[0] = scatterOptions.chartData
      chartAddon.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.series[0].data
        let maxLength = dataset.length > 1000 ? 1000 : dataset.length
        let table = '<div style="text-align: text;padding: 0 16px;"><button style="width: 100%;" class="btn btn-m btn-secondary" type="button" id="export-btn">' + this.$t('chart.export') + '</button></div>' +
          `<div style="margin-top: 16px;padding: 0 16px;">${maxLength === 1000 ? this.$t('resultDescription.displayTopData', {count: maxLength}) : this.$t('resultDescription.displayTotalData', {count: maxLength})}</div>` +
          '<table style="width:100%;padding: 0 16px;"><tbody><tr>' +
          '<td style="padding: 4px 12px;">' + this.title.xAxis.display_name + '</td>' +
          '<td style="padding: 4px 12px;">' + this.title.yAxis.display_name + '</td>' +
          '</tr>'
        for (let i = 1; i < maxLength; i++) {
          table += `<tr style='background-color:${i % 2 !== 0 ? 'rgba(35, 61, 64, 0.6)' : 'background: rgba(50, 75, 78, 0.6)'}'>
            <td style="padding: 4px 12px;">${dataset[i][0]}</td><td style="padding: 4px 12px;">${dataset[i][1]}</td>
          </tr>`
        }
        table += '</tbody></table>'
        return table
      }
      // export data
      this.$nextTick(() => {
        this.$el.addEventListener('click', (e) => {
          if (e.target && e.target.id === 'export-btn') {
            let exportData = JSON.parse(JSON.stringify(this.dataset.data))
            exportData.unshift([this.title.xAxis.display_name, this.title.yAxis.display_name])
            this.exportToCSV(this.appQuestion, exportData)
          }
        })
      })

      if (this.formula) {
        let gradient = Number((this.formula.a).toFixed(4))
        let offset = Number((this.formula.b).toFixed(4))
        let expression = `y = ${gradient}x ${offset > 0 ? '+' : '-'} ${Math.abs(offset)}`
        let minX = this.dataset.data[0][0]
        let maxX = this.dataset.data[0][0]

        this.dataset.data.forEach(element => {
          maxX = element[0] > maxX ? element[0] : maxX
          minX = element[0] < minX ? element[0] : minX
        })

        let minY = this.roundNumber(gradient * minX + offset, 4)
        let maxY = this.roundNumber(gradient * maxX + offset, 4)

        // markLine
        chartAddon.series[1] = {
          name: '',
          type: 'line',
          showSymbol: false,
          smooth: true,
          color: '#FF9559',
          symbol: 'none',
          data: [[minX, minY], [maxX, maxY]],
          markPoint: {
            itemStyle: {
              normal: {
                color: 'transparent'
              }
            },
            label: {
              show: true,
              position: 'left',
              formatter: expression,
              width: '100%',
              lineHeight: 14,
              padding: [1, 2, 1, 22],
              textStyle: {
                color: '#FF9559',
                fontSize: 14
              },
              // backgroundColor: '#093B3E'
              backgroundColor: '#000'
            },
            data: [
              {
                coord: [maxX, maxY]
              }
            ]
          }
        }
      }

      if (this.isPreview) this.previewChartSetting(chartAddon)

      return chartAddon
    },
    chartStyle () {
      return {
        width: '100%',
        height: this.isPreview ? '200px' : '380px'
      }
    },
    appQuestion () {
      return this.$store.state.dataSource.appQuestion
    }
  }
}
</script>
<style lang="scss" scoped>
.selected-region {
  .single-area {

  }
}
</style>
