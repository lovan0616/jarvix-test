<template>
  <div class="result-board-body root-cause-board-body">
    <div class="hint-info-block">
      <div class="hint-info"><span class="hint-title"><svg-icon icon-class="lamp"/> {{ $t('resultDescription.prompt') }}:</span> {{ $t('editing.resultOverSizeMessage') }}</div>
    </div>
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
export default {
  name: 'RootCauseBoardBody',
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

  .hint-info-block {
    background-color: rgba(0, 0, 0, 0.55);
    border-radius: 5px;
    padding: 11px;
    font-size: 14px;
    line-height: 1;
    margin-bottom: 12px;

    .hint-title {
      color: #FFDF6F;
    }
  }

  .title-block {
    font-size: 20px;
    line-height: 34px;
    letter-spacing: 0.1em;
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
