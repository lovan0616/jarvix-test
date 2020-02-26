<template>
  <div class="multi-result">
    <div class="board-title">{{ $t('editing.multiResultTitle') }}</div>
    <!-- <div class="board-description"
      v-if="resultInfo.similarQuestionList"
    >{{ $t('bot.similarQuestionDescription') }}</div> -->
    <div class="board-description">{{ $t('bot.multiplePossibilities') }}</div>
    <div class="question-list">
      <div class="question-block"
        v-for="(singleQuestion, index) in resultInfo.parseQuestionPayload.segmentations"
        :key="index"
      >
        <div class="single-question"
          @click="askQuestion(singleQuestion)"
        >
          <question-name
            :question="singleQuestion.question"
            :question-segmentation="singleQuestion.segmentation"
          ></question-name>
        </div>
        <div class="segmentation-info-block">
          <div class="single-segmentation"
            v-for="(segmentation, segmentationIndex) in singleQuestion.segmentation"
            :key="index + '-' + segmentationIndex"
          >
            <template
              v-if="displayStatusList[segmentationIndex]"
            >
              <template
                v-if="segmentation.properties"
              >
                <span class="column-name"
                  :class="segmentation.type"
                >[{{ segmentation.word }}]</span>{{ $t('resultDescription.from')}}
                <span class="alias-name">{{segmentation.properties[0].dataframePrimaryAlias}}</span>{{ $t('resultDescription.has')}}
                <span
                  v-if="segmentation.type === 'Datavalue'"
                >
                  <span class="alias-name">{{segmentation.properties[0].datacolumnPrimaryAlias}}</span>{{ $t('resultDescription.has')}}{{ $t(`segmentationToken.${segmentation.type}`) }}{{ $t(`resultDescription.recognize`) }}
                </span>
                <span
                  v-else-if="segmentation.type === 'Datacolumn'"
                >
                  <span class="alias-name">{{segmentation.properties[0].datacolumnPrimaryAlias}}</span>{{ $t(`segmentationToken.${segmentation.type}`) }}{{ $t(`resultDescription.recognize`) }}
                </span>
                <span
                  v-else-if="segmentation.type === 'Datarow'"
                >
                  {{ $t(`segmentationToken.${segmentation.type}`) }}
                </span>
                <el-tooltip placement="bottom"
                  v-if="segmentation.properties && segmentation.properties.length > 1"
                  :tabindex="999"
                >
                  <div slot="content">
                    <span>{{ $t('resultDescription.hasColumn') }}</span>
                    <span
                      v-for="(property, propertyIndex) in segmentation.properties"
                      :key="propertyIndex"
                    >{{ property.datacolumnPrimaryAlias }}<span v-show="propertyIndex < segmentation.properties.length - 1">、</span></span>
                  </div>
                  <b class="question-token">'{{ segmentation.matchedWord }}'</b>
                </el-tooltip>
                <b>'{{ segmentation.matchedWord }}'</b>
              </template>
              <template
                v-else-if="isIntend(segmentation.type)"
              >
                <div>
                  <span class="column-name"
                    :class="{intend: isIntend(segmentation.type)}"
                  >[{{ segmentation.word }}]</span>{{ $t(`segmentationToken.${segmentation.type}`)}}
                </div>
              </template>
              <template
                v-else-if="isMeaningFul(segmentation.type)"
              >
                <span class="column-name"
                  :class="segmentation.type"
                >[{{ segmentation.word }}]</span>{{ $t(`segmentationToken.${segmentation.type}`)}}
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QuestionName from './QuestionName'

export default {
  name: 'MultiResult',
  components: {
    QuestionName
  },
  props: {
    resultInfo: {
      type: Object
    }
  },
  computed: {
    // 哪些 segmentation 需要顯示
    displayStatusList () {
      let standard = this.resultInfo.parseQuestionPayload.segmentations[0].segmentation
      let statusList = []
      for (let i = 0; i < standard.length; i++) {
        statusList.push(false)
      }
      this.resultInfo.parseQuestionPayload.segmentations.forEach(element => {
        element.segmentation.forEach((segmentationElement, index) => {
          if (segmentationElement.type === standard[index].type) {
            switch (segmentationElement.type) {
              case 'Datavalue':
              case 'Datacolumn':
                if (segmentationElement.properties[0].dataframePrimaryAlias !== standard[index].properties[0].dataframePrimaryAlias ||
                  segmentationElement.properties[0].datacolumnPrimaryAlias !== standard[index].properties[0].datacolumnPrimaryAlias) {
                  statusList[index] = true
                }
                break
              case 'Datarow':
                console.log(segmentationElement.properties[0].dataframePrimaryAlias, standard[index].properties[0].dataframePrimaryAlias)
                if (segmentationElement.properties[0].dataframePrimaryAlias !== standard[index].properties[0].dataframePrimaryAlias) {
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
      this.$store.commit('dataSource/setAppQuestion', questionInfo.question)
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
        case 'Datavalue':
        case 'Datacolumn':
        case 'Datarow':
          return this.$t('resultDescription.recognizeTo', {dataFrame: tokenInfo.properties[0].dataframePrimaryAlias, token: this.$t(`segmentationToken.${this.tokenInfo.type}`)}) + tokenInfo.matchedWord
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
  background-color: $theme-bg-color;
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

      &.Datacolumn {
        color: #44D2FF;
      }
      &.numeric {
        color: #CA66DA;
      }
      &.Datavalue {
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
