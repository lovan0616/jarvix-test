<template>
  <div class="display-tree-map-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    />
  </div>
</template>
<script>
import { color12 } from './common/addons'

export default {
  name: 'DisplayTreeMapChart',
  props: {
    dataset: {
      type: Object,
      default: null
    }
  },
  computed: {
    chartOption () {
      return {
        color: color12,
        series: [{
          type: 'treemap',
          data: this.dataset.data
        }]
      }
    },
    chartStyle () {
      return {
        width: '100%',
        height: '420px'
      }
    }
  },
  methods: {
  },
}
</script>
