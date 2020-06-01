<template>
  <div class="result-board-body">
    <!-- indicator -->
    <slot name="PageResultBoardIndicator"/>
    <div 
      :class="{'is-open': isShowChatRoom}"
      class="chart-container"
    >
      <!-- <QuestionAnalysisAlert/> -->
      <button 
        v-if="$slots.InsightBasicInfo" 
        v-show="isShowChatRoom"
        :class="{active: showBasicInfo}"
        type="button"
        class="btn-m btn-default control-btn"
        @click.stop="toggleBasicInfoDialog"
      >{{ $t('resultDescription.basicInfo') }}</button>
      <div class="chart-block">
        <slot name="PageResultBoardChart"/>
      </div>
      <slot-dialog 
        v-if="$slots.InsightBasicInfo"
        v-show="showBasicInfo || !isShowChatRoom"
        :show="showBasicInfo"
        class="basic-info-container"
        @close="closeBasicInfoDialog"
      >
        <template slot="SlotDialog">
          <slot name="InsightBasicInfo"/>
        </template>
      </slot-dialog>
    </div>
    <slot name="InsightRootCause"/>
    <slot name="CorrelationAnalysis"/>
  </div>
</template>
<script>
import SlotDialog from '@/components/dialog/SlotDialog'
import QuestionAnalysisAlert from './QuestionAnalysisAlert'

export default {
  name: 'ResultBoardBody',
  components: {
    SlotDialog,
    QuestionAnalysisAlert
  },
  data () {
    return {
      showBasicInfo: false
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
  },
  methods: {
    toggleBasicInfoDialog () {
      this.showBasicInfo = !this.showBasicInfo
    },
    closeBasicInfoDialog () {
      this.showBasicInfo = false
    }
  },
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
      width: 100%;
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
