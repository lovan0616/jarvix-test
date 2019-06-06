<template>
  <div class="insights-info root-cause">
    <div class="insighs-info-title">資料探勘</div>
    <div class="insights-info-block">
      <div class="insight-info"
        v-for="(insight, index) in info.rootCause"
        :key="index"
      >{{ insight }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InsightList',
  props: {
    info: {
      type: Object,
      default () {
        return {
          'rootCause': [  
            '當customer_id等於PNMS時，資料筆數為2229，佔整體7.0%，price的平均為267.17，高於整體平均(52.83)405.75%。',
            '當customer_id等於FOXBORO時，資料筆數為1022，佔整體3.0%，price的平均為251.7，高於整體平均(52.83)376.46%。'
          ]
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.insights-info.root-cause {
  .insights-info-block {
    padding: 15px 20px;

    .insight-info {
      display: flex;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.05em;

      &:before {
        content: '';
        display: block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 1px solid $theme-color-primary;
        margin-top: 6px;
        margin-right: 10px;
      }

      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
