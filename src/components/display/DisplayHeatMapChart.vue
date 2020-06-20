<template>
  <div class="display-heat-map-chart">
    <v-echart
      :style="chartStyle"
      :options="chartOption"
      auto-resize
    />
  </div>
</template>
<script>
export default {
  name: 'DisplayHeatMapChart',
  props: {
    // dataset.columns = ['x 軸名稱', 'y 軸名稱', 'z 軸名稱']
    // dataset.data = [ [0,0,5],[0,1,1],[0,2,0],[0,3,0] ...... ] > [x, y, value]
    // dataset.index = [ [1, 2, 3, 4, 5 ,6 ......], [1, 2, 3, 4, 5, 6 ......] ] [ [x 軸欄位名稱], [y 軸欄位名稱] ]
    // dataset.index[0] 數量 乘上 index[1] 數量 = value 格數
    // dataset.data 要送到 series 時，data[0] 跟 data[1] 要交換位置
    dataset: {
      type: Object,
      default: null
    }
  },
  computed: {
    chartOption () {
      return {
        tooltip: {
          position: 'top'
        },
        grid: {
          height: '50%',
          y: '10%'
        },
        textStyle: {
          color: '#fff'
        },
        xAxis: {
          name: this.dataset.columns[0],
          type: 'category',
          data: this.dataset.index[0],
          splitArea: {
            show: true
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          name: this.dataset.columns[1],
          type: 'category',
          data: this.dataset.index[1],
          splitArea: {
            show: true
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        visualMap: {
          min: 0,
          max: this.maxValue,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%',
          inRange: {
            color: ['#95FAF2', '#C238FF']// From smaller to bigger value
          },
          textStyle: {
            color: '#fff'
          }
        },
        series: [{
          name: this.dataset.columns[2],
          type: 'heatmap',
          data: this.dataset.data,
          label: {
            normal: {
              show: true
            }
          }
        }]
      }
    },
    maxValue () {
      let max = 0
      this.dataset.data.forEach(element => {
        if (element[2] > max) {
          max = element[2]
        }
      })

      return max
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
