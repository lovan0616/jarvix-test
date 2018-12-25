<template>
  <echart class="echart-bar-chart"
    :options="options"
    auto-resize
  >
  </echart>
</template>

<script>
import EchartAddon from '../common/addon'
import { colorDefault, tooltipDefault, xAxisDefault, yAxisDefault } from '../common/addons/default'
import { separateColumnsAndIndex } from '../../../utils/dataset'

const echartAddon = new EchartAddon({
  'color-default': colorDefault(),
  'tooltip-default': tooltipDefault(),
  'xAxis-default': xAxisDefault(),
  'yAxis-default': yAxisDefault()
})

export default {
  name: 'EchartBarChart',
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
      return this.data.columns.map(v => ({
        type: 'bar'
      }))
    },
    options () {
      return {
        xAxis: {},
        yAxis: {},
        ...echartAddon.mapping(this.addons),
        dataset: {
          source: this.dataset
        },
        series: this.series
      }
    }
  }
}
</script>
