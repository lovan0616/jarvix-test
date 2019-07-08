<template>
  <div class="insights-info basic-insights">
    <div class="insighs-info-title">基本资料</div>
    <div class="insights-info-block">
      <div class="insight-table-list">
        <div class="insight-table"
          v-if="info.nTable.length > 0"
        >
          <div class="insight-table-row table-head">
            <div class="insight-table-cell"></div>
            <div class="insight-table-cell">总和</div>
            <div class="insight-table-cell">总数量</div>
            <div class="insight-table-cell">最大数值</div>
            <div class="insight-table-cell">最小数值</div>
            <div class="insight-table-cell">平均值</div>
            <div class="insight-table-cell">标准差</div>
            <div class="insight-table-cell">备注</div>
          </div>
          <div class="insight-table-row"
            v-for="(tableInfo, index) in info.nTable"
            :key="index"
          >
            <div class="insight-table-cell">{{ tableInfo.name }}</div>
            <div class="insight-table-cell">{{ tableInfo.sum }}</div>
            <div class="insight-table-cell">{{ tableInfo.count }}</div>
            <div class="insight-table-cell">{{ tableInfo.max }}</div>
            <div class="insight-table-cell">{{ tableInfo.min }}</div>
            <div class="insight-table-cell">{{ tableInfo.avg }}</div>
            <div class="insight-table-cell">{{ tableInfo.sd }}</div>
            <div class="insight-table-cell">{{ tableInfo.comment }}</div>
          </div>
        </div>
        <div class="insight-table"
          v-if="info.cTable.length > 0"
        >
          <div class="insight-table-row table-head">
            <div class="insight-table-cell"></div>
            <div class="insight-table-cell">总数量</div>
            <div class="insight-table-cell">最大类别</div>
            <div class="insight-table-cell">最大类别数量</div>
            <div class="insight-table-cell">最小类别</div>
            <div class="insight-table-cell">最小类别数量</div>
            <div class="insight-table-cell">数量平均值</div>
            <div class="insight-table-cell">数量标准差</div>
          </div>
          <div class="insight-table-row"
            v-for="(tableInfo, index) in info.cTable"
            :key="index"
          >
            <div class="insight-table-cell">{{ tableInfo.name }}</div>
            <div class="insight-table-cell">{{ tableInfo.total }}</div>
            <div class="insight-table-cell">{{ tableInfo.max }}</div>
            <div class="insight-table-cell">{{ tableInfo.max_n }}</div>
            <div class="insight-table-cell">{{ tableInfo.min }}</div>
            <div class="insight-table-cell">{{ tableInfo.min_n }}</div>
            <div class="insight-table-cell">{{ tableInfo.avg }}</div>
            <div class="insight-table-cell">{{ tableInfo.sd }}</div>
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
      default () {
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
  .insight-table-list {
    margin-bottom: 16px;
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

  .insight-table-cell {
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
    &:nth-child(7) {
      width: 10.66%;
    }
    &:last-child {
      flex: 1;
    }
  }
}
</style>
