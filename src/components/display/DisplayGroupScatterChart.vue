<template>
  <div class="display-group-scatter-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      @brushselected="brushRegionSelected"
      auto-resize
    >
    </v-echart>
  </div>
</template>
<script>
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'
import {
  getDrillDownTool,
  colorDefault,
  colorOnly2,
  color3,
  color12
} from './common/addons'

let groupScatterChartConfig = {
  tooltip: {
    trigger: 'item'
  },
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
      color: null
    },
    data: [],
    type: 'scatter',
    large: true
  }
}

export default {
  name: 'DisplayGroupScatterChart',
  props: {
    dataset: {
      type: Object
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
    }
  },
  computed: {
    chartOption () {
      let chartAddon = {...JSON.parse(JSON.stringify(chartOptions())), ...getDrillDownTool(this.$route.name, this.title)}
      this.$set(chartAddon.xAxis, 'splitLine', groupScatterChartConfig.xAxisSplitLine)
      this.$set(chartAddon.yAxis, 'splitLine', groupScatterChartConfig.yAxisSplitLine)
      chartAddon.tooltip.trigger = groupScatterChartConfig.tooltip.trigger
      chartAddon.tooltip.formatter = params => {
        let marker = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
          params.color.colorStops ? params.color.colorStops[0].color : params.color
        };"></span>`
        return `<p>${marker}${params.value[3]}（${params.value[2]}）<br>${this.title.xAxis[0].display_name}： ${params.value[0]}<br>${this.title.yAxis[0].display_name}： ${params.value[1]}</p>`
      }
      chartAddon.xAxis.name = this.title.xAxis[0].display_name
      chartAddon.yAxis.name = this.title.yAxis[0].display_name
      groupScatterChartConfig.chartData.data = this.dataset.data
      groupScatterChartConfig.chartData.symbolSize = this.dotSize(this.dataset.data.length)
      chartAddon.color = this.colorList
      chartAddon.series = this.groupDataList.map(dataSet => {
        let chartConfig = JSON.parse(JSON.stringify(groupScatterChartConfig.chartData))
        chartConfig.data = dataSet.data
        chartConfig.name = dataSet.name
        return chartConfig
      })
      chartAddon.toolbox.feature.dataView.optionToContent = (opt) => {
        let dataset = opt.series[0].data
        let table = '<table style="width:100%;padding: 0 16px;"><tbody><tr>' +
          '<td style="padding: 4px 12px;">' + this.title.xAxis[0].display_name + '</td>' +
          '<td style="padding: 4px 12px;">' + this.title.yAxis[0].display_name + '</td>' +
          '</tr>'
        for (let i = 1; i < dataset.length; i++) {
          table += `<tr style='background-color:${i % 2 !== 0 ? 'rgba(35, 61, 64, 0.6)' : 'background: rgba(50, 75, 78, 0.6)'}'>
            <td style="padding: 4px 12px;">${dataset[i][0]}</td><td style="padding: 4px 12px;">${dataset[i][1]}</td>
          </tr>`
        }
        table += '</tbody></table>'
        return table
      }
      if (this.isPreview) this.previewChartSetting(chartAddon)

      return chartAddon
    },
    chartStyle () {
      return {
        width: '100%',
        height: '420px'
      }
    },
    colorList () {
      switch (this.groupDataList.length) {
        case 2:
          return colorOnly2
        case 3:
          return color3
        case 5:
        case 6:
          return colorDefault
        default:
          return color12
      }
    },
    groupDataList () {
      let dataList = []
      this.dataset.data.forEach((element, arrayIndex) => {
        let cloneElement = JSON.parse(JSON.stringify(element))
        // 將 index 對應到的名稱塞進去，為了 tooltip 的顯示
        cloneElement.push(this.dataset.index[arrayIndex])
        let hasProperty = false
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].name === cloneElement[2]) {
            dataList[i].data.push(cloneElement)
            hasProperty = true
          }
        }
        if (!hasProperty) {
          dataList.push({
            name: cloneElement[2],
            data: [cloneElement]
          })
        }
      })
      return dataList
    }
  }
}
</script>
