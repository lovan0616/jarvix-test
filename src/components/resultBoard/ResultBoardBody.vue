<template>
  <div class="result-board-body">
    <div 
      :class="{ 'is-open': isShowSettingBox }"
      class="key-result-container"
    >
      <button
        v-if="$slots.InsightBasicInfo" 
        v-show="hasBasicInfo"
        :class="{ active: showBasicInfo }"
        type="button"
        class="btn-m btn-secondary control-btn"
        @click.stop="toggleBasicInfoDialog"
      >{{ $t('resultDescription.basicInfo') }}</button>
      <div 
        v-if="$slots.multiAnalyPanel"
        class="multi-analysis__block">
        <slot name="multiAnalyPanel"/>
      </div>
      <div class="chart-block">
        <slot name="PageResultBoardIndicator"/>
        <slot name="PageResultBoardChart"/>
      </div>
      <slot-dialog
        v-if="$slots.InsightBasicInfo" 
        v-show="showBasicInfo && hasBasicInfo"
        :show="showBasicInfo"
        class="basic-info-container"
        @close="closeBasicInfoDialog"
      >
        <template slot="SlotDialog">
          <slot name="InsightBasicInfo"/>
        </template>
      </slot-dialog>
    </div>
    <div
      v-if="isShowOtherResultContainer"
      class="other-result-container"
    >
      <slot name="InsightRootCause"/>
      <div 
        v-if="$slots.InsightRecommended" 
        name="InsightRecommended">
        <div class="insights-info recommended">
          <div class="insights-info-title">{{ $t('resultDescription.recommendedInsight') }}</div>
          <div class="insights-info__wrapper">
            <slot name="InsightRecommended"/>
          </div>
        </div>
      </div>
      <slot name="CorrelationAnalysis"/>
    </div>
  </div>
</template>
<script>
import SlotDialog from '@/components/dialog/SlotDialog'
import { mapState } from 'vuex'

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
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox']),
    ...mapState('chatBot', ['hasBasicInfo']),
    isShowOtherResultContainer () {
      return this.$slots.InsightRootCause || this.$slots.InsightRecommended || this.$slots.CorrelationAnalysis
    }
  },
  watch: {
    isShowSettingBox (value, oldValue) {
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

  .key-result-container {
    position: relative;
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    border-bottom: 1px solid $theme-border-color;
    & ~ [name="InsightRootCause"]:not(:last-child),
    & ~ [name="CorrelationAnalysis"]:not(:last-child) {
      margin-bottom: 32px;
    }

    .chart-block {
      width: 100%;
      padding: 30px;
      min-width: 0;
      flex: 1;
      margin-right: 0;
    }
    
    .basic-info-container {
      padding: 20px;
      border-radius: 8px;
      width: 40%;
      position: absolute;
      top: 65px;
      right: 30px;
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

    .control-btn {
      position: absolute;
      top: 30px;
      right: 30px;
      padding: 7px 15px;

      &.active {
        background-color: #42A5B3;
      }
    }
  }
  .other-result-container {
    padding: 30px;
  }
  .insights-info.recommended {
    .insights-info__wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }
  .multi-analysis {
    &__block {
      border-right: 1px solid $theme-border-color;
      flex-basis: 180px;
    }
    &__list {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }
    &__item {
      position: relative;
      display: flex;
      align-items: center;
      color: #A7A7A7;
      height: 54px;
      padding-left: 20px;
      padding-right: 20px;
      border-bottom: 1px solid $theme-border-color;
      cursor: pointer;
      &:hover {
        color: $theme-color-primary;
      }
      &.is-active {
        color: $theme-color-primary;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 4px;
          background-color: $theme-color-primary;
        }
      }
      /deep/ .spinner-block {
        padding: 0;
      }
      &-label {
        .svg-icon {
          margin-right: 6px;
        }
      }
      &-status {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        cursor: pointer;
        .trigger-analysis-icon {
          color: $theme-color-primary;
        }
        .more-icon {
          color: #A7A7A7;
        }
      }
      &-dropdownlist {
        position: relative;
        cursor: pointer;
        &:hover {
          .dropdown {
            visibility: visible;
          }
        }
        /deep/ .dropdown {
          visibility: hidden;
          .dropdown-select-box {
            top: 30px;
            left: -20px;
            z-index: 1;
            &:before {
              left: 18px;
            }
          }
        }
      }
    }
  }
}


</style>
