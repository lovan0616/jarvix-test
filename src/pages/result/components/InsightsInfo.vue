<template>
  <div class="insights-info-block">
    <div class="insights-info"
      v-for="(info, index) in infoList"
      :key="index"
    >{{ info }}</div>
  </div>
</template>
<script>
export default {
  name: 'InsightsInfo',
  props: {
    infoList: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
.insights-info-block {
  background: #F1F7F7;
  border-radius: 0 0 8px 8px;
  padding: 20px 30px 20px 50px;
  font-size: 13px;
  line-height: 22px;
  letter-spacing: 0.05em;
  color: #2E2E2E;

  .insights-info {
    position: relative;
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0.05em;

    &:before {
      position: absolute;
      top: 5px;
      left: -20px;
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      border: 1px solid #0F9696;
    }

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
}
</style>
