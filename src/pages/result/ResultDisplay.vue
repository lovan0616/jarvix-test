<template>
  <div class="result-layout">
    <filter-info/>
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
    <empty-result
      v-else-if="!layout"
    />
    <component
      v-else
      :is="layout"
      :data-result-id="currentResultId"
      :result-info="resultInfo"
      :restrictions="restrictInfo"
      :segmentation-payload="segmentationPayload"
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
import FilterInfo from '@/components/display/FilterInfo'
import UnknownInfoBlock from '@/components/resultBoard/UnknownInfoBlock'

export default {
  name: 'ResultDisplay',
  components: {
    FilterInfo,
    UnknownInfoBlock
  },
  data () {
    return {
      isLoading: false,
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
      totalSec: 50,
      periodSec: 200
    }
  },
  computed: {
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
    }
  },
  mounted () {
    this.fetchData()
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
    if (this.addConversationTimeout) window.clearTimeout(this.addConversationTimeout)
  },
  methods: {
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
          segmentationPayload: this.currentQuestionInfo,
          restrictions: this.filterRestrictionList
        }).then(res => {
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
          this.getComponent(res)
          this.getRelatedQuestion(res.resultId)
        }).catch(() => {
          this.isLoading = false
          this.$store.commit('chatBot/updateAnalyzeStatus', false)
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
        })
        return false
      }

      this.$store.dispatch('chatBot/askQuestion', data)
        .then(response => {
          this.$store.dispatch('dataSource/getHistoryQuestionList', data.dataSourceId)
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
          let questionId = response.questionId
          this.$store.commit('dataSource/setCurrentQuestionId', questionId)
          let segmentationList = response.parseQuestionPayload.segmentations

          if (segmentationList.length === 1) {
            // 介紹資料集的處理
            switch (segmentationList[0].implication.intent) {
              case 'Introduction': {
                this.layout = 'PreviewDataSource'
                this.resultInfo = null
                this.isLoading = false
                this.setRelatedQuestions()
                return false
              }
              case 'NoAnswer': {
                let implication = segmentationList[0].implication
                this.layout = 'EmptyResult'
                this.resultInfo = {
                  title: implication.title,
                  description: implication.description
                }
                this.isLoading = false
                this.setRelatedQuestions()
                return false
              }
            }

            this.$store.dispatch('chatBot/askResult', {
              questionId,
              segmentationPayload: segmentationList[0],
              restrictions: this.filterRestrictionList
            }).then(res => {
              this.getComponent(res)
              this.getRelatedQuestion(res.resultId)
            }).catch((error) => {
              if (error.constructor.name !== 'Cancel') this.isLoading = false
            })
          } else {
            // 多個結果
            this.layout = 'MultiResult'
            this.resultInfo = response
            this.isLoading = false
            this.setRelatedQuestions()
          }
        }).catch((error) => {
          // 解決重新問問題，前一次請求被取消時，保持 loading 狀態
          if (error.constructor.name !== 'Cancel') this.isLoading = false
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
        })
    },
    setRelatedQuestions (options = []) {
      this.$store.commit('chatBot/addSystemConversation', {
        text: this.$t('bot.finish'), options
      })
      this.$store.commit('chatBot/updateAnalyzeStatus', false)
    },
    getComponent (res) {
      window.clearTimeout(this.timeoutFunction)
      this.$store.commit('result/updateCurrentResultId', res.resultId)
      if (res.layout === 'no_answer') {
        this.layout = 'EmptyResult'
        this.resultInfo = {
          title: res.noAnswerTitle,
          description: res.noAnswerDescription
        }
        this.isLoading = false
        return false
      }

      this.$store.dispatch('chatBot/getComponentList', res.resultId)
        .then(componentResponse => {
          switch (componentResponse.status) {
            case 'Process':
            case 'Ready':
              this.timeoutFunction = window.setTimeout(() => {
                this.getComponent(res)
              }, this.totalSec)

              this.totalSec += this.periodSec
              this.periodSec = this.totalSec
              break
            case 'Complete':
              this.totalSec = 50
              this.periodSec = 200
              this.resultInfo = componentResponse.componentIds
              this.restrictInfo = componentResponse.restrictions
              this.layout = this.getLayout(componentResponse.layout)
              this.segmentationPayload = componentResponse.segmentationPayload
              this.segmentationAnalysis(componentResponse.segmentationPayload)
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
    segmentationAnalysis (payloadInfo) {
      this.segmentationInfo.nlpToken = payloadInfo.segmentation.filter(element => {
        return element.isMatchedByNlp || element.isSynonym
      })
      this.segmentationInfo.unknownToken = payloadInfo.segmentation.filter(element => {
        return element.type === 'UnknownToken'
      })
      this.segmentationInfo.question = payloadInfo.executedQuestion
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
