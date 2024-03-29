<template>
  <div class="result-layout">
    <unknown-info-block
      v-if="segmentationInfo.unknownToken.length > 0"
      :segmentation-info="segmentationInfo"
      @close="closeUnknowInfoBlock"
    />
    <spinner
      v-if="isLoading"
      :title="$t('resultDescription.analysisProcessing')"
      class="layout-spinner"
      size="50"
    />
    <model-result
      v-else-if="isModelResult"
    />
    <component
      v-else
      :is="layout || 'EmptyResult'"
      :data-result-id="currentResultId"
      :data-frame-id="currentQuestionDataFrameId"
      :result-info="resultInfo"
      :restrictions="restrictInfo"
      :segmentation-payload="segmentationPayload"
      :transcript="transcript"
      :intent="intent"
      :is-war-room-addable="isWarRoomAddable"
      :is-histogram-bin-setting="isHistogramBinSetting"
      mode="display"
      @fetch-new-components-list="getComponent"
    />
  </div>
</template>

<script>
import UnknownInfoBlock from '@/components/resultBoard/UnknownInfoBlock'
import ModelResult from './components/ModelResult'
import { mapState, mapGetters } from 'vuex'
import { isEnOrEnum, intentType } from '@/utils/general'

export default {
  name: 'ResultDisplay',
  components: {
    UnknownInfoBlock,
    ModelResult
  },
  data () {
    return {
      isLoading: true,
      layout: null,
      resultInfo: null,
      restrictInfo: [],
      timeStamp: this.$route.query.stamp,
      timeoutFunction: null,
      segmentationInfo: {
        question: null,
        unknownToken: [],
        nlpToken: []
      },
      segmentationPayload: null,
      transcript: null,
      // 目前兩版 transcript 過渡期先放這
      isWarRoomAddable: false,
      isHistogramBinSetting: false,
      currentQuestionDataFrameId: null,
      totalSec: 50,
      periodSec: 200,
      intent: null,
      intentType
    }
  },
  computed: {
    ...mapState('result', ['currentResultId', 'isModelResult']),
    ...mapState('dataSource', ['dataSourceId', 'dataFrameId', 'currentQuestionId', 'currentQuestionInfo', 'algoConfig']),
    ...mapGetters('dataFrameAdvanceSetting', ['askCondition', 'selectedColumnList']),
    filterRestrictionList () {
      return this.$store.getters['dataFrameAdvanceSetting/filterRestrictionList']
    }
  },
  watch: {
    '$route.query' ({ question, action, stamp }) {
      if (!question) return false
      this.fetchApiAsk({
        question,
        dataSourceId: this.dataSourceId,
        dataFrameId: this.dataFrameId,
        shouldCancelToken: true
      })
    },
    askCondition: {
      deep: true,
      handler (newValue, oldValue) {
        if (
          // 切換 dataframe 被清空時不重新問問題
          newValue.columnList === null && newValue.filterList.length === 0 ||
          // 開啟進階設定取得欄位資料時也不重新問問題
          oldValue.columnList === null && (oldValue.filterList.length === newValue.filterList.length) ||
          this.segmentationPayload === null
        ) return

        // 預先觸發重新計算 column summary 和 column correlation
        // this.triggerColumnDataCalculation()
        this.fetchApiAsk({
          question: this.segmentationPayload.sentence.reduce((acc, cur, index) => {
            let currentWord = cur.word
            return acc + ((index !== 0 && isEnOrEnum(currentWord)) ? ` ${currentWord}` : currentWord)
          }, ''),
          dataSourceId: this.$route.query.dataSourceId,
          dataFrameId: this.$route.query.dataFrameId,
          shouldCancelToken: true
        })
      }
    }
  },
  mounted () {
    if (this.isModelResult) {
      setTimeout(() => {
        this.isLoading = false
      }, 2 * 1000)
    }
    this.fetchData()
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
    this.$store.commit('result/updateCurrentResultId', null)
    document.title = 'JarviX'
  },
  methods: {
    // ...mapActions('dataSource', ['triggerColumnDataCalculation']),
    fetchData () {
      const { dataSourceId, dataFrameId, question } = this.$route.query
      if (!question) return
      this.fetchApiAsk({
        dataSourceId,
        dataFrameId,
        question,
        shouldCancelToken: true
      })
    },
    clearLayout () {
      this.layout = null
      this.resultInfo = null
      this.restrictInfo = []
      this.segmentationPayload = null
      this.currentQuestionDataFrameId = null
      this.transcript = null
      this.isWarRoomAddable = false
      this.isHistogramBinSetting = false
      this.intent = null
      this.$store.commit('dataSource/resetAlgoConfig')
      this.$store.commit('dataSource/resetClusteringInfo')
      this.closeUnknowInfoBlock()
    },
    fetchApiAsk (data) {
      this.clearLayout()
      this.isLoading = true
      // 動態變更 title 為了方便前一頁、下一頁變更時可以快速找到
      document.title = `JarviX-${data.question}`

      if (this.currentQuestionInfo) {
        this.$store.dispatch('chatBot/askResult', {
          algoConfig: this.algoConfig[this.currentQuestionInfo.denotation.toLowerCase()] || null,
          questionId: this.currentQuestionId,
          segmentation: this.currentQuestionInfo,
          restrictions: this.filterRestrictionList,
          selectedColumnList: this.selectedColumnList,
          displayConfig: {
            histogramBinSize: null,
            sortOrders: []
          },
          isFilter: false
        }).then(res => {
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
          this.$store.commit('result/updateCurrentResultId', res.resultId)
          if (res.layout === 'no_answer') {
            this.setEmptyLayout(res)
            return
          }
          this.getComponent(res.resultId)
        }).catch(() => {
          this.isLoading = false
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
        })
        return
      }

      this.$store.dispatch('chatBot/askQuestion', data)
        .then(response => {
          this.$store.dispatch('dataSource/getHistoryQuestionList', data.dataSourceId)
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
          let questionId = response.questionId
          this.$store.commit('dataSource/setCurrentQuestionId', questionId)

          let segmentationList = response.segmentationList
          if (segmentationList.length === 1) {
            // 介紹資料集的處理
            switch (segmentationList[0].denotation) {
              case 'INTRODUCTION': {
                this.layout = 'PreviewDataSource'
                this.resultInfo = null
                this.isLoading = false
                return false
              }
              case 'NO_ANSWER': {
                let segmentation = segmentationList[0]
                this.layout = 'EmptyResult'
                this.resultInfo = {
                  title: segmentation.errorCategory,
                  description: segmentation.errorMessage
                }
                this.isLoading = false
                return false
              }
            }

            this.$store.dispatch('chatBot/askResult', {
              questionId,
              algoConfig: this.algoConfig[segmentationList[0].denotation.toLowerCase()] || null,
              segmentation: segmentationList[0],
              restrictions: this.filterRestrictionList,
              selectedColumnList: this.selectedColumnList,
              displayConfig: {
                histogramBinSize: null,
                sortOrders: []
              },
              isFilter: false
            }).then(res => {
              this.$store.commit('result/updateCurrentResultId', res.resultId)
              if (res.layout === 'no_answer') {
                this.setEmptyLayout(res)
                return
              }
              this.getComponent(res.resultId)
            }).catch((error) => {
              if (error.message !== 'cancel') this.isLoading = false
            })
          } else {
            // 多個結果
            this.layout = 'MultiResult'
            this.resultInfo = { ...response, question: data.question }
            this.isLoading = false
          }
        }).catch((error) => {
          // 解決重新問問題，前一次請求被取消時，保持 loading 狀態
          if (error.message !== 'cancel') this.isLoading = false
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
        })
    },
    setEmptyLayout (res) {
      this.layout = 'EmptyResult'
      this.resultInfo = {
        title: res.noAnswerTitle,
        description: res.noAnswerDescription
      }
      this.isLoading = false
    },
    getComponent (resultId) {
      window.clearTimeout(this.timeoutFunction)
      this.$store.dispatch('chatBot/getComponentList', { resultId })
        .then(componentResponse => {
          switch (componentResponse.status) {
            case 'Process':
            case 'Ready':
              this.timeoutFunction = window.setTimeout(() => {
                this.getComponent(resultId)
              }, this.totalSec)

              // request 間隔最多三秒
              this.totalSec = this.totalSec + this.periodSec > 3000 ? 3000 : this.totalSec + this.periodSec
              this.periodSec = this.totalSec
              break
            case 'Complete':
              this.totalSec = 50
              this.periodSec = 200
              this.resultInfo = componentResponse.componentIds
              this.resultInfo.canDoList = componentResponse.canDoList
              this.resultInfo.canSaveResult = componentResponse.canSaveResult
              this.restrictInfo = componentResponse.restrictions
              this.intent = componentResponse.intent
              this.layout = this.getLayout(componentResponse.layout)
              this.segmentationPayload = componentResponse.segmentationPayload
              this.segmentationAnalysis(componentResponse.segmentationPayload)
              this.transcript = componentResponse.transcript
              this.isWarRoomAddable = componentResponse.isWarRoomAddable
              this.isHistogramBinSetting = componentResponse.isHistogramIntervalSetting
              this.currentQuestionDataFrameId = this.transcript.dataFrame.dataFrameId
              this.$store.commit('dataSource/setCurrentQuestionDataFrameId', this.currentQuestionDataFrameId)
              this.isLoading = false
              break
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              this.resultInfo = {
                description: componentResponse.errorMessage
              }
              this.layout = 'EmptyResult'
              this.isLoading = false
              break
          }
        }).catch((error) => {
          if (error.message !== 'cancel') {
            this.isLoading = false
            this.resultInfo = null
          }
        })
    },
    segmentationAnalysis (payloadInfo) {
      this.segmentationInfo.unknownToken = payloadInfo.sentence.filter(element => {
        return element.type === 'UNKNOWN'
      })
      this.segmentationInfo.question = this.$route.query.question
    },
    closeUnknowInfoBlock () {
      this.segmentationInfo = {
        question: null,
        unknownToken: []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.result-layout {
  width: 100%;

  .seciotn-title {
    font-size: 18px;
    letter-spacing: 0.1em;
    line-height: 26px;
    margin-bottom: 10px;
  }

  .recommend-question-list-block {
    margin-top: 64px;

    .block-title {
      font-size: 24px;
      letter-spacing: 0.1em;
      line-height: 40px;
      margin-bottom: 48px;
    }

    .category-title {
      font-size: 18px;
      line-height: 26px;
      margin-bottom: 12px;
    }
  }
}
</style>
