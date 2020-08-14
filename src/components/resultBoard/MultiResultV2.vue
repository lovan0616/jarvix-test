<template>
  <div class="multi-result">
    <div class="board-title">{{ $t('editing.multiResultTitle') }}</div>
    <div class="board-description">{{ $t('bot.multiplePossibilities') }}</div>
    <div class="question-list">
      <div 
        v-for="(singleQuestion, index) in resultInfo.segmentationList"
        :key="index"
        class="question-block"
      >
        <div
          class="single-question"
          @click="askQuestion(singleQuestion)"
        >
          <question-name-v2
            :question-segmentation="singleQuestion"
          />
          <svg-icon 
            icon-class="go-right" 
            class="arrow-icon"/>
        </div>
        <div class="segmentation-info-block">
          <div 
            v-for="(segmentation, segmentationIndex) in singleQuestion.sentence"
            :key="index + '-' + segmentationIndex"
            class="single-segmentation"
          >
            <template
              v-if="displayStatusList[segmentationIndex]"
            >
              <template
                v-if="segmentation.properties"
              >
                <span 
                  :class="segmentation.type"
                  class="column-name"
                >[{{ segmentation.word }}]</span>{{ $t('resultDescription.from') }}
                <span class="alias-name">{{ segmentation.properties[0].dataFramePrimaryAlias }}</span>{{ $t('resultDescription.has') }}
                <span
                  v-if="segmentation.type === 'DATA_VALUE'"
                >
                  <span class="alias-name">{{ segmentation.properties[0].dataColumnPrimaryAlias }}</span>{{ $t('resultDescription.has') }}{{ $t(`segmentationToken.${segmentation.type}`) }}{{ $t(`resultDescription.recognize`) }}
                </span>
                <span
                  v-else-if="segmentation.type === 'DATA_COLUMN'"
                >
                  <span class="alias-name">{{ segmentation.properties[0].dataColumnPrimaryAlias }}<span v-if="segmentation.properties[0].isFeature">({{ $t('resultDescription.feature') }})</span></span>{{ $t(`segmentationToken.${segmentation.type}`) }}{{ $t(`resultDescription.recognize`) }}
                </span>
                <span
                  v-else-if="segmentation.type === 'NumRuleToken'"
                >
                  <template
                    v-if="segmentation.properties"
                  >
                    <span class="alias-name">{{ segmentation.properties[0].dataColumnPrimaryAlias }}</span>{{ $t(`segmentationToken.${segmentation.type}`) }}{{ $t(`resultDescription.recognize`) }}
                  </template>
                  <template v-else>
                    {{ $t(`segmentationToken.${segmentation.type}`) }}
                  </template>
                </span>
                <span
                  v-else-if="segmentation.type === 'DATA_ROW'"
                >
                  {{ $t(`segmentationToken.${segmentation.type}`) }}
                </span>
                <el-tooltip 
                  v-if="segmentation.properties && segmentation.properties.length > 1"
                  :tabindex="999"
                  placement="bottom"
                >
                  <div slot="content">
                    <span>{{ $t('resultDescription.hasColumn') }}</span>
                    <span
                      v-for="(property, propertyIndex) in segmentation.properties"
                      :key="propertyIndex"
                    >{{ property.dataColumnPrimaryAlias }}<span v-show="propertyIndex < segmentation.properties.length - 1">、</span></span>
                  </div>
                  <b class="question-token">'{{ segmentation.matchedWord }}'</b>
                </el-tooltip>
                <b>'{{ segmentation.matchedWord }}'</b>
              </template>
              <template
                v-else-if="isIntend(segmentation.type)"
              >
                <div>
                  <span 
                    :class="{intend: isIntend(segmentation.type)}"
                    class="column-name"
                  >[{{ segmentation.word }}]</span>{{ $t(`segmentationToken.${segmentation.type}`) }}
                </div>
              </template>
              <template
                v-else-if="isMeaningFul(segmentation.type)"
              >
                <span 
                  :class="segmentation.type"
                  class="column-name"
                >[{{ segmentation.word }}]</span>{{ $t(`segmentationToken.${segmentation.type}`) }}
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QuestionNameV2 from './QuestionNameV2'

export default {
  name: 'MultiResultV2',
  components: {
    QuestionNameV2
  },
  props: {
    resultInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    // 哪些 segmentation 需要顯示
    displayStatusList () {
      let standard = this.resultInfo.segmentationList[0].sentence
      let statusList = []
      for (let i = 0; i < standard.length; i++) {
        statusList.push(false)
      }

      this.resultInfo.segmentationList.forEach(element => {
        element.sentence.forEach((segmentationElement, index) => {
          if (segmentationElement.type === standard[index].type) {
            switch (segmentationElement.type) {
              case 'DATA_VALUE':
                if (segmentationElement.dataFramePrimaryAlias !== standard[index].dataFramePrimaryAlias ||
                  segmentationElement.dataColumnPrimaryAlias !== standard[index].dataColumnPrimaryAlias) {
                  statusList[index] = true
                }
                break
              case 'DATA_COLUMN':
                if (segmentationElement.dataFramePrimaryAlias !== standard[index].dataFramePrimaryAlias ||
                  segmentationElement.dataColumnPrimaryAlias !== standard[index].dataColumnPrimaryAlias ||
                  segmentationElement.dataColumnId !== standard[index].dataColumnId) {
                  statusList[index] = true
                }
                break
              case 'DATA_ROW':
                if (segmentationElement.dataFramePrimaryAlias !== standard[index].dataFramePrimaryAlias) {
                  statusList[index] = true
                }
                break
              default:
                if (segmentationElement.matchedWord !== standard[index].matchedWord) {
                  statusList[index] = true
                }
            }
          } else {
            statusList[index] = true
          }
        })
      })
      return statusList
    }
  },
  methods: {
    askQuestion (questionInfo) {
      this.$store.commit('dataSource/setAppQuestion', this.resultInfo.question)
      this.$store.commit('dataSource/setCurrentQuestionInfo', questionInfo)
      this.$store.dispatch('dataSource/updateResultRouter', 'key_in')
    },
    isMeaningFul (value) {
      switch (value) {
        case 'IgnoreToken':
        case 'PossessionToken':
        case 'ConjunctionToken':
          return false
        default:
          return true
      }
    },
    isIntend (value) {
      switch (value) {
        case 'IntroductionToken':
        case 'GenericToken':
        case 'ComparisonToken':
        case 'TrendToken':
        case 'PredictionToken':
        case 'RootCauseToken':
        case 'PivotTableToken':
        case 'ProportionToken':
        case 'CorrelationToken':
        case 'CorrExplorationToken':
        case 'CorrVerificationToken':
        case 'DiffExplorationToken':
          return true
        default:
          return false
      }
    },
    tooltipContent (tokenInfo) {
      switch (tokenInfo.type) {
        case 'DATA_VALUE':
        case 'DATA_COLUMN':
        case 'DATA_ROW':
          return this.$t('resultDescription.recognizeTo', {dataFrame: tokenInfo.properties[0].dataFramePrimaryAlias, token: this.$t(`segmentationToken.${this.tokenInfo.type}`)}) + tokenInfo.matchedWord
        default:
          return this.$t(`segmentationToken.${this.tokenInfo.type}`)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.multi-result {
  padding: 16px 24px 24px;
  background-color: var(--color-bg-5);
  border-radius: 8px;

  .board-title {
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 4px;
  }

  .board-description {
    line-height: 24px;
    margin-bottom: 24px;
  }

  .question-block {
    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }

  .single-question {
    position: relative;
    padding: 16px;
    background: rgba(35, 61, 64, 0.6);
    border: 1px solid #065D68;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: 8px;

    &:hover {
      transform: translate3d(0,-5px,0);
      box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.12);
    }

    .arrow-icon {
      position: absolute;
      right: 16px;
      top: 0;
      bottom: 0;
      margin: auto;
      animation: arrowRight 1s infinite;

      @keyframes arrowRight {
        0%{
          transform: translateX(0);
        }
        50%{
          transform: translateX(5px);
        }
        100%{
          transform: translateX(0);
        }
      }
    }
  }
  .single-segmentation {
    font-size: 14px;
    line-height: 26px;

    .column-name {
      color: #ddd;
      margin-right: 8px;

      &.filter {
        color: #FF9559;
      }

      &.DATA_COLUMN {
        color: #44D2FF;
      }
      &.numeric {
        color: #CA66DA;
      }
      &.DATA_VALUE {
        color: #CA66DA;
      }
      &.DtToken, &.FuzzyDtToken, &.TimeScope, &.NumRuleToken {
        color: #FF9559;
      }
      &.intend {
        color: #07E8B2;
      }
    }

    .question-token {
      text-decoration: underline;
    }

    .alias-name {
      display: inline-block;
      font-weight: bold;
      margin: 0 8px;
    }
  }
}
</style>
