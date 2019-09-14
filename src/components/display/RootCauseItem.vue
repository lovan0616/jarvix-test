<template>
  <div class="root-cause-item">
    <div class="chart-block">
      <display-line-chart height="280px" v-bind="chartData" v-if="chartType === 'line'">
      </display-line-chart>
      <display-bar-chart height="280px" v-bind="chartData" v-else>
      </display-bar-chart>
    </div>
    <div class="chart-description">
      {{text}}
    </div>
  </div>
</template>
<script>
import DisplayLineChart from '@/components/display/DisplayLineChart'
import DisplayBarChart from '@/components/display/DisplayBarChart'
export default {
  name: 'RootCauseItem',
  components: {
    DisplayLineChart,
    DisplayBarChart
  },
  props: {
    text: {type: String, default: ''},
    chartType: {
      type: String,
      default: 'bar',
      validator (value) {
        return ['bar', 'line'].indexOf(value) !== -1
      }
    },
    chartData: {type: Object, default: () => ({})}
  }
}
</script>
<style lang="scss" scoped>
.root-cause-item {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 14px;
  background-color: rgba(0, 0, 0, .35);
  margin: 10px 0;
  border-radius: 8px;

  .chart-block {
    width: 70%;
  }

  .chart-description {
    width: 30%;
    padding: 24px;
    letter-spacing: 0.2em;
    font-size: 14px;
  }
}
</style>
