<template>
  <div 
    v-if="info.length > 0"
    class="trend-root-cause"
  >
    <div class="block-title">IV 曲線異常洞察</div>
    <div
      v-for="(singleInfo, index) in info"
      :key="index"
      :class="{'has-link': singleInfo.next_question}"
      class="single-root-cause"
    >
      <span class="info-index">{{ index + 1 }}</span>
      <div class="info-content">{{ singleInfo }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TrendRootCauseOEDemo',
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
  background-color: var(--color-bg-5);

  .block-title {
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 20px;
  }

  .single-root-cause {
    @include card();
    display: flex;
    align-items: center;
    padding: 12px;

    &.has-link {
      cursor: pointer;

      .info-content {
        text-decoration: underline;
      }
    }

    .info-index {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 1px solid $theme-color-primary;
      margin-right: 12px;
      text-align: center;
      line-height: 30px;
      color: $theme-color-primary;
    }

    .info-content {
      flex: 1;
    }

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  .empty-info {
    background: var(--color-bg-5);
    border-radius: 8px;
    padding: 20px;
    text-align: center;
  }
}
</style>
