<template>
  <div
    v-if="info.rootCause.length > 0"
    class="insights-info root-cause"
  >
    <div class="insights-info-title">
      {{ $t('resultDescription.dataInsight') }}
    </div>
    <el-tabs
      v-model="activeTab"
    >
      <el-tab-pane
        v-for="(rootCauseInfo, index) in rootCauseInfoList"
        :key="index"
        :label="rootCauseInfo.name"
        :name="rootCauseInfo.name"
      >
        <div
          :class="{ 'is-open': isShowSettingBox }"
          class="root-cause-container"
        >
          <div
            v-for="(tableInfo, contentIndex) in rootCauseInfo.content"
            :key="index +'-'+ contentIndex"
            :class="{ 'in-pinboard': inPinboard, 'is-special': tableInfo.unusual }"
            class="root-cause-card"
            @click="drillDown(tableInfo.link.question)"
          >
            <div class="abstract-info">
              <el-tooltip
                :content="tableInfo.columnValue"
              >
                <div class="column-title">
                  {{ tableInfo.columnValue }}
                </div>
              </el-tooltip>
              <div class="sub-title">
                <span class="sub-title__text">{{ rootCauseInfo.name }}</span>
                <span class="sub-title__text">{{ tableInfo.diffAverageRate > 0 ? $t('resultDescription.higher') : $t('resultDescription.lower') }}</span>
                <span class="sub-title__text">{{ $t('aggregatedValue.mean').toLowerCase() }}</span>
              </div>
              <div class="amount-block">
                <div class="count">
                  {{ Math.abs(tableInfo.diffAverageRate) + '%' }}
                </div>
                <div
                  v-show="tableInfo.unusual"
                  class="hight-light-label"
                >
                  {{ $t('resultDescription.keyInsight') }}
                </div>
              </div>
            </div>
            <div class="detail-info">
              <div class="detail-info__list">
                <i18n
                  path="resultDescription.totalColumnAverage"
                  tag="pre"
                  class="detail-info__list__item"
                >
                  <span class="text name">{{ rootCauseInfo.name }}</span>
                  <span class="text">{{ tableInfo.totalAverage }}</span>
                </i18n>
                <i18n
                  path="resultDescription.compareToAverage"
                  tag="pre"
                  class="detail-info__list__item"
                >
                  <span class="text name">[{{ tableInfo.columnName }}] {{ tableInfo.columnValue }} </span>
                  <span class="text percentage">{{ Math.abs(tableInfo.diffAverageRate) + '%' }}</span>
                  <span class="text">{{ tableInfo.diffAverageRate > 0 ? $t('resultDescription.higher') : $t('resultDescription.lower') }}</span>
                </i18n>
              </div>
              <div class="info-block">
                <div class="single-info">
                  <div class="info-label">
                    {{ $t('resultDescription.dataRowCount') }}
                  </div>
                  <div class="info-content">
                    {{ tableInfo.count }}
                  </div>
                </div>
                <div class="single-info">
                  <div class="info-label">
                    {{ $t('resultDescription.totalPercentage') }}
                  </div>
                  <div class="info-content">
                    {{ tableInfo.percent || '-' }}
                  </div>
                </div>
                <div class="single-info">
                  <div class="info-label">
                    {{ $t('aggregatedValue.mean') }}
                  </div>
                  <div class="info-content">
                    {{ tableInfo.average }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox']),
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
    inPinboard () {
      return this.$route.name === 'PersonalPagePinboard' || this.$route.name === 'ProjectPagePinboard'
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
  }
}
</script>

<style lang="scss" scoped>
.insights-info.root-cause {
  .root-cause-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;

    &.is-open {
      .root-cause-card {
        width: 100%;
        flex-basis: unset;

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
    flex-basis: calc(50% - 10px);
    cursor: pointer;
    @include card();

    &.in-pinboard {
      &:hover {
        transform: none;
        cursor: initial;
      }
    }
    &.is-special {
      .amount-block {
        color: $theme-color-warning;
      }
      .detail-info .detail-info__list .detail-info__list__item {
        .name {
          color: $theme-color-warning;
        }
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
        @include text-hidden;
        margin-bottom: 4px;
      }

      .sub-title {
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 6px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        [lang="en"] & {
          &__text:not(:last-child) {
            margin-right: 4px;
          }
        }
      }
      .amount-block {
        color: $theme-color-primary;
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
          flex-wrap: wrap;
          // 為了保留空白而使用 <pre> 這邊必須把字型再蓋回來
          font-family: $theme-font-family-default;
          word-break: break-word;
          &::before {
            content: '-';
            margin-right: 8px;
          }
          .name {
            color: $theme-color-primary;
          }
          .percentage {
            padding-right: 8px;
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
