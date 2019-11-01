<template>
  <div class="trend-root-cause">
    <div class="block-title">{{ $t('resultDescription.trendInsight') }}</div>
    <div class="single-root-cause"
      v-for="(singleInfo, index) in info"
      :key="index"
      @click="linkTo(singleInfo.next_question)"
    >
      <span class="info-index">{{ index + 1 }}</span>
      <div class="info-content">{{singleInfo.information}}</div>
    </div>
    <div class="empty-info"
      v-if="info.length === 0"
    >
      {{ $t('resultDescription.trendInsightNoData') }}
    </div>
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
  },
  methods: {
    linkTo (value) {
      this.$store.commit('bookmark/setAppQuestion', value)
      // 區分使用者是點擊推薦問句或是點擊過往的問句
      this.$store.dispatch('bookmark/updateResultRouter', 'trend_root_cause')
    }
  }
}
</script>
<style lang="scss" scoped>
.trend-root-cause {
  border-radius: 8px;
  padding: 20px;
  background-color: $theme-bg-color;

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
    cursor: pointer;

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
    background: $theme-bg-color;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
  }
}
</style>
