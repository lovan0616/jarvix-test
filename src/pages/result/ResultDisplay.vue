<template>
  <div class="result-layout">
    <!-- <layout
      v-else
      :key="timeStamp"
      v-bind="layout"
    ></layout> -->
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
import axios from 'axios'
import { mapGetters } from 'vuex'
import { askQuestion } from '@/API/NewAsk'

export default {
  name: 'ResultDisplay',
  data () {
    return {
      isLoading: false,
      layout: null,
      resultInfo: null,
      askCancelFunction: null,
      timeStamp: this.$route.query.stamp,
      relatedQuestionList: []
    }
  },
  watch: {
    '$route.query' ({ question, action, stamp }) {
      if (!question) return false
      this.fetchApiAsk({question, 'dataSourceId': this.dataSourceId, 'segmentation': this.currentQuestionInfo})
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {
    ...mapGetters('bookmark', ['appQuestion']),
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    currentQuestionInfo () {
      return this.$store.state.dataSource.currentQuestionInfo
    }
  },
  methods: {
    fetchData () {
      let question = this.$route.query.question
      let dataSourceId = parseInt(this.$route.query.dataSourceId)
      if (question) {
        this.fetchApiAsk({question, dataSourceId, 'segmentation': this.currentQuestionInfo})
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

      const _this = this
      this.cancelRequest()
      askQuestion(data, new axios.CancelToken(function executor (c) {
        _this.askCancelFunction = c
      }))
        .then(res => {
          this.$store.dispatch('dataSource/getHistoryQuestionList', this.dataSourceId)
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)

          this.timeStamp = this.$route.query.stamp

          // checkQuestionList: null
          // similarQuestionList

          this.isLoading = false

          switch (res.layout) {
            case 'general':
              if (res.tasks && res.tasks.length > 1) {
                this.layout = 'GeneralResult'
                if (res.relatedQuestionList) {
                  this.relatedQuestionList = res.relatedQuestionList
                }

                this.$nextTick(() => {
                  window.setTimeout(() => {
                    this.$store.commit('chatBot/addSystemConversation', res.relatedQuestionList)
                  }, 2000)
                })
              } else {
                this.layout = 'MultiResult'
              }
              this.resultInfo = res

              break
            case 'no_answer':
              this.layout = 'EmptyResult'
              this.resultInfo = res.tasks[0].entities
              break
            case 'preview_datasource':
              this.layout = 'PreviewDataSource'
              break
          }

          this.$nextTick(() => {
            window.setTimeout(() => {
              this.$store.commit('chatBot/updateAnalyzeStatus', false)
            }, 2000)
          })
        }).catch(() => {
          this.isLoading = false
          this.$store.commit('chatBot/updateAnalyzeStatus', false)
        })
    },
    cancelRequest () {
      if (typeof this.askCancelFunction === 'function') {
        this.askCancelFunction('cancel request')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.result-page {
  .result-question-select-block {
    display: flex;
    margin-bottom: 20px;
  }
}
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
