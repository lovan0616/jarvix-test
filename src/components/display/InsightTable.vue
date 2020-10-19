<template>
  <div
    v-if="!isEmpty"
    class="insights-info basic-insights"
  >
    <el-tabs
      v-model="activeTab"
    >
      <el-tab-pane
        v-for="(singleBasicInfo, index) in basicInfo"
        :key="index"
        :label="singleBasicInfo.name"
        :name="singleBasicInfo.name"
      >
        <div
          v-if="checkProperty(singleBasicInfo, 'sum')"
          class="insight-vertical-table"
        >
          <div 
            v-if="checkProperty(singleBasicInfo, 'sum')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.sum') }}</div>
            <div class="insight-table-content">{{ formatComma(singleBasicInfo.sum) }}</div>
          </div>
          <div 
            v-if="checkProperty(singleBasicInfo, 'count')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.count') }}</div>
            <div class="insight-table-content">{{ formatComma(singleBasicInfo.count) }}</div>
          </div>
          <div 
            v-if="checkProperty(singleBasicInfo, 'max')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.max') }}</div>
            <div class="insight-table-content">{{ formatComma(singleBasicInfo.max) }}</div>
          </div>
          <div 
            v-if="checkProperty(singleBasicInfo, 'min')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.min') }}</div>
            <div class="insight-table-content">{{ formatComma(singleBasicInfo.min) }}</div>
          </div>
          <div 
            v-if="checkProperty(singleBasicInfo, 'avg')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.mean') }}</div>
            <div class="insight-table-content">{{ formatComma(singleBasicInfo.avg) }}</div>
          </div>
          <div 
            v-if="checkProperty(singleBasicInfo, 'sd')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.std') }}</div>
            <div class="insight-table-content">{{ formatComma(singleBasicInfo.sd) }}</div>
          </div>
          <div 
            v-if="checkProperty(singleBasicInfo, 'comment')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.note') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.comment }}</div>
          </div>
        </div>
        <div
          v-else
          class="insight-vertical-table"
        >
          <div 
            v-if="checkProperty(singleBasicInfo, 'total')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.count') }}</div>
            <div class="insight-table-content">{{ formatComma(singleBasicInfo.total) }}</div>
          </div>
          <div 
            v-if="checkProperty(singleBasicInfo, 'max')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.maxCategory') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.max }}</div>
          </div>
          <div 
            v-if="checkProperty(singleBasicInfo, 'max_n')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.maxCategoryCount') }}</div>
            <div class="insight-table-content">{{ formatComma(singleBasicInfo.max_n) }}</div>
          </div>
          <div 
            v-if="checkProperty(singleBasicInfo, 'min')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.minCategory') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.min }}</div>
          </div>
          <div 
            v-if="checkProperty(singleBasicInfo, 'min_n')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.minCategoryCount') }}</div>
            <div class="insight-table-content">{{ formatComma(singleBasicInfo.min_n) }}</div>
          </div>
          <div 
            v-if="checkProperty(singleBasicInfo, 'avg')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.countMean') }}</div>
            <div class="insight-table-content">{{ formatComma(singleBasicInfo.avg) }}</div>
          </div>
          <div 
            v-if="checkProperty(singleBasicInfo, 'sd')"
            class="insight-table-row"
          >
            <div class="insight-table-head">{{ $t('aggregatedValue.countStd') }}</div>
            <div class="insight-table-content">{{ formatComma(singleBasicInfo.sd) }}</div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="insights-info-block">
      <div
        v-for="(commentInfo, index) in info.nComment"
        :key="index"
        class="insights-info-text"
      >{{ commentInfo }}</div>
      <div
        v-for="(commentInfo, index) in info.cComment"
        :key="index"
        class="insights-info-text"
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
      activeTab: null,
      isEmpty: this.info && this.info.cTable.length === 0 && this.info.nTable.length === 0
    }
  },
  mounted () {
    this.basicInfo = this.info.nTable.concat(this.info.cTable)
    if (this.basicInfo.length > 0) this.activeTab = this.basicInfo[0].name
    this.$store.commit('chatBot/updateHasBasicInfo', !this.isEmpty)
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
    line-height: 20px;
  }

  .insight-table-row {
    display: flex;
    flex-wrap: wrap;

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }

  .insight-table-head {
    width: 32%;
    font-weight: bold;
  }

  .insight-table-content {
    flex: 1;
    padding-left: 8px;
  }
}
</style>
