<template>
  <div class="key-result">
    <!-- 有 key result -->
    <div 
      v-if="resultInfo.key_result" 
      class="key-result__content">
      <div class="key-result__question">
        <span class="question-mark">Q</span>
        {{ question }}
      </div>
      <task
        :key="resultInfo.key_result[0]"
        :component-id="resultInfo.key_result[0]"
        intend="key_result"
      />
    </div>
    <!-- 其餘狀況 MultiResult, NoResult, ErrorMessage -->
    <component
      v-else
      :is="layout || 'EmptyResult'"
      :key="appQuestion"
      :result-info="resultInfo"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      resultInfo: null,
      layout: '',
      timeoutFunction: null,
      totalSec: 50,
      periodSec: 200,
      question: ''
    }
  },
  computed: {
    ...mapState('dataSource', ['dataSourceId', 'dataFrameId', 'appQuestion']),
    ...mapGetters('dataSource', ['filterRestrictionList']),

  },
  watch: {
    appQuestion (question) {
      if (!question) return
      // 關閉介紹資料集
      this.closePreviewDataSource()
      this.$store.dispatch('chatBot/askQuestion', {
        question,
        dataSourceId: this.dataSourceId,
        dataFrameId: this.dataFrameId
      }).then(response => {
        let questionId = response.questionId
        let segmentationList = response.segmentationList
        
        // 無結果
        if (segmentationList[0].denotation === 'NO_ANSWER') {
          this.$store.commit('result/updateCurrentResultInfo', null)
          let segmentation = segmentationList[0]
          this.layout = 'EmptyResult'
          this.resultInfo = {
            title: segmentation.errorCategory,
            description: segmentation.errorMessage
          }
          return false
        }

        // 一個結果
        if (segmentationList.length === 1) {
          this.$store.dispatch('chatBot/askResult', {
            questionId,
            segmentation: segmentationList[0],
            // TODO: 處理 filter, drill down
            restrictions: null,
            selectedColumnList: null
          })
            .then(res => this.getComponentV2(res.resultId))
            .catch((error) => {})
        } else {
          // TODO: 多個結果
        }
      }).catch((error) => {
        // 解決重新問問題，前一次請求被取消時，保持 loading 狀態
        this.$store.commit('dataSource/setCurrentQuestionInfo', null)
      })
    }
  },
  methods: {
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
              this.$store.commit('dataSource/setCurrentQuestionDataFrameId', this.currentQuestionDataFrameId)
              this.question = componentResponse.segmentationPayload.sentence.reduce((acc, cur) => acc + cur.word, '')
              this.$store.commit('result/updateCurrentResultId', resultId)
              this.$store.commit('result/updateCurrentResultInfo', {
                ...componentResponse.componentIds,
                question: componentResponse.segmentationPayload.sentence.reduce((acc, cur) => acc + cur.word, '')
              })
              break
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              this.resultInfo = { description: componentResponse.errorMessage }
              this.layout = 'EmptyResult'
              this.$store.commit('result/updateCurrentResultId', null)
              this.$store.commit('result/updateCurrentResultInfo', null)
              break
          }
        }).catch((error) => {
          this.$store.commit('result/updateCurrentResultId', null)
          this.$store.commit('result/updateCurrentResultInfo', null)
          if (error.message !== 'cancel') this.resultInfo = null
        })
    },
    setEmptyLayout (res) {
      this.layout = 'EmptyResult'
      this.resultInfo = {
        title: res.noAnswerTitle,
        description: res.noAnswerDescription
      }
    },
    closePreviewDataSource () {
      this.$store.commit('previewDataSource/togglePreviewDataSource', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.key-result {
  padding: 24px;
  &__question {
    font-size: 18px;
    margin-bottom: 16px;
    .question-mark {
      display: inline-block;
      width: 30px;
      height: 30px;
      background-color: $theme-color-primary;
      color: #fff;
      margin-right: 8px;
      border-radius: 8px;
      text-align: center;
      line-height: 30px;
      font-weight: bold;
    }
  }
}
</style>