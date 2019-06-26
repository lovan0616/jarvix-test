<template>
  <div class="insights-info root-cause">
    <div class="insighs-info-title">资料洞察</div>
    <div class="insights-info-block">
      <div class="insight-info"
        v-for="(insight, index) in info.rootCause"
        :key="index"
      >
        <div class="dot"></div>
        <div class="insight-text">{{ insight }}</div>
      </div>
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
        return {}
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

      .dot {
        flex: initial;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 1px solid $theme-color-primary;
        margin-top: 6px;
        margin-right: 10px;
      }

      .insight-text {
        flex: 1;
      }

      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
