<template>
  <div class="display-tree-map-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    >
    </v-echart>
  </div>
</template>
<script>
import { color10 } from './common/addons'

export default {
  name: 'DisplayTreeMapChart',
  props: {
    dataset: {
      type: Object,
      default: null
    }
  },
  methods: {
  },
  computed: {
    chartOption () {
      return {
        color: color10,
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
  }
}
</script>
