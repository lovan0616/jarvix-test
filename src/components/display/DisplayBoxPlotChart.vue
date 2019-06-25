<template>
  <div class="display-box-plot-chart">
    <echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    >
    </echart>
  </div>
</template>
<script>
import dataTool from 'echarts/dist/extension/dataTool'
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'
let chartAddon = JSON.parse(JSON.stringify(chartOptions))
let boxPlotChartConfig = {
  tooltip: {
    trigger: 'item'
  },
  xAxis: {
    type: 'category',
    data: [],
    splitLine: {
      show: false
    }
  },
  chartData: {
    name: 'boxplot',
    type: 'boxplot',
    data: [],
    itemStyle: {
      color: chartVariable['basicChartColor']
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
    isPreview: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    chartData () {
      return dataTool.prepareBoxplotData(this.dataset.data)
    },
    chartOption () {
      chartAddon.legend.show = !this.isPreview
      chartAddon.xAxis = {...chartAddon.xAxis, ...boxPlotChartConfig.xAxis}
      chartAddon.tooltip = boxPlotChartConfig.tooltip
      chartAddon.xAxis.data = this.dataset.index
      chartAddon.xAxis.name = this.dataset.columns[0]
      chartAddon.yAxis.name = this.dataset.columns[1]
      boxPlotChartConfig.chartData.data = this.chartData.boxData
      boxPlotChartConfig.outlier.data = this.chartData.outliers
      chartAddon.series[0] = boxPlotChartConfig.chartData
      chartAddon.series[1] = boxPlotChartConfig.outlier

      return chartAddon
    },
    chartStyle () {
      return {
        width: '100%',
        height: '300px'
      }
    }
  }
}
</script>
