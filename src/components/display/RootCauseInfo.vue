<template>
  <div class="insights-info root-cause">
    <div class="insighs-info-title">资料洞察</div>
    <el-tabs
      v-model="activeTab"
    >
      <el-tab-pane
        v-for="(rootCauseInfo, index) in info.rootCause"
        :key="index"
        :label="rootCauseInfo.name"
        :name="rootCauseInfo.name"
      >
        <div class="insights-info-block">
          <div class="insight-table">
            <div class="insight-table-row table-head">
              <div class="insight-table-cell">筛选栏位</div>
              <div class="insight-table-cell">筛选数值</div>
              <div class="insight-table-cell">资料笔数</div>
              <div class="insight-table-cell">总占比</div>
              <div class="insight-table-cell">平均值</div>
              <div class="insight-table-cell">备注</div>
            </div>
            <div class="insight-table-row"
              v-for="(tableInfo, contentIndex) in rootCauseInfo.content"
              :key="index +'-'+ contentIndex"
            >
              <div class="insight-table-cell">{{ tableInfo.columnName }}</div>
              <div class="insight-table-cell">{{ tableInfo.columnValue }}</div>
              <div class="insight-table-cell">{{ tableInfo.count }}</div>
              <div class="insight-table-cell">{{ tableInfo.percent }}</div>
              <div class="insight-table-cell">{{ tableInfo.average }}</div>
              <div class="insight-table-cell remark">{{ tableInfo.remark }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: 'RootCauseInfo',
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      activeTab: null
    }
  },
  mounted () {
    this.activeTab = this.info.rootCause[0].name
  }
}
</script>
<style lang="scss" scoped>
.insights-info.root-cause {
  .insights-info-block {
    padding: 15px 20px;

    .insight-info {
      display: flex;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.05em;

      .dot {
        flex: initial;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        border: 1px solid $theme-color-primary;
        margin-top: 6px;
        margin-right: 10px;
      }

      .insight-text {
        flex: 1;
      }

      &:not(:last-child) {
        margin-bottom: 8px;
      }
    }

    .insight-table-cell {
      &:first-child {
        width: 10.42%;
      }
      &:nth-child(2) {
        width: 9.48%;
      }
      &:nth-child(3) {
        width: 9.87%;
      }
      &:nth-child(4) {
        width: 10%;
      }
      &:nth-child(5) {
        width: 9.79%;
      }
      &:last-child {
        flex: 1;
      }

      &.remark {
        color: #42A5B3;
      }
    }
  }
}
</style>
<style lang="scss">
.insights-info.root-cause {
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__active-bar {
    background-color: #43BAC3;
  }
  .el-tabs__item.is-active {
    color: #43BAC3;
  }
}
</style>
