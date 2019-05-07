<template>
  <div class="insights-block">
    <div class="insights-title">基本資料</div>
    <div class="insights-content-block">
      <div class="insights-table">
        <div class="insights-table-row table-head">
          <div class="insights-table-cell"></div>
          <div class="insights-table-cell">範圍</div>
          <div class="insights-table-cell">總和</div>
          <div class="insights-table-cell">總數量</div>
          <div class="insights-table-cell">平均</div>
          <div class="insights-table-cell">中位數</div>
          <div class="insights-table-cell">標準差</div>
          <div class="insights-table-cell">備註</div>
        </div>
        <div class="insights-table-row">
          <div class="insights-table-cell">價格</div>
          <div class="insights-table-cell">0.0到999.99</div>
          <div class="insights-table-cell">123456789</div>
          <div class="insights-table-cell">123465</div>
          <div class="insights-table-cell">1324</div>
          <div class="insights-table-cell">1234</div>
          <div class="insights-table-cell">122.34</div>
          <div class="insights-table-cell">較多的數據分佈在160以下</div>
        </div>
      </div>
      <div class="insights-remark">價格和成本的關係係數為0.24，低於0.35屬於不顯著，因此無明顯的相關性</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InsightsTable'
}
</script>
<style lang="scss" scoped>
.insights-block {
  &:not(:last-child) {
    margin-bottom: 20px;
  }

  .insights-title {
    font-size: 18px;
    line-height: 26px;
    letter-spacing: 0.1em;
    color: #000000;
    margin-bottom: 6px;
  }
  .insights-content-block {
    background-color: #F5FBFB;
    padding: 15px 20px;
  }
  .insights-table {
    display: table;
    width: 100%;
  }
  .insights-table-row {
    display: table-row;
    width: 100%;
    font-size: 13px;
    line-height: 20px;

    &:not(:last-child) {
      margin-bottom: 2px;
    }

    &.table-head {
      color: #979797;
    }
  }
  .insights-table-cell {
    display: table-cell;
  }
  .insights-remark {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.05em;
    color: #0F9696;
    margin-top: 15px;
  }
}
</style>
