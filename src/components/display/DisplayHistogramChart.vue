<template>
  <div class="display-histogram-chart">
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
          <div class="region-description">
            <div class="single-area">
              {{ $t('resultDescription.area') + (index + 1) }}:
               {{ singleType.properties.display_name }}{{ $t('resultDescription.between', {start: roundNumber(singleType.properties.start), end: roundNumber(singleType.properties.end) }) }}
            </div>
          </div>
        </div>
      </div>
    </selected-region>
  </div>
</template>
<script>
import ecStat from 'echarts-stat'
import chartVariable from '@/styles/chart/variables.scss'
import { chartOptions } from '@/components/display/common/chart-addon.js'
import { getDrillDownTool } from '@/components/display/common/addons'
let chartAddon = JSON.parse(JSON.stringify(chartOptions))
// 直方圖的參數設定
let histogramChartConfig = {
  xAxis: {
    type: 'value',
    min: null,
    max: null,
    interval: null,
    splitLine: {
      show: false
    }
  },
  chartData: {
    symbolSize: 8,
    itemStyle: {
      color: chartVariable['lightestChartColor']
    },
    data: [],
    type: 'custom',
    label: {},
    renderItem: null,
    large: true,
    encode: {
      x: [0, 1],
      y: 2,
      tooltip: 2,
      label: 2
    }
  }
}

export default {
  name: 'DisplayHistogramChart',
  props: {
    dataset: {
      type: Object,
      default () {
        return {}
      }
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
    renderItem (params, api) {
      let yValue = api.value(2)
      let start = api.coord([api.value(0), yValue])
      let size = api.size([api.value(1) - api.value(0), yValue])
      let style = api.style()

      return {
        type: 'rect',
        shape: {
          x: start[0] + 1,
          y: start[1],
          width: size[0] - 2,
          height: size[1]
        },
        style: style
      }
    },
    brushRegionSelected (params) {
      this.selectedData = params.batch[0].areas.map(areaElement => {
        let coordRange = areaElement.coordRange
        return {
          type: 'range',
          properties: {
            dc_name: this.title.xAxis.dc_name,
            display_name: this.title.xAxis.display_name,
            start: coordRange[0],
            end: coordRange[1]
          }
        }
      })
    },
    saveFilter () {
      this.$store.commit('dataSource/setFilterList', this.selectedData)
    }
  },
  computed: {
    chartData () {
      let interval
      let min = Infinity
      let max = -Infinity

      let newData = this.dataset.data.map(element => {
        return element[1]
      })

      let bins = ecStat.histogram(newData, 'sturges')
      let chartData = bins.data.map((item, index) => {
        let x0 = bins.bins[index].x0
        let x1 = bins.bins[index].x1
        interval = x1 - x0
        min = Math.min(min, x0)
        max = Math.max(max, x1)
        return [x0, x1, item[1]]
      })

      // set histogram xAxis
      chartAddon.xAxis = {...chartAddon.xAxis, ...histogramChartConfig.xAxis}
      chartAddon.xAxis.interval = interval
      chartAddon.xAxis.min = min
      chartAddon.xAxis.max = max
      chartAddon.xAxis.name = this.title.xAxis.display_name
      chartAddon.yAxis = {...chartAddon.yAxis, ...histogramChartConfig.yAxis}
      chartAddon.yAxis.name = this.title.yAxis.display_name

      if (this.isPreview) this.previewChartSetting(chartAddon)

      return chartData
    },
    chartOption () {
      histogramChartConfig.chartData.renderItem = this.renderItem
      histogramChartConfig.chartData.data = this.chartData
      chartAddon.series[0] = histogramChartConfig.chartData

      return {...chartAddon, ...getDrillDownTool(this.title)}
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
