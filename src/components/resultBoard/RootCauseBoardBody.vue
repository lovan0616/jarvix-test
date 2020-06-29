<template>
  <div class="result-board-body root-cause-board-body">
    <hint-info-block
      :msg-list="[$t('editing.resultOverSizeMessage')]"
      inline
    />
    <div class="title-block">{{ $t('resultDescription.summaryReport') }}</div>
    <div class="main-chart-container">
      <div class="chart-description-block">
        <slot name="RootCauseDescription"/>
      </div>
      <div class="chart-block">
        <slot name="PageResultBoardChart"/>
      </div>
    </div>
    <div class="title-block">{{ $t('resultDescription.importantFeatureChanging') }}</div>
    <div class="root-cause-item-block">
      <slot name="RootCauseItem"/>
    </div>
  </div>
</template>
<script>
import HintInfoBlock from '@/components/display/HintInfoBlock'

export default {
  name: 'RootCauseBoardBody',
  components: {
    HintInfoBlock
  },
  data () {
    return {
      showBasicInfo: false
    }
  }
}
</script>
<style lang="scss" scoped>
.result-board-body {
  padding: 19px 30px 30px;

  .title-block {
    font-size: 20px;
    line-height: 34px;
    letter-spacing: var(--theme-letter-spacing-semi-wide);
    color: #fff;
    margin-bottom: 16px;
  }

  .main-chart-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 32px;

    .chart-block {
      flex: 1;
      min-width: 240px;
    }

    .root-cause-item-block {
      display: flex;
    }

    > .chart-description-block {
      width: 58%;
      margin-right: 2%;
    }

    > .chart-block {
      width: 40%;
      display: flex;
      align-items: center;
      padding: 10px 14px;
      background-color: rgba(0, 0, 0, .35);
      border-radius: 8px;
    }
  }
}
</style>
