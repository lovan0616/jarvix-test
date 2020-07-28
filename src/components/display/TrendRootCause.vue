<template>
  <div 
    v-if="info.length > 0"
    class="trend-root-cause"
  >
    <div class="block-title">{{ $t('resultDescription.trendInsight') }}</div>
    <div
      v-for="(singleInfo, index) in info"
      :key="index"
      :class="{'has-link': singleInfo.next_question}"
      class="single-root-cause"
      @click="linkTo(singleInfo.next_question)"
    >
      <span class="info-index">{{ index + 1 }}</span>
      <div class="info-content">{{ singleInfo.information }}</div>
    </div>
    <!-- <div
      v-if="info.length === 0"
      class="empty-info"
    >
      {{ $t('resultDescription.trendInsightNoData') }}
    </div> -->
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
      if (!value) return
      this.$store.commit('dataSource/setAppQuestion', value)
      // 區分使用者是點擊推薦問句或是點擊過往的問句
      this.$store.dispatch('dataSource/updateResultRouter', 'trend_root_cause')
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
