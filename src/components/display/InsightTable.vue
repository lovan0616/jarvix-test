<template>
  <div class="insights-info basic-insights"
    v-if="!isEmpty"
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
        <div class="insight-vertical-table"
          v-if="singleBasicInfo['sum']"
        >
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.sum') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.sum }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.count') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.count }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.max') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.max }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.min') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.min }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.mean') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.avg }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.std') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.sd }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.note') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.comment }}</div>
          </div>
        </div>
        <div class="insight-vertical-table"
          v-else
        >
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.count') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.total }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.maxCategory') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.max }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.maxCategoryCount') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.max_n }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.minCategory') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.min }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.minCategoryCount') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.min_n }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.countMean') }}</div>
            <div class="insight-table-content">{{ singleBasicInfo.avg }}</div>
          </div>
          <div class="insight-table-row">
            <div class="insight-table-head">{{ $t('aggregatedValue.countStd') }}</div>
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
  <empty-info-block
    v-else
  ></empty-info-block>
</template>
<script>
import EmptyInfoBlock from '@/components/EmptyInfoBlock'

export default {
  name: 'InsightTable',
  components: {
    EmptyInfoBlock
  },
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
  },
  computed: {
    isEmpty () {
      return this.info &&
        this.info.cComment.length === 0 &&
        this.info.nComment.length === 0 &&
        this.info.cTable.length === 0 &&
        this.info.nTable.length === 0
    }
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
