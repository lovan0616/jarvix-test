<template>
  <div class="insights-info root-cause">
    <div class="insights-info-title">资料洞察</div>
    <el-tabs
      v-if="this.info.rootCause.length > 0"
      v-model="activeTab"
      type="card"
    >
      <el-tab-pane
        v-for="(rootCauseInfo, index) in rootCauseInfoList"
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
              <div class="insight-table-cell">
                <a class="drill-down-link"
                  href="javascript:void(0)"
                  v-if="tableInfo.link"
                  @click="drillDown(tableInfo.link.question)"
                >{{ tableInfo.columnValue }}</a>
                <span v-else>{{ tableInfo.columnValue }}</span>
              </div>
              <div class="insight-table-cell">{{ tableInfo.count }}</div>
              <div class="insight-table-cell">{{ tableInfo.percent }}</div>
              <div class="insight-table-cell">{{ tableInfo.average }}</div>
              <div class="insight-table-cell"
                :class="{active: tableInfo.unusual}"
              >{{ tableInfo.remark }}</div>
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
    }
  }
}
</script>
<style lang="scss" scoped>
.insights-info.root-cause {
  margin-bottom: 48px;

  .insights-info-block {

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
        width: 15%;
      }
      &:nth-child(2) {
        width: 15%;
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

      &.active {
        color: $theme-color-primary;
      }
    }

    .drill-down-link {
      color: $theme-color-primary;
      text-decoration: underline;
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
<style lang="scss">
.insights-info.root-cause {
  .el-tabs__header {
    margin-bottom: 8px;
  }
  .el-tabs--card>.el-tabs__header {
    border: none;

    .el-tabs__nav {
      border: none;
    }
  }

  .el-tabs--top.el-tabs--card .el-tabs__item {
    &:last-child {
      padding-right: 30px;
    }
    &:nth-child(2) {
      padding-left: 30px;
    }
  }

  .el-tabs__item {
    padding: 0 30px;
    border: none;
    transition: border 0.3s;
    color: #ddd;
    text-transform: uppercase;
    font-weight: bold;

    &:hover, &.is-active {
      color: $theme-text-color;
    }

    &.is-active {
      border-bottom: 2px solid $theme-text-color;
    }
  }
}
</style>
