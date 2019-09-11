<template>
  <div class="trend-root-cause">
    <div class="block-title">趋势洞察</div>
    <div class="single-root-cause"
      v-for="(singleInfo, index) in info"
      :key="index"
    ><span class="index">{{ index + 1 }}</span> {{singleInfo}}</div>
  </div>
</template>
<script>
export default {
  name: 'TrendRootCause',
  props: {
    info: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.trend-root-cause {
  border-radius: 8px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.35);

  .block-title {
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 20px;
  }

  .single-root-cause {
    background: rgba(0, 0, 0, 0.35);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;

    .index {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid #fff;
      margin-right: 12px;
      text-align: center;
      line-height: 30px;
    }

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}
</style>
