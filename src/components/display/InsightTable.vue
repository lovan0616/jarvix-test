<template>
  <div class="insights-info basic-insights">
    <el-tabs
      v-model="activeTab"
    >
      <el-tab-pane
        v-for="(singleBasicInfo, index) in basicInfo"
        :key="index"
        :label="singleBasicInfo.name"
        :name="singleBasicInfo.name"
      >
        <div class="insight-vertical-table"
          v-if="singleBasicInfo['sum']"
        >
          <div class="insight-table-row">
            <div class="insight-table-head">总和</div>
            <div class="insight-table-content">{{ singleBasicInfo.sum }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">总数量</div>
            <div class="insight-table-content">{{ singleBasicInfo.count }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">最大数值</div>
            <div class="insight-table-content">{{ singleBasicInfo.max }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">最小数值</div>
            <div class="insight-table-content">{{ singleBasicInfo.min }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">平均值</div>
            <div class="insight-table-content">{{ singleBasicInfo.avg }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">标准差</div>
            <div class="insight-table-content">{{ singleBasicInfo.sd }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">备注</div>
            <div class="insight-table-content">{{ singleBasicInfo.comment }}</div>
          </div>
        </div>
        <div class="insight-vertical-table"
          v-else
        >
          <div class="insight-table-row">
            <div class="insight-table-head">总数量</div>
            <div class="insight-table-content">{{ singleBasicInfo.total }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">最大类别</div>
            <div class="insight-table-content">{{ singleBasicInfo.max }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">最大类别数量</div>
            <div class="insight-table-content">{{ singleBasicInfo.max_n }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">最小类别</div>
            <div class="insight-table-content">{{ singleBasicInfo.min }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">最小类别数量</div>
            <div class="insight-table-content">{{ singleBasicInfo.min_n }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">数量平均值</div>
            <div class="insight-table-content">{{ singleBasicInfo.avg }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">数量标准差</div>
            <div class="insight-table-content">{{ singleBasicInfo.sd }}</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="insights-info-block">
      <div class="insights-info-text"
        v-for="(commentInfo, index) in info.nComment"
        :key="index"
      >{{ commentInfo }}</div>
      <div class="insights-info-text"
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
  },
  data () {
    return {
      basicInfo: [],
      activeTab: null
    }
  },
  mounted () {
    this.basicInfo = this.info.nTable.concat(this.info.cTable)
    this.activeTab = this.basicInfo[0].name
  }
}
</script>
<style lang="scss" scoped>
.basic-insights.insights-info {
  .insights-info-text {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
    color: #eddb45;
    padding: 12px 0;
  }

  .insight-vertical-table {
    font-size: 14px;
    line-height: 26px;
  }

  .insight-table-row {
    display: flex;
    flex-wrap: wrap;

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }

  .insight-table-head {
    width: 32%;
    font-weight: bold;
  }

  .insight-table-content {
    flex: 1;
  }
}
</style>
