<template>
  <div class="insight-info-block">
    <div class="insight-title">{{ info.title }}</div>
    <div class="insight-info-list">
      <div class="insight-info"
        v-for="(insight, index) in info.value"
        :key="index"
      >{{ insight }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InsightInfoBlock',
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
.insight-info-block {
  .insight-title {
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.1em;
    color: #000000;
    margin-bottom: 6px;
  }
  .insight-info-list {
    background: #F5FBFB;
    border-radius: 8px;
    padding: 15px 20px;

    .insight-info {
      display: flex;
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
