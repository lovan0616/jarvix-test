<template>
  <div class="result-board-body">
    <!-- indicator -->
    <slot name="PageResultBoardIndicator"></slot>
    <div class="chart-container"
      :class="{'is-open': isShowChatRoom}"
    >
      <button type="button" class="btn-m btn-default control-btn"
        :class="{active: showBasicInfo}"
        v-if="$slots.InsightBasicInfo"
        v-show="isShowChatRoom"
        @click.stop="toggleBasicInfoDialog"
      >{{ $t('resultDescription.basicInfo') }}</button>
      <div class="chart-block">
        <slot name="PageResultBoardChart"></slot>
      </div>
      <slot-dialog class="basic-info-container"
        v-if="$slots.InsightBasicInfo"
        v-show="showBasicInfo || !isShowChatRoom"
        :show="showBasicInfo"
        @close="closeBasicInfoDialog"
      >
        <template slot="SlotDialog">
          <slot name="InsightBasicInfo"></slot>
        </template>
      </slot-dialog>
    </div>
    <slot name="InsightRootCause"></slot>
    <slot name="CorrelationAnalysis"></slot>
  </div>
</template>
<script>
import SlotDialog from '@/components/dialog/SlotDialog'

export default {
  name: 'ResultBoardBody',
  components: {
    SlotDialog
  },
  data () {
    return {
      showBasicInfo: false
    }
  },
  methods: {
    toggleBasicInfoDialog () {
      this.showBasicInfo = !this.showBasicInfo
    },
    closeBasicInfoDialog () {
      this.showBasicInfo = false
    }
  },
  computed: {
    isShowChatRoom () {
      return this.$store.state.isShowChatRoom
    }
  },
  watch: {
    isShowChatRoom (value, oldValue) {
      this.closeBasicInfoDialog()
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
    flex-wrap: nowrap;
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
        border: 1px solid $theme-color-primary;
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
          border-bottom-color: $theme-color-primary;
          border-width: 10px;
        }
      }
    }

    .chart-block {
      width: calc(71.5% - 32px);
      flex: 1;
      margin-right: 32px;
    }

    .basic-info-container {
      flex: initial;
      width: 28.5%;
      padding: 20px;
      border-radius: 8px;
      background-color: $theme-bg-color;
    }

    .control-btn {
      position: absolute;
      top: -30px;
      right: 0;
      padding: 7px 15px;

      &.active {
        background-color: #42A5B3;
      }
    }
  }
}
</style>
