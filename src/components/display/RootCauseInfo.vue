<template>
  <div class="insights-info root-cause">
    <div class="insights-info-title">资料洞察</div>
    <el-tabs
      v-if="this.info.rootCause.length > 0"
      v-model="activeTab"
    >
      <el-tab-pane
        v-for="(rootCauseInfo, index) in rootCauseInfoList"
        :key="index"
        :label="rootCauseInfo.name"
        :name="rootCauseInfo.name"
      >
        <div class="root-cause-container"
          :class="{'is-open': isShowChatRoom}"
        >
          <div class="root-cause-card"
            v-for="(tableInfo, contentIndex) in rootCauseInfo.content"
            :key="index +'-'+ contentIndex"
            @click="drillDown(tableInfo.link.question)"
          >
            <div class="abstract-info">
              <div class="column-title">{{ tableInfo.columnName }}的{{ tableInfo.columnValue }}</div>
              <div class="sub-title">{{ rootCauseInfo.name }}{{ tableInfo.diffAverageRate > 0 ? '高于' : '低于' }}平均值</div>
              <div class="amount-block"
                :class="{'is-special': tableInfo.unusual}"
              >
                <div class="count">{{ Math.abs(tableInfo.diffAverageRate) + '%' }}</div>
                <div class="hight-light-label"
                  v-show="tableInfo.unusual"
                >关键洞察</div>
              </div>
            </div>
            <div class="detail-info">
              <div class="title">整体{{ rootCauseInfo.name }}平均值为{{ tableInfo.totalAverage }}，<span class="column-name">{{ tableInfo.columnName }}的{{ tableInfo.columnValue }}</span>{{ tableInfo.diffAverageRate > 0 ? '高于' : '低于' }}平均值{{ Math.abs(tableInfo.diffAverageRate) + '%' }}</div>
              <div class="info-block">
                <div class="single-info">
                  <div class="info-label">资料笔数</div>
                  <div class="info-content">{{ tableInfo.count }}</div>
                </div>
                <div class="single-info">
                  <div class="info-label">总占比</div>
                  <div class="info-content">{{ tableInfo.percent }}</div>
                </div>
                <div class="single-info">
                  <div class="info-label">平均值</div>
                  <div class="info-content">{{ tableInfo.average }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="empty-info"
      v-else
    >目前暂无相关资讯</div>
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
    if (this.info.rootCause.length > 0) {
      this.activeTab = this.info.rootCause[0].name
    }
  },
  methods: {
    drillDown (question) {
      this.$store.commit('bookmark/setAppQuestion', question)
      this.$store.dispatch('bookmark/updateResultRouter')
    }
  },
  computed: {
    // 遇到同名稱的 column 就將其合併
    rootCauseInfoList () {
      let info = []
      this.info.rootCause.forEach(rootCauseInfo => {
        let hasProperty = false
        for (let i = 0; i < info.length; i++) {
          if (info[i].name === rootCauseInfo.name) {
            hasProperty = true
            info[i].content = info[i].content.concat(rootCauseInfo.content)
          }
        }
        if (!hasProperty) {
          info.push(rootCauseInfo)
        }
      })
      return info
    },
    isShowChatRoom () {
      return this.$store.state.isShowChatRoom
    }
  }
}
</script>
<style lang="scss" scoped>
.insights-info.root-cause {
  .root-cause-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &.is-open {
      .root-cause-card {
        width: 100%;

        .abstract-info {
          width: 25%;
        }

        .info-block {
          justify-content: flex-start;
        }
        .single-info  {
          margin-right: 32px;
        }
      }
    }
  }

  .root-cause-card {
    display: flex;
    background-color: rgba(0, 0, 0, 0.35);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    padding: 24px 0;
    margin-bottom: 24px;
    width: 48%;
    cursor: pointer;

    .abstract-info {
      text-align: center;
      border-right: 1px solid  #2E2E2E;
      padding: 0 24px;
      width: 32%;

      .sub-title {
        font-size: 14px;
        line-height: 26px;
        margin-bottom: 6px;
      }
      .amount-block {
        color: #4DE2F0;

        &.is-special {
          color: #FFDF6F;
        }
      }
      .count {
        font-size: 30px;
        line-height: 1;
        margin-bottom: 10px;
      }
      .hight-light-label {
        display: inline-block;
        font-size: 12px;
        line-height: 1;
        color: #FFDF6F;
        border: 1px solid #FFDF6F;
        border-radius: 4px;
        padding: 6px 6px;
      }
    }

    .column-name {
      text-decoration: underline;
    }

    .detail-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 0 24px;
      flex: 1;

      .title {
        margin-bottom: 14px;
      }
    }
    .info-block {
      display: flex;
      justify-content: space-between;
    }
    .single-info {
      .info-label {
        font-size: 14px;
        line-height: 26px;
        color: #A7A7A7;
      }
      .info-contnet {
        font-size: 18px;
        line-height: 26px;
      }
    }
  }

  .empty-info {
    padding: 15px 20px;
    background-color: $theme-bg-darker-color;
    color: #fff;
    text-align: center;
  }
}
</style>
