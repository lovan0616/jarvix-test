<template>
  <div class="trend-root-cause">
    <div class="block-title">趋势洞察</div>
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
      暂无侦测出任何趋势异常
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
  background-color: rgba(0, 0, 0, 0.35);

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
      border: 1px solid #4DE2F0;
      margin-right: 12px;
      text-align: center;
      line-height: 30px;
      color: #4DE2F0;
    }

    .info-content {
      flex: 1;
    }

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  .empty-info {
    background: rgba(0, 0, 0, 0.35);
    border-radius: 8px;
    padding: 20px;
    text-align: center;
  }
}
</style>
