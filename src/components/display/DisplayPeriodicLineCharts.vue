<template>
  <div class="preriodic-charts">
    <template v-if="subComponents.length > 0">
      <div
        v-for="(component, index) in subComponents"
        :key="index"
        :class="{ 'has-margin-bottom': subComponents.length > 2 && index < 2 }"
        class="preriodic-charts__chart"
      >
        <display-line-chart
          :dataset="component.dataset"
          :title="component.title"
          :question="component.question"
          :show-toolbox="isShowToolbox"
          :height="chartHeight"
        />
      </div>
    </template>
    <no-result 
      v-else 
      :message="$t('message.noPeriodicResult')" />
  </div>
</template>

<script>
export default {
  name: 'DisplayPeriodicLineCharts',
  props: {
    subComponents: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      isShowToolbox: false
    }
  },
  computed: {
    chartHeight () {
      return this.subComponents.length > 2 ? '230px' : '420px'
    }
  }
}
</script>
<style lang="scss" scoped>
.preriodic-charts {
  display: flex;
  flex-wrap: wrap;

  &__chart {
    flex: 1 1 calc(50% - 40px);
    width: 0;
    
    &.has-margin-bottom {
      margin-bottom: 40px;
    }

    &:nth-child(2n) {
      margin-left: 40px;
    }
  }

  /deep/ .no-result-block {
    width: 100%;
  }
}
</style>
