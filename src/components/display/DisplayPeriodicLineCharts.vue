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
          :show-warning="false"
          :height="chartHeight"
        />
      </div>
      <!-- 週期性分析的每種圖的 warning 都會一樣，只需要顯示其中一個 -->
      <div 
        v-if="preriodicWarnings && preriodicWarnings.length > 0"
        class="warning"
      >
        <div class="warning__title"> 
          <svg-icon icon-class="alert-circle"/>
          {{ $t("resultDescription.warning") }}
        </div>
        <span 
          v-for="(message, index) in preriodicWarnings" 
          :key="index"
          class="warning__item">{{ preriodicWarnings.length > 1 ? (index + 1) + '. ' + message : message }}</span>
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
  
  .warning {
    width: 100%;
    margin-top: 20px;
    border-radius: 8px;
    padding: 10px 20px;
    background: rgba(255, 223, 111, 0.08);

    &__title {
      font-size: 14px;
      font-weight: 600;
      line-height: 24px;
      color: #FFDF6F;
    }

    &__item {
      font-size: 14px;
      letter-spacing: 0.1em;
      display: block;
      line-height: 24px;
      color: #FFDF6F;
    }
  }
}
</style>
