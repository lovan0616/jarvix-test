<template>
  <div class="result-board-body">
    <!-- indicator -->
    <slot name="PageResultBoardIndicator"></slot>
    <div class="chart-container"
      :class="{'is-open': isShowChatRoom}"
    >
      <button type="button" class="btn btn-default control-btn"
        v-show="isShowChatRoom"
        @click="toggleBasicInfoDialog"
      >基本资料</button>
      <div class="chart-block">
        <slot name="PageResultBoardChart"></slot>
      </div>
      <div class="basic-info-container"
        v-if="showBasicInfo || !isShowChatRoom"
      >
        <slot name="InsightBasicInfo"></slot>
      </div>
    </div>
    <slot name="InsightRootCause"></slot>
    <slot name="CorrelationAnalysis"></slot>
  </div>
</template>
<script>
export default {
  name: 'ResultBoardBody',
  data () {
    return {
      showBasicInfo: false
    }
  },
  methods: {
    toggleBasicInfoDialog () {
      this.showBasicInfo = !this.showBasicInfo
    }
  },
  computed: {
    isShowChatRoom () {
      return this.$store.state.isShowChatRoom
    }
  },
  watch: {
    isShowChatRoom (value, oldValue) {
      this.showBasicInfo = false
    }
  }
}
</script>
<style lang="scss" scoped>
.result-board-body {
  padding: 40px 30px 30px;

  .chart-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 32px;

    &.is-open {
      .chart-block {
        width: 100%;
        margin-right: 0;
      }
      .basic-info-container {
        width: 40%;
        position: absolute;
        top: 0;
        right: 0;
        border: 1px solid #4DE2F0;
        background-color: rgba(24, 24, 24, 0.95);
        z-index: 10000000; // echart 裡面的 tooltip z-index 給 9999999，逼不得已給這麼大

        &:before {
          position: absolute;
          top: -20px;
          right: 30px;
          display: block;
          border: solid transparent;
          content: " ";
          height: 0;
          width: 0;
          pointer-events: none;
          border-bottom-color: #4DE2F0;
          border-width: 10px;
        }
      }
    }

    .chart-block {
      flex: 1;
      width: 28.5%;
      margin-right: 32px;
    }

    .basic-info-container {
      flex: initial;
      width: 28.5%;
      padding: 20px;
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.35);
    }

    .control-btn {
      position: absolute;
      top: -36px;
      right: 0;
      padding: 7px 15px;
    }
  }
}
</style>
