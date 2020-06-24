<template>
  <div class="insights-info root-cause">
    <div class="insights-info-title">{{ $t('resultDescription.dataInsight') }}</div>
    <el-tabs
      v-if="info.rootCause.length > 0"
      v-model="activeTab"
    >
      <el-tab-pane
        v-for="(rootCauseInfo, index) in rootCauseInfoList"
        :key="index"
        :label="rootCauseInfo.name"
        :name="rootCauseInfo.name"
      >
        <div
          :class="{'is-open': isShowChatRoom}"
          class="root-cause-container"
        >
          <div
            v-for="(tableInfo, contentIndex) in rootCauseInfo.content"
            :key="index +'-'+ contentIndex"
            :class="{'in-pinboard': inPinboard}"
            class="root-cause-card"
            @click="drillDown(tableInfo.link.question)"
          >
            <div class="abstract-info">
              <el-tooltip
                :content="tableInfo.columnName + tableInfo.columnValue"
              >
                <div class="column-title">{{ tableInfo.columnName }}{{ tableInfo.columnValue }}</div>
              </el-tooltip>
              <div class="sub-title">
                <span class="sub-title__text">{{ rootCauseInfo.name }}</span>
                <span class="sub-title__text">{{ tableInfo.diffAverageRate > 0 ? $t('resultDescription.higher') : $t('resultDescription.lower') }}</span>
                <span class="sub-title__text">{{ $t('aggregatedValue.mean') }}</span>
              </div>
              <div
                :class="{'is-special': tableInfo.unusual}"
                class="amount-block"
              >
                <div class="count">{{ Math.abs(tableInfo.diffAverageRate) + '%' }}</div>
                <div
                  v-show="tableInfo.unusual"
                  class="hight-light-label"
                >{{ $t('resultDescription.keyInsight') }}</div>
              </div>
            </div>
            <div class="detail-info">
              <div class="detail-info__list">
                <p 
                  class="detail-info__list__item" 
                  v-html="$t('resultDescription.totalColumnAverage', {
                    name: rootCauseInfo.name,
                    value: tableInfo.totalAverage
                })"/>
                <p 
                  class="detail-info__list__item" 
                  v-html="$t('resultDescription.compareToAverage', {
                    name: tableInfo.columnName + tableInfo.columnValue,
                    compare: tableInfo.diffAverageRate > 0 ? $t('resultDescription.higher') : $t('resultDescription.lower'),
                    percentage: Math.abs(tableInfo.diffAverageRate)
                })"/>
              </div>
              <div class="info-block">
                <div class="single-info">
                  <div class="info-label">{{ $t('resultDescription.dataRowCount') }}</div>
                  <div class="info-content">{{ tableInfo.count }}</div>
                </div>
                <div class="single-info">
                  <div class="info-label">{{ $t('resultDescription.totalPercentage') }}</div>
                  <div class="info-content">{{ tableInfo.percent }}</div>
                </div>
                <div class="single-info">
                  <div class="info-label">{{ $t('aggregatedValue.mean') }}</div>
                  <div class="info-content">{{ tableInfo.average }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <no-result
      v-else
    />
  </div>
</template>
<script>
export default {
  name: 'RootCauseInfo',
  props: {
    info: {
      type: Object,
      default () {
        return {
          rootCause: []
        }
      }
    }
  },
  data () {
    return {
      activeTab: null
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
    },
    inPinboard () {
      return this.$route.name === 'PagePinboard'
    }
  },
  mounted () {
    if (this.info.rootCause.length > 0) {
      this.activeTab = this.info.rootCause[0].name
    }
  },
  methods: {
    drillDown (question) {
      if (this.inPinboard) return
      this.$store.commit('dataSource/setAppQuestion', question)
      this.$store.dispatch('dataSource/updateResultRouter', this.$route.name === 'PageResult' ? 'click_rootcause' : 'click_rootcause_pinboard')
    }
  },
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

        &:not(:last-child) {
          margin-bottom: 24px;
        }

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
    padding: 24px 0;
    width: 48%;
    cursor: pointer;
    @include card();

    &.in-pinboard {
      &:hover {
        transform: none;
        cursor: initial;
      }
    }

    &:not(:last-child) {
      margin-bottom: 24px;
    }

    &:nth-last-child(2) {
      margin-bottom: 0;
    }

    .abstract-info {
      text-align: center;
      border-right: 1px solid  #2E2E2E;
      padding: 0 24px;
      width: 32%;

      .column-title {
        @include text-hidden
      }

      .sub-title {
        font-size: 14px;
        line-height: 26px;
        margin-bottom: 6px;
        display: flex;
        justify-content: center;
        [lang="en"] & {
          &__text:not(:last-child) {
            margin-right: 4px;
          }
        }
      }
      .amount-block {
        color: $theme-color-primary;

        &.is-special {
          color: $theme-color-warning;
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
        color: $theme-color-warning;
        border: 1px solid $theme-color-warning;
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

      .detail-info__list {
        margin-bottom: 14px;
        &__item {
          margin: 0;
          display: flex;
          &::before {
            content: '-';
            margin-right: 8px;
            & + .name {
              padding-left: 0;
            }
          }
          >>> .name {
            padding: 0 8px;
            color: $theme-color-warning;
          }
        }
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
}
</style>
