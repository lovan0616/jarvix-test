<template>
  <div class="display-heat-map-chart">
    <v-echart
      :style="chartStyle"
      :options="options"
      auto-resize
    >
    </v-echart>
  </div>
</template>
<script>
import EchartAddon from './common/addon.js'
import { commonChartOptions } from '@/components/display/common/chart-addon'
import {
  gridDefault,
  xAxisDefault,
  yAxisDefault,
  seriesItemHeatMap
} from './common/addons'

const echartAddon = new EchartAddon({
  'grid:default': gridDefault(),
  'xAxis:default': xAxisDefault(),
  'yAxis:default': yAxisDefault(),
  'seriesItem:heatmap': seriesItemHeatMap()
})

export default {
  name: 'DisplayHeatMapChart',
  data () {
    echartAddon.mapping({
      'seriesItem:heatmap': {
        'large': true
      },
      'grid:default': {},
      'xAxis:default': {},
      'yAxis:default': {}
    })
    return {
      addonOptions: JSON.parse(JSON.stringify(echartAddon.options)),
      addonSeriesItem: JSON.parse(JSON.stringify(echartAddon.seriesItem)),
      addonSeriesData: JSON.parse(JSON.stringify(echartAddon.seriesData)),
      addonSeriesItems: JSON.parse(JSON.stringify(echartAddon.seriesItems))
    }
  },
  props: {
    // dataset.columns = ['x 軸名稱', 'y 軸名稱']
    // dataset.data = [ [0,0,0.5],[1,0,0.1],[2,2,0],[1,1,0.3] ...... ] > [x, y, value]
    // dataset.index = [ [1, 2, 3, 4, 5 ,6 ......], [1, 2, 3, 4, 5, 6 ......] ] [ [x 軸各欄位名稱], [y 軸各欄位名稱] ]
    // dataset.index[0] 數量 乘上 index[1] 數量 = value 格數
    // dataset.range = [最小值, 最大值]
    dataset: {
      type: Object,
      default: null
    },
    height: {type: String, default: '420px'},
    width: {type: String, default: '100%'}
  },
  computed: {
    options () {
      const {tooltip} = JSON.parse(JSON.stringify(commonChartOptions()))
      const config = {
        ...this.addonOptions,
        tooltip: {
          ...tooltip,
          trigger: 'item',
          position: 'top',
          formatter (p) {
            return `[${p.value[0]}, ${p.value[1]}]`
          }
        },
        grid: {
          containLabel: true
        },
        textStyle: {
          color: '#fff'
        },
        visualMap: {
          min: this.minValue,
          max: this.maxValue,
          // calculable: true,
          orient: 'vertical',
          right: '3%',
          top: 'middle',
          align: 'top',
          color: ['#F8696B', '#E2E282', '#63BD7B'],
          textStyle: {
            color: '#fff'
          },
          itemHeight: '200px',
          precision: 1,
          itemWidth: '8px',
          text: [this.maxValue, this.minValue]
        },
        dataset: {
          source: this.dataset.data
        },
        series: this.addonSeriesItem
      }

      config.xAxis.position = 'top'
      config.xAxis.data = this.dataset.index[0]
      config.yAxis.inverse = true
      config.yAxis.data = this.dataset.index[1]

      return config
    },
    maxValue () {
      if (this.dataset.range) return this.dataset.range[1]
      let max = 0
      this.dataset.data.forEach(element => {
        if (element[2] > max) {
          max = element[2]
        }
      })

      return max
    },
    minValue () {
      if (this.dataset.range) return this.dataset.range[0]
      let min = 0
      this.dataset.data.forEach(element => {
        if (element[2] < min) {
          min = element[2]
        }
      })

      return min
    },
    chartStyle () {
      return {
        width: this.width,
        height: this.height
      }
    }
  }
}
</script>
