<template>
  <div class="result-layout">
    <unknown-info-block
      v-if="segmentationInfo.unknownToken.length > 0 || segmentationInfo.nlpToken.length > 0"
      :segmentation-info="segmentationInfo"
      @close="closeUnknowInfoBlock"
    />
    <spinner 
      v-if="isLoading"
      :title="$t('resultDescription.analysisProcessing')"
      class="layout-spinner"
      size="50"
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
      mode="display"
      @fetch-new-components-list="getComponentV2"
    />
    <div
      v-if="relatedQuestionList.length > 0" 
      class="related-question-block">
      <div class="block-title">{{ $t('editing.relatedQuestion') }}</div>
      <div class="related-question-list">
        <preview-result-board 
          v-for="(relatedQuestion, index) in relatedQuestionList"
          :key="index"
          :question-info="relatedQuestion"
          class="result-board"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UnknownInfoBlock from '@/components/resultBoard/UnknownInfoBlock'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'ResultDisplay',
  components: {
    UnknownInfoBlock
  },
  data () {
    return {
      isLoading: true,
      layout: null,
      resultInfo: null,
      restrictInfo: [],
      timeStamp: this.$route.query.stamp,
      relatedQuestionList: [],
      timeoutFunction: null,
      addConversationTimeout: null,
      segmentationInfo: {
        question: null,
        unknownToken: [],
        nlpToken: []
      },
      segmentationPayload: null,
      transcript: null,
      // 目前兩版 transcript 過渡期先放這
      isWarRoomAddable: false,
      currentQuestionDataFrameId: null,
      totalSec: 50,
      periodSec: 200,
      intent: null
    }
  },
  computed: {
    ...mapState('result', ['currentResultId']),
    ...mapGetters('dataFrameAdvanceSetting', ['askCondition', 'selectedColumnList']),
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    dataFrameId () {
      return this.$store.state.dataSource.dataFrameId
    },
    currentQuestionInfo () {
      return this.$store.state.dataSource.currentQuestionInfo
    },
    currentQuestionId () {
      return this.$store.state.dataSource.currentQuestionId
    },
    currentResultId () {
      return this.$store.state.result.currentResultId
    },
    filterRestrictionList () {
      return this.$store.getters['dataSource/filterRestrictionList']
    }
  },
  watch: {
    '$route.query' ({ question, action, stamp }) {
      if (!question) return false
      this.fetchApiAsk({question, 'dataSourceId': this.dataSourceId, 'dataFrameId': this.dataFrameId})
    },
    askCondition: {
      deep: true,
      handler (newValue, oldValue) {
        if (
          // 切換 dataframe 被清空時不重新問問題
          newValue.columnList === null && newValue.filterList.length === 0
          // 開啟進階設定取得欄位資料時也不重新問問題
          || oldValue.columnList === null && (oldValue.filterList.length === newValue.filterList.length)
        ) return

        // 預先觸發重新計算 column summary 和 column correlation
        // this.triggerColumnDataCalculation()
        this.fetchApiAsk({
          question: this.segmentationPayload.sentence.reduce((acc, cur) => acc + cur.word, ''),
          'dataSourceId': Number(this.$route.query.dataSourceId), 
          'dataFrameId': Number(this.$route.query.dataFrameId)
        })
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
    if (this.addConversationTimeout) window.clearTimeout(this.addConversationTimeout)
    this.$store.commit('result/updateCurrentResultId', null)
  },
  methods: {
    // ...mapActions('dataSource', ['triggerColumnDataCalculation']),
    fetchData () {
      const {dataSourceId, dataFrameId, question} = this.$route.query
      if (!question) return
      this.fetchApiAsk({
        dataSourceId, 
        dataFrameId,
        question
      })
    },
    clearLayout () {
      this.layout = null
      this.resultInfo = null
      this.restrictInfo = []
      this.relatedQuestionList = []
      this.segmentationPayload = null
      this.currentQuestionDataFrameId = null
      this.transcript = null
      this.isWarRoomAddable = false
      this.intent = null
      this.closeUnknowInfoBlock()
    },
    fetchApiAsk (data) {
      this.clearLayout()
      this.isLoading = true
      this.$store.commit('chatBot/addUserConversation', data.question)
      this.$store.commit('chatBot/updateAnalyzeStatus', true)
      // 動態變更 title 為了方便前一頁、下一頁變更時可以快速找到
      document.title = `JarviX-${data.question}`

      if (this.currentQuestionInfo) {
        this.$store.dispatch('chatBot/askResult', {
          questionId: this.currentQuestionId,
          segmentation: this.currentQuestionInfo,
          restrictions: this.filterRestrictionList,
          selectedColumnList: this.selectedColumnList
        }).then(res => {
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
          this.$store.commit('result/updateCurrentResultId', res.resultId)
          if (res.layout === 'no_answer') {
            this.setEmptyLayout(res)
            return
          }
          this.getComponentV2(res.resultId)
          // this.getRelatedQuestion(res.resultId)
        }).catch(() => {
          this.isLoading = false
          this.$store.commit('chatBot/updateAnalyzeStatus', false)
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
                this.setRelatedQuestions()
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
                this.setRelatedQuestions()
                return false
              }
            }
            
            this.$store.dispatch('chatBot/askResult', {
              questionId,
              segmentation: segmentationList[0],
              restrictions: this.filterRestrictionList,
              selectedColumnList: this.selectedColumnList
            }).then(res => {
              this.$store.commit('result/updateCurrentResultId', res.resultId)
              if (res.layout === 'no_answer') {
                this.setEmptyLayout(res)
                return
              }
              this.getComponentV2(res.resultId)
              // this.getRelatedQuestion(res.resultId)
            }).catch((error) => {
              if (error.message !== 'cancel') this.isLoading = false
            })
          } else {
            // 多個結果
            this.layout = 'MultiResultV2'
            this.resultInfo = {...response, question: data.question}
            this.isLoading = false
            this.setRelatedQuestions()
          }
        }).catch((error) => {
          // 解決重新問問題，前一次請求被取消時，保持 loading 狀態
          if (error.message !== 'cancel') this.isLoading = false
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
        })
    },
    setRelatedQuestions (options = []) {
      this.$store.commit('chatBot/addSystemConversation', {
        text: this.$t('bot.finish'), options
      })
      this.$store.commit('chatBot/updateAnalyzeStatus', false)
    },
    setEmptyLayout (res) {
      this.layout = 'EmptyResult'
      this.resultInfo = {
        title: res.noAnswerTitle,
        description: res.noAnswerDescription
      }
      this.isLoading = false
    },
    getComponentV2 (resultId) {
      window.clearTimeout(this.timeoutFunction)
      this.$store.dispatch('chatBot/getComponentList', resultId)
        .then(componentResponse => {
          switch (componentResponse.status) {
            case 'Process':
            case 'Ready':
              this.timeoutFunction = window.setTimeout(() => {
                this.getComponentV2(resultId)
              }, this.totalSec)

              this.totalSec += this.periodSec
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
              this.segmentationAnalysisV2(componentResponse.segmentationPayload)
              this.transcript = componentResponse.transcript
              this.isWarRoomAddable = componentResponse.isWarRoomAddable
              this.currentQuestionDataFrameId = this.transcript.dataFrame.dataFrameId
              this.$store.commit('dataSource/setCurrentQuestionDataFrameId', this.currentQuestionDataFrameId)
              this.isLoading = false
              break
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
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
    getRelatedQuestion (id) {
      this.$store.dispatch('chatBot/getRelatedQuestionList', id).then(response => {
        this.$nextTick(() => {
          this.addConversationTimeout = window.setTimeout(() => {
            this.$store.commit('chatBot/addSystemConversation', {
              text: response.length > 0 ? this.$t('bot.defaultResponse') : this.$t('bot.finish'), options: response
            })
            this.$store.commit('chatBot/updateAnalyzeStatus', false)
          }, 2000)
        })
      }).catch(() => {
        this.$store.commit('chatBot/addSystemConversation', {
          text: this.$t('bot.finish'), options: []
        })
        this.$store.commit('chatBot/updateAnalyzeStatus', false)
      })
    },
    segmentationAnalysisV2 (payloadInfo) {
      // this.segmentationInfo.nlpToken = payloadInfo.sentence.filter(element => {
      //   return element.isMatchedByNlp || element.isSynonym
      // })
      this.segmentationInfo.unknownToken = payloadInfo.sentence.filter(element => {
        return element.type === 'UNKNOWN'
      })
      this.segmentationInfo.question = this.$route.query.question
    },
    closeUnknowInfoBlock () {
      this.segmentationInfo = {
        question: null,
        unknownToken: [],
        nlpToken: []
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
    line-height: 26px;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
  }
  .recommend-question-list-block {
    margin-top: 64px;

    .block-title {
      font-size: 24px;
      line-height: 40px;
      letter-spacing: 0.1em;
      margin-bottom: 48px;
    }

    .category-title {
      font-size: 18px;
      line-height: 26px;
      margin-bottom: 12px;
    }
  }

  .related-question-block {
    background-color: var(--color-bg-5);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    padding: 28px 28px 4px;

    .block-title {
      font-size: 24px;
      line-height: 32px;
      margin-bottom: 18px;
    }

    .related-question-list {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
