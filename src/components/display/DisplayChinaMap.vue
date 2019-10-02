<template>
  <div class="display-china-map">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    >
    </v-echart>
  </div>
</template>
<script>
import 'echarts/map/js/china'

export default {
  name: 'DisplayChinaMap',
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
          // formatter: '{a}<br/>{b}:{c}'
          formatter: params => params.name ? `<p>${params.marker}${params.name}: ${params.value || 0}</p>` : null
        },
        visualMap: {
          align: 'left',
          min: 0,
          max: this.maxValue,
          text: [this.$t('resultDescription.high'), this.$t('resultDescription.low')],
          calculable: true,
          inRange: {
            color: ['#95FAF2', '#6245FF']
          },
          textStyle: {
            color: '#fff'
          },
          padding: 0
        },
        series: [{
          name: 'china',
          type: 'map',
          roam: true,
          left: 'center',
          top: 'middle',
          layoutCenter: ['50%', '50%'],
          layoutSize: 600,
          mapType: 'china',
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
          emphasis: {
            itemStyle: {
              areaColor: '#6245FF'
            }
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
