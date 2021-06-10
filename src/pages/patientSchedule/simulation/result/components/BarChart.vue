<template>
  <div class="card">
    <div class="card__title">
      {{ chartData.title }}
    </div>
    <div class="card__content">
      <div
        v-if="chartData.series.length === 0"
        class="empty-block"
      >
        <span
          class="empty-block__text"
        > {{ $t('schedule.base.noData') }}
        </span>
      </div>
      <v-echart
        v-else
        :style="chartStyle"
        :options="options"
        auto-resize
      />
    </div>
  </div>
</template>

<script>
import ECharts from 'vue-echarts'
import {
  colorOnly1,
  colorOnly2,
  color5,
  color12,
  legend,
  xAxisDefault,
  yAxisDefault
} from '@/schedule/utils/echartAddon'

export default {
  name: 'BarChart',
  components: {
    'v-echart': ECharts
  },
  props: {
    chartData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    options () {
      return {
        xAxis: {
          data: this.chartData.xAxis,
          ...xAxisDefault()
        },
        yAxis: {
          name: this.chartData.yAxisName,
          ...yAxisDefault()
        },
        series: [...this.chartData.series.map((item, index) => ({
          type: 'bar',
          barWidth: '48%',
          name: this.chartData.xAxis[index],
          stack: 'stack',
          data: (() => {
            const _data = []
            _data.length = this.chartData.series.length
            _data[index] = item
            return _data
          })()
        }))],
        legend,
        color: this.colorList,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          formatter (datas) {
            const item = datas.find(d => d.value !== undefined)
            return `${item.marker}${item.name} : ${Number(item.value).toFixed(2)}`
          }
        },
        grid: {
          left: '8px',
          right: '8px',
          top: '70px',
          bottom: '20px',
          containLabel: true
        }
      }
    },
    chartStyle () {
      return {
        width: '100%',
        height: '200px'
      }
    },
    colorList () {
      switch (this.chartData.series.length) {
        case 1:
          return colorOnly1
        case 2:
          return colorOnly2
        case 3:
        case 4:
        case 5:
          return color5
        default:
          return color12
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  height: 260px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  transition: all 0.3s;
  border-radius: 6px;
  overflow: hidden;

  &:hover {
    box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.12);
  }

  &__title {
    padding: 12px;
    background-color: rgba(50, 75, 78, 0.6);
  }
  &__content {
    flex: 1;
    padding: 12px;
    background-color: rgba(35, 61, 64, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & + .card {
    margin-left: 16px;
  }
}

.empty-block {
  text-align: center;
  &__text {
    font-size: 12px;
    line-height: 60px;
    color: var(--color-text-gray);
  }
}
</style>
