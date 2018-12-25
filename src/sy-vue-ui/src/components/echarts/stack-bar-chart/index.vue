<template>
  <echart class="echart-stack-bar-chart"
    :options="options"
    auto-resize
  >
  </echart>
</template>

<script>
import EchartAddon from '../common/addon'
import { colorDefault, tooltipDefault, tooltipReverse, xAxisDefault, yAxisDefault } from '../common/addons/default'
import { separateColumnsAndIndex } from '../../../utils/dataset'
import { deepMergeObj } from '../../../utils/general'

const echartAddon = new EchartAddon({
  'color-default': colorDefault(),
  'tooltip-default': tooltipDefault(),
  'tooltip-reverse': tooltipReverse(),
  'xAxis-default': xAxisDefault(),
  'yAxis-default': yAxisDefault()
})

export default {
  name: 'EchartStackBarChart',
  props: {
    dataset: { type: [Object, Array], default: () => ([]) },
    addons: { type: [Object, Array], default: () => ([]) }
  },
  computed: {
    data () {
      if (!(this.dataset instanceof Array)) return this.dataset
      else return separateColumnsAndIndex(this.dataset)
    },
    series () {
      const counts = []
      return this.data.columns.map((col, colIndex) => {
        const data = this.data.data.map((row, rowIndex) => {
          if (counts[rowIndex] === undefined) counts[rowIndex] = 0
          if (row[colIndex] !== null) counts[rowIndex]++
          else return null
          return {
            value: row[colIndex],
            itemStyle: {
              color: colorDefault()[counts[rowIndex] - 1]
            }
          }
        })
        return {
          name: col,
          type: 'bar',
          stack: 'stack',
          data
        }
      })
    },
    options () {
      return deepMergeObj(echartAddon.mapping(this.addons), {
        xAxis: {
          data: this.data.index
        },
        yAxis: {},
        series: this.series
      })
    }
  }
}
</script>
