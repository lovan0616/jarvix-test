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
import chartVariable from '@/styles/chart/variables.scss'
import EchartAddon from './common/addon.js'
import {
  colorDefault,
  colorOnly1,
  colorOnly2,
  color3,
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
  'seriesItem:markLine': seriesItemMarkLine()
})

export default {
  name: 'DisplayBasicChart',
  props: {
    dataset: { type: [Object, Array, String], default: () => ([]) },
    addons: { type: [Object, Array], default: () => ([]) },
    events: { type: Object, default: () => ({}) },
    isPreview: {
      type: Boolean,
      default: false
    }
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
          data
        }
      })
    },
    options () {
      let config = {
        ...this.addonOptions,
        tooltip: {
          confine: true,
          trigger: 'axis',
          backgroundColor: chartVariable['backgroundColor'],
          borderWidth: 1,
          borderColor: chartVariable['borderColor'],
          padding: 10,
          textStyle: {
            color: chartVariable['textColor']
          },
          // extraCssText: 'box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);'
          // tooltip 固定高度，且可滾動
          enterable: true,
          extraCssText: 'box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08); max-height: 200px; overflow: auto'
        },
        dataset: {
          source: this.data
        },
        series: this.series,
        color: this.colorList,
        legend: {
          type: 'scroll',
          itemWidth: 12,
          itemHeight: 12,
          icon: 'circle',
          itemGap: 20
        }
      }

      if (this.isPreview) this.previewChartSetting(config)
      return config
    },
    colorList () {
      switch (this.data[0].length) {
        case 2:
          return colorOnly1
        case 3:
          return colorOnly2
        case 4:
          return color3
        case 6:
          return colorDefault
        default:
          return color10
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
