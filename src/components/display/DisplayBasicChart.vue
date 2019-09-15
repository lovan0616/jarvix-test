<template>
  <div class="display-basic-chart">
    <v-echart
      :style="chartStyle"
      :options="options"
      auto-resize
      v-on="eventHandlers"
    >
    </v-echart>
  </div>
</template>

<script>
import EchartAddon from './common/addon.js'
import { commonChartOptions } from '@/components/display/common/chart-addon'
import {
  colorDefault,
  colorOnly1,
  colorOnly2,
  color3,
  color12,
  gridDefault,
  xAxisDefault,
  yAxisDefault,
  seriesItemLine,
  seriesItemLineStack,
  seriesItemBar,
  seriesItemPie,
  seriesItemDoughnut,
  seriesItemMarkLine,
  seriesItemPieLabelWithValue
} from './common/addons'

import {
  emitter
} from './common/events'

const eventHandlerGenerators = {
  click: emitter
}

const echartAddon = new EchartAddon({
  'grid:default': gridDefault(),
  'xAxis:default': xAxisDefault(),
  'yAxis:default': yAxisDefault(),
  'seriesItem:bar': seriesItemBar(),
  'seriesItem:line': seriesItemLine(),
  'seriesItem:lineStack': seriesItemLineStack(),
  'seriesItem:pie': seriesItemPie(),
  'seriesItem:pieLabelWithValue': seriesItemPieLabelWithValue(),
  'seriesItem:doughnut': seriesItemDoughnut(),
  'seriesItem:markLine': seriesItemMarkLine()
})

export default {
  name: 'DisplayBasicChart',
  props: {
    dataset: { type: [Object, Array, String], default: () => ([]) },
    title: {
      type: Object,
      default: () => {
        return {
          xAxis: null,
          yAxis: null
        }
      }
    },
    addons: { type: [Object, Array], default: () => ([]) },
    events: { type: Object, default: () => ({}) },
    isPreview: {
      type: Boolean,
      default: false
    },
    height: {type: String, default: '380px'}
  },
  data () {
    echartAddon.mapping(this.addons)
    return {
      addonOptions: JSON.parse(JSON.stringify(echartAddon.options)),
      addonSeriesItem: JSON.parse(JSON.stringify(echartAddon.seriesItem)),
      addonSeriesData: JSON.parse(JSON.stringify(echartAddon.seriesData)),
      addonSeriesItems: JSON.parse(JSON.stringify(echartAddon.seriesItems))
    }
  },
  computed: {
    _dataset () {
      let result
      if (typeof this.dataset === 'string') result = JSON.parse(this.dataset)
      else result = this.dataset

      // 如果有 column 經過 Number() 後為數字 ，echart 會畫不出來，所以補個空格給他
      if (result.columns) {
        result.columns = result.columns.map(element => {
          return isNaN(Number(element)) ? element : ' ' + element
        })
      }

      return result
    },
    chartStyle () {
      return {
        width: '100%',
        height: this.isPreview ? '200px' : this.height
      }
    },
    dataList () {
      if ((this._dataset instanceof Array)) return this._dataset
      else return this.tobeDataset(this._dataset)
    },
    series () {
      return this._dataset.columns.map((v, colIndex) => {
        let data
        const needSeriesData = Object.keys(this.addonSeriesData).length > 0
        const isStack = (this.addonSeriesItem.stack)
        if (needSeriesData && isStack) {
          data = this._dataset.data.reduce((result, row, rowIndex) => {
            result.push({
              value: row[colIndex],
              ...this.addonSeriesData
            })
            return result
          }, [])
        }
        return {
          name: v,
          ...this.addonSeriesItem,
          ...this.addonSeriesItems[colIndex],
          connectNulls: true,
          data
        }
      })
    },
    options () {
      let config = {
        ...this.addonOptions,
        ...JSON.parse(JSON.stringify(commonChartOptions)),
        dataset: {
          source: this.dataList
        },
        series: this.series,
        color: this.colorList
      }
      // 移除 null 值
      config.tooltip.formatter = (datas) => {
        let res = datas[0].name + '<br/>'
        for (let i = 0, length = datas.length; i < length; i++) {
          if (datas[i].value[i + 1] === null) continue
          let marker = datas[i].marker ? datas[i].marker : `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${datas[i].color.colorStops[0].color};"></span>`
          res += marker + datas[i].seriesName + '：' + datas[i].value[i + 1] + '<br/>'
        }
        return res
      }
      // 為了讓只有 line chart 跟 bar chart 才顯示，所以加在這邊
      config.toolbox.feature.magicType.show = true
      config.xAxis.name = this.title.xAxis ? this.title.xAxis.replace(/ /g, '\r\n') : this.title.xAxis
      config.yAxis.name = this.title.yAxis

      if (this.isPreview) this.previewChartSetting(config)
      return config
    },
    colorList () {
      switch (this.dataList[0].length) {
        case 2:
          return colorOnly1
        case 3:
          return colorOnly2
        case 4:
          return color3
        case 5:
        case 6:
          return colorDefault
        default:
          return color12
      }
    },
    eventHandlers () {
      return Object.keys(eventHandlerGenerators).reduce((result, eventName) => {
        const generator = eventHandlerGenerators[eventName].bind(this)
        const options = this.events[eventName]
        if (options) {
          const handler = generator(options)
          result[eventName] = handler
        }
        return result
      }, {})
    }
  },
  methods: {
    tobeDataset (data) {
      const result = [['index']]
      result[0] = result[0].concat(data.columns)
      data.data.forEach((row, rowIndex) => {
        const rowData = [data.index[rowIndex]].concat(row)
        result.push(rowData)
      })
      return result
    }
  }
}
</script>
