<template>
  <div class="result-board-body root-cause-board-body">
    <div class="title-block">摘要報告</div>
    <div class="main-chart-container">
      <div class="chart-description-block">
        <slot name="RootCauseDescription"></slot>
      </div>
      <div class="chart-block">
        <slot name="PageResultBoardChart"></slot>
      </div>
    </div>
    <div class="title-block">重要因素变化比较</div>
    <div class="root-cause-item-block">
      <slot name="RootCauseItem"></slot>
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
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.result-board-body {
  padding: 40px 30px 30px;

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
      width: 60%;
    }

    > .chart-block {
      width: 40%;
      display: flex;
      align-items: center;
    }
  }
}
</style>
