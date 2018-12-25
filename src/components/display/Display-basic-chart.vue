<template>
  <div class="display-basic-chart">
    <echart
      :style="chartStyle"
      :options="options"
      auto-resize
      v-on="eventHandlers"
    >
    </echart>
  </div>
</template>

<script>
import EchartAddon from './common/addon.js'
import {
  colorDefault,
  colorOnly2,
  color3,
  color5,
  color10,
  gridDefault,
  gridInner,
  gridInnerWithLegend,
  gridXname,
  gridYname,
  gridMini,
  gridNarrow,
  gridHorizontalSpace,
  xAxisDefault,
  xAxisLabelRotate,
  xAxisNone,
  xAxisSplitLine,
  yAxisDefault,
  yAxisNone,
  yAxisOnlySplitLine,
  yAxisName,
  yAxisAutoMaxMin,
  xAxisHorizontalBar,
  yAxisHorizontalBar,
  tooltipDefault,
  legendDefault,
  seriesItemLine,
  seriesItemSmoothLine,
  seriesItemBar,
  seriesItemStackBar,
  seriesItemPie,
  seriesItemDoughnut,
  seriesItemHideSymbol,
  seriesItemMarkLine,
  seriesItemLabel,
  seriesItemInsideLabel,
  seriesDataColorDanger,
  seriesItemPieLabelWithValue
} from './common/addons'

import * as echartAddonPlugins from './common/plugins'

import {
  emitter
} from './common/events'

import {
  setSeriesDataColorDangerByIndex
} from './common/fns'

const eventHandlerGenerators = {
  click: emitter
}

const echartAddon = new EchartAddon({
  'color:default': colorDefault(),
  'color:only2': colorOnly2(),
  'color:3': color3(),
  'color:5': color5(),
  'color:10': color10(),
  'grid:default': gridDefault(),
  'grid:inner': gridInner(),
  'grid:innerWithLegend': gridInnerWithLegend(),
  'grid:mini': gridMini(),
  'grid:narrow': gridNarrow(),
  'grid:xname': gridXname(),
  'grid:yname': gridYname(),
  'grid:horizontalSpace': gridHorizontalSpace(),
  'xAxis:default': xAxisDefault(),
  'xAxis:splitLine': xAxisSplitLine(),
  'xAxis:labelRotate': xAxisLabelRotate(),
  'xAxis:none': xAxisNone(),
  'xAxis:horizontalBar': xAxisHorizontalBar(),
  'yAxis:default': yAxisDefault(),
  'yAxis:none': yAxisNone(),
  'yAxis:horizontalBar': yAxisHorizontalBar(),
  'yAxis:name': yAxisName(),
  'yAxis:onlySplitLine': yAxisOnlySplitLine(),
  'yAxis:autoMaxMin': yAxisAutoMaxMin(),
  'tooltip:default': tooltipDefault(),
  'legend:default': legendDefault(),
  'seriesItem:bar': seriesItemBar(),
  'seriesItem:line': seriesItemLine(),
  'seriesItem:smoothLine': seriesItemSmoothLine(),
  'seriesItem:stackBar': seriesItemStackBar(),
  'seriesItem:pie': seriesItemPie(),
  'seriesItem:pieLabelWithValue': seriesItemPieLabelWithValue(),
  'seriesItem:doughnut': seriesItemDoughnut(),
  'seriesItem:label': seriesItemLabel(),
  'seriesItem:insideLabel': seriesItemInsideLabel(),
  'seriesItem:hideSymbol': seriesItemHideSymbol(),
  'seriesItem:markLine': seriesItemMarkLine(),
  'seriesData:colorDanger': seriesDataColorDanger()
}, echartAddonPlugins, {
  'setColorDangerByIndex': setSeriesDataColorDangerByIndex
})

export default {
  name: 'DisplayBasicChart',
  props: {
    dataset: { type: [Object, Array, String], default: () => ([]) },
    addons: { type: [Object, Array], default: () => ([]) },
    events: { type: Object, default: () => ({}) }
  },
  data () {
    echartAddon.mapping(this.addons)
    return {
      addonOptions: echartAddon.options,
      addonSeriesItem: echartAddon.seriesItem,
      addonSeriesData: echartAddon.seriesData,
      addonSeriesDataFns: echartAddon.seriesDataFns
    }
  },
  computed: {
    _dataset () {
      let result
      if (typeof this.dataset === 'string') result = JSON.parse(this.dataset)
      else result = this.dataset
      return result
    },
    chartStyle () {
      return {
        width: '100%',
        height: '300px'
      }
    },
    data () {
      if ((this._dataset instanceof Array)) return this._dataset
      else return this.tobeDataset(this._dataset)
    },
    series () {
      return this._dataset.columns.map((v, colIndex) => {
        let data
        const needSeriesData = Object.keys(this.addonSeriesData).length > 0 || this.addonSeriesDataFns.length > 0
        const isStack = (this.addonSeriesItem.stack)
        if (needSeriesData && isStack) {
          data = this._dataset.data.reduce((result, row, rowIndex) => {
            result.push({
              value: row[colIndex],
              ...this.addonSeriesData,
              ...this.addonSeriesDataFns.reduce((result, fn) => {
                result = { ...result, ...fn({ colIndex, rowIndex }) }
                return result
              }, {})
            })
            return result
          }, [])
        }

        return {
          name: v,
          ...this.addonSeriesItem,
          data
        }
      })
    },
    options () {
      return {
        ...this.addonOptions,
        dataset: {
          source: this.data
        },
        series: this.series
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
