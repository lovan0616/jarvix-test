<template>
  <div class="display-world-map">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    />
  </div>
</template>
<script>
import 'echarts/map/js/world'

export default {
  name: 'DisplayWorldMap',
  props: {
    dataset: {
      type: Object,
      default: null
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
    }
  },
  computed: {
    maxValue () {
      let seriesArray = this.dataset.data.map(element => element.value)
      return Math.max(...seriesArray)
    },
    chartOption () {
      return {
        tooltip: {
          formatter: '{a}<br/>{b}:{c}'
        },
        visualMap: {
          align: 'left',
          min: 0,
          max: this.maxValue,
          text: ['High', 'Low'],
          calculable: true,
          inRange: {
            color: ['#95FAF2', '#6245FF']
          },
          textStyle: {
            color: '#fff'
          }
        },
        series: [{
          name: 'world',
          type: 'map',
          mapType: 'world',
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            borderColor: '#4DD5DE',
            color: '#78F5F7'
          },
          data: this.dataset.data
        }]
      }
    },
    chartStyle () {
      return {
        width: '100%',
        height: 500
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
