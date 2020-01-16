<template>
  <div class="result-layout">
    <filter-info></filter-info>
    <spinner class="layout-spinner"
      v-if="isLoading"
      :title="$t('resultDescription.analysisProcessing')"
      size="50"
    ></spinner>
    <empty-result
      v-else-if="!layout"
    ></empty-result>
    <component
      v-else
      :is="layout"
      :resultInfo="resultInfo"
    ></component>
    <div class="related-question-block" v-if="relatedQuestionList.length > 0">
      <div class="block-title">{{ $t('editing.relatedQuesion') }}</div>
      <div class="related-question-list">
        <preview-result-board class="result-board"
          v-for="(relatedQuestion, index) in relatedQuestionList"
          :key="index"
          :question-info="relatedQuestion"
        ></preview-result-board>
      </div>
    </div>
  </div>
</template>

<script>
import FilterInfo from '@/components/display/FilterInfo'

export default {
  name: 'ResultDisplay',
  components: {
    FilterInfo
  },
  data () {
    return {
      isLoading: false,
      layout: null,
      resultInfo: null,
      timeStamp: this.$route.query.stamp,
      relatedQuestionList: [],
      timeoutFunction: null
    }
  },
  watch: {
    '$route.query' ({ question, action, stamp }) {
      if (!question) return false
      this.fetchApiAsk({question, 'dataSourceId': this.dataSourceId, 'segmentation': this.currentQuestionInfo, 'restrictions': this.filterRestrictionList})
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    currentQuestionInfo () {
      return this.$store.state.dataSource.currentQuestionInfo
    },
    currentQuestionId () {
      return this.$store.state.dataSource.currentQuestionId
    },
    filterRestrictionList () {
      return this.$store.getters['dataSource/filterRestrictionList']
    }
  },
  methods: {
    fetchData () {
      let question = this.$route.query.question
      let dataSourceId = parseInt(this.$route.query.dataSourceId)
      if (question) {
        this.fetchApiAsk({dataSourceId, question})
      }
    },
    clearLayout () {
      this.layout = null
      this.resultInfo = null
      this.relatedQuestionList = []
    },
    fetchApiAsk (data) {
      this.clearLayout()
      this.isLoading = true
      this.$store.commit('chatBot/addUserConversation', data.question)
      this.$store.commit('chatBot/updateAnalyzeStatus', true)
      // 動態變更 title 為了方便前一頁、下一頁變更時可以快速找到
      document.title = `SyGPS-${data.question}`

      if (this.currentQuestionInfo) {
        this.$store.dispatch('chatBot/askResult', {
          questionId: this.currentQuestionId,
          segmentationPayload: this.currentQuestionInfo
        }).then(res => {
          this.getComponent(res)
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
            this.$store.dispatch('chatBot/askResult', {
              questionId,
              segmentationPayload: segmentationList[0]
            }).then(res => {
              this.getComponent(res)
            })
          } else {
            // 多個結果
            this.layout = 'MultiResult'
            this.resultInfo = response
            this.isLoading = false
          }
        }).catch(() => {
          this.isLoading = false
          this.$store.commit('chatBot/updateAnalyzeStatus', false)
        })

      this.$store.dispatch('chatBot/getRelatedQuestionList', {
        question: data.question,
        dataSourceId: data.dataSourceId
      }).then(response => {
        console.log(response)
      })

      // askQuestion(data, new axios.CancelToken(function executor (c) {
      //   _this.askCancelFunction = c
      // }))
      //   .then(res => {
      //     this.$store.dispatch('dataSource/getHistoryQuestionList', this.dataSourceId)
      //     this.$store.commit('dataSource/setCurrentQuestionInfo', null)

      //     this.timeStamp = this.$route.query.stamp
      //     this.isLoading = false
      //     switch (res.layout) {
      //       case 'general':
      //         if (res.tasks && res.tasks.length > 1) {
      //           this.layout = 'GeneralResult'
      //           if (res.relatedQuestionList) {
      //             this.relatedQuestionList = res.relatedQuestionList
      //           }

      //           this.$nextTick(() => {
      //             window.setTimeout(() => {
      //               this.$store.commit('chatBot/addSystemConversation', {text: res.relatedQuestionList ? this.$t('bot.defaultResponse') : this.$t('bot.finish'), options: res.relatedQuestionList})
      //             }, 2000)
      //           })
      //         } else {
      //           this.layout = 'MultiResult'
      //           let chatBotOptionList = []

      //           if (res.checkQuestionList && res.checkQuestionList.length > 0) {
      //             chatBotOptionList = res.checkQuestionList
      //           }
      //           if (res.similarQuestionList && res.similarQuestionList.length > 0) {
      //             chatBotOptionList = res.similarQuestionList
      //           }

      //           this.$nextTick(() => {
      //             window.setTimeout(() => {
      //               this.$store.commit('chatBot/addSystemConversation', {text: res.similarQuestionList ? this.$t('bot.similarQuestionDescription') : this.$t('bot.multiplePossibilities'), options: chatBotOptionList})
      //             }, 2000)
      //           })
      //         }
      //         this.resultInfo = res

      //         break
      //       case 'correlation_exploration':
      //         this.layout = 'CorrelationExplorationResult'
      //         this.resultInfo = res

      //         if (res.relatedQuestionList) {
      //           this.relatedQuestionList = res.relatedQuestionList
      //         }

      //         this.$nextTick(() => {
      //           window.setTimeout(() => {
      //             this.$store.commit('chatBot/addSystemConversation', {text: res.relatedQuestionList ? this.$t('bot.defaultResponse') : this.$t('bot.finish'), options: res.relatedQuestionList})
      //           }, 2000)
      //         })

      //         break
      //       case 'root_cause':
      //         this.layout = 'RootCauseResult'
      //         this.resultInfo = res

      //         if (res.relatedQuestionList) {
      //           this.relatedQuestionList = res.relatedQuestionList
      //         }

      //         this.$nextTick(() => {
      //           window.setTimeout(() => {
      //             this.$store.commit('chatBot/addSystemConversation', {text: res.relatedQuestionList ? this.$t('bot.defaultResponse') : this.$t('bot.finish'), options: res.relatedQuestionList})
      //           }, 2000)
      //         })

      //         break
      //       case 'no_answer':
      //         this.layout = 'EmptyResult'
      //         if (res.tasks) {
      //           this.resultInfo = res.tasks[0].entities
      //         }

      //         this.$nextTick(() => {
      //           window.setTimeout(() => {
      //             this.$store.commit('chatBot/addSystemConversation', {
      //               text: res.tasks ? this.resultInfo.description : this.$t('editing.emptyResultDescription'),
      //               options: res.relatedQuestionList && res.relatedQuestionList.length > 0 ? res.relatedQuestionList : []
      //             })
      //           }, 2000)
      //         })

      //         break
      //       case 'preview_datasource':
      //         this.layout = 'PreviewDataSource'
      //         break
      //     }

      //     this.$nextTick(() => {
      //       window.setTimeout(() => {
      //         this.$store.commit('chatBot/updateAnalyzeStatus', false)
      //       }, 2000)
      //     })
      //   })
    },
    getComponent (res) {
      window.clearTimeout(this.timeoutFunction)
      this.$store.dispatch('chatBot/getComponentList', res.resultId)
        .then(componentResponse => {
          switch (componentResponse.status) {
            case 'Process':
            case 'Ready':
              this.timeoutFunction = window.setTimeout(() => {
                this.getComponent(res)
              }, 1000)
              break
            case 'Complete':
              window.clearTimeout(this.timeoutFunction)
              this.resultInfo = componentResponse.componentIds
              switch (res.layout) {
                case 'general':
                  this.layout = 'GeneralResult'
              }
              this.isLoading = false
              break
            case 'Fail':
              window.clearTimeout(this.timeoutFunction)
              this.layout = 'EmptyResult'
              this.isLoading = false
              break
          }
        })
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
    background-color: $theme-bg-color;
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
