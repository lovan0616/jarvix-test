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
import EchartAddon from '@/components/display/common/addon.js'
import { commonChartOptions } from '@/components/display/common/chart-addon'
import i18n from '@/lang/index.js'
import {
  gridDefault,
  xAxisDefault,
  yAxisDefault,
  seriesItemHeatMap,
  parallelZoomIn,
  verticalZoomIn
} from '@/components/display/common/addons'

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
    dataset: {
      type: Object,
      default: null
    },
    height: {type: String, default: '550px'},
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
          formatter (params) {
            if (!params || !params['value']) return
            return `${i18n.t('resultDescription.degreeOfCorrelation')}: ${params['value'][2]}<br>${params['value'][0]}, ${params['value'][1]}`
          }
        },
        grid: {
          containLabel: true,
          left: 18,
          right: 35,
          top: 18,
          bottom: 65,
          backgroundColor: '#303737',
          borderColor: 'rgba(225,225,225,.3)',
          show: true
        },
        textStyle: {
          color: '#fff'
        },
        visualMap: {
          min: -1,
          max: 1,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          align: 'bottom',
          color: ['#309CFF', '#424B4B', '#DE636E'],
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          itemHeight: '330px',
          precision: 1,
          itemWidth: '8px',
          padding: [
            1,
            0,
            0,
            0
          ]
        },
        dataset: {
          source: this.dataset.data
        },
        series: this.addonSeriesItem
      }

      // 限制 label 字數避免圖片被壓縮
      const formateLabel = function (value, index) {
        if (value.length <= 5) return value
        return value.slice(0, 5) + '...'
      }

      // 欄位超過 15x15 的時候出現 scroll bar 並隱藏 label
      if (this.dataset.data.length > 225) {
        const verticalZoomConfig = verticalZoomIn()
        const parallelZoomConfig = parallelZoomIn()
        verticalZoomConfig[1].top = 40
        verticalZoomConfig[1].bottom = 65
        verticalZoomConfig[1].right = 10
        parallelZoomConfig[1].bottom = 40
        config.dataZoom = [...parallelZoomConfig, ...verticalZoomConfig]
        config.animation = false
        config.series.label.show = false
      }

      config.series.label.color = '#FFFFFF'

      config.xAxis.position = 'top'
      config.xAxis.data = this.dataset.index[0]
      config.xAxis.axisLabel.formatter = formateLabel
      config.xAxis.axisLabel.rotate = -30
      config.xAxis.axisLine.show = false
      config.xAxis.splitLine.show = true
      config.xAxis.splitLine.lineStyle = {
        color: 'rgba(225,225,225,.3)'
      }
      config.yAxis.inverse = true
      config.yAxis.data = this.dataset.index[1]
      config.yAxis.axisLabel.formatter = formateLabel
      config.yAxis.splitLine.lineStyle = {
        color: 'rgba(225,225,225,.3)'
      }

      return config
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
