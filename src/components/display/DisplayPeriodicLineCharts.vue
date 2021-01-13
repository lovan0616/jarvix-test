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
          :is-show-toolbox="isShowToolbox"
          :show-warning="false"
          :height="chartHeight"
        />
      </div>
      <!-- 週期性分析的每種圖的 warning 都會一樣，只需要顯示其中一個 -->
      <insight-description-block
        :title="$t('resultDescription.warning')"
        :message-list="preriodicWarnings"
        message-type="warning"
        icon-name="alert-circle"
      />
    </template>
    <no-result 
      v-else 
      :message="$t('message.noPeriodicResult')" />
  </div>
</template>

<script>
import InsightDescriptionBlock from './InsightDescriptionBlock'

export default {
  name: 'DisplayPeriodicLineCharts',
  components: {
    InsightDescriptionBlock
  },
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
    },
    preriodicWarnings () {
      return this.subComponents[0].dataset.warnings
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
