<template>
  <div class="insights-info basic-insights">
    <div class="insighs-info-title">基本資料</div>
    <div class="insights-info-block">
      <div class="insight-tabl-list">
        <div class="insight-table"
          v-if="info.nTable.length > 0"
        >
          <div class="insight-table-row table-head">
            <div class="insight-table-cell"
              v-for="(value, key, index) in info.nTable[0]"
              :key="index"
            >{{ key }}</div>
          </div>
          <div class="insight-table-row"
            v-for="(tableInfo, index) in info.nTable"
            :key="index"
          >
            <div class="insight-table-cell"
              v-for="(tableCell, cellIndex) in tableInfo"
              :key="cellIndex"
            >{{ tableCell }}</div>
          </div>
        </div>
        <div class="insight-table"
          v-if="info.cTable.length > 0"
        >
          <div class="insight-table-row table-head">
            <div class="insight-table-cell"
              v-for="(value, key, index) in info.cTable[0]"
              :key="index"
            >{{ key }}</div>
          </div>
          <div class="insight-table-row"
            v-for="(tableInfo, index) in info.cTable"
            :key="index"
          >
            <div class="insight-table-cell"
              v-for="(tableCell, cellIndex) in tableInfo"
              :key="cellIndex"
            >{{ tableCell }}</div>
          </div>
        </div>
      </div>
      <div class="insights-info"
        v-for="(commentInfo, index) in info.nComment"
        :key="index"
      >{{ commentInfo }}</div>
      <div class="insights-info"
        v-for="(commentInfo, index) in info.cComment"
        :key="index"
      >{{ commentInfo }}</div>
    </div>
  </div>
  
</template>
<script>
export default {
  name: 'InsightTable',
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.basic-insights.insights-info {
  margin-bottom: 16px;

  .insights-info-block {
    padding: 32px 16px 16px;
  }
  .insight-tabl-list {
    margin-bottom: 16px;
  }
  .insight-table {
    width: 100%;

    &:not(:last-child) {
      border-bottom: 1px solid #CCCCCC;
    }
  }

  .insight-table-row {
    display: flex;
    justify-content: space-between;

    &.table-head {
      font-size: 13px;
      line-height: 20px;
      color: #979797;
      margin-bottom: 8px;
    }
  }
  .insight-table-cell {
    font-size: 14px;
    line-height: 24px;
    padding: 4px 0;

    &:first-child {
      width: 7%;
    }
    &:nth-child(2) {
      width: 11.36%;
    }
    &:nth-child(3) {
      width: 10.66%;
    }
    &:nth-child(4) {
      width: 10.66%;
    }
    &:nth-child(5) {
      width: 10.66%;
    }
    &:nth-child(6) {
      width: 10.66%;
    }
    &:last-child {
      flex: 1;
    }
  }
  .insights-info {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
    color: #43BAC3;

    &:not(:last-child) {
      margin-bottom: 4px;
    }
  }
}
</style>
