<template>
  <div class="key-result">
    <spinner 
      v-if="isLoading"
      :title="$t('resultDescription.analysisProcessing')"
      class="layout-spinner"
      size="50"
    />
    <template v-else-if="isShowKeyResultContent">
      <!-- 有 key result -->
      <div 
        v-if="computedKeyResultId" 
        class="key-result__content">
        <div class="key-result__question">
          <span class="question-mark">Q</span>
          {{ computedQuestion }}
        </div>
        <task
          :key="computedKeyResultId"
          :component-id="computedKeyResultId"
          intend="key_result"
        />
      </div>
      <!-- 其餘狀況 MultiResult, NoResult, ErrorMessage -->
      <component
        v-else
        :is="layout || 'EmptyResult'"
        :key="appQuestion"
        :result-info="resultInfo"
        :redirect-on-select="false"
      />
      <div
        v-if="!isLoading && isAddable === false"
        class="key-result__empty-message"
      >
        <svg-icon
          class="icon"
          icon-class="information-circle"
        />{{ $t('miniApp.componentNotAddable') }}
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    currentComponent: {
      type: Object,
      default: null
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isAddable: {
      type: Boolean,
      default: null
    }
  },
  data () {
    return {
      resultInfo: null,
      layout: '',
      timeoutFunction: null,
      totalSec: 50,
      periodSec: 200,
      question: '',
      segmentation: null
    }
  },
  computed: {
    ...mapState('dataSource', ['dataSourceId', 'dataFrameId', 'appQuestion', 'currentQuestionInfo']),
    ...mapGetters('dataSource', ['filterRestrictionList']),
    computedKeyResultId () {
      return (this.resultInfo && this.resultInfo.key_result && this.resultInfo.key_result[0]) || this.currentComponent.keyResultId
    },
    computedQuestion () {
      return this.question || this.currentComponent.question
    },
    isShowKeyResultContent () {
      return this.computedKeyResultId || this.layout
    }
  },
  watch: {
    appQuestion (question) {
      if (!question) return
      // 關閉介紹資料集
      this.closePreviewDataSource()
      // 恢復新增元件的狀態
      this.$emit('update:isAddable', null)
      this.$emit('update:isLoading', true)


      this.$store.dispatch('chatBot/askQuestion', {
        question,
        dataSourceId: this.dataSourceId,
        dataFrameId: this.dataFrameId,
        shouldCancelToken: true
      }).then(response => {
        let questionId = response.questionId
        let segmentationList = response.segmentationList
        
        // 無結果
        if (segmentationList[0].denotation === 'NO_ANSWER') {
          this.$store.commit('result/updateCurrentResultInfo', null)
          this.layout = 'EmptyResult'
          this.resultInfo = {
            title: this.segmentation.errorCategory,
            description: this.segmentation.errorMessage
          }
          this.$emit('update:isLoading', false)
          this.$emit('update:isAddable', null)
          return false
        }

        // 一個結果
        if (segmentationList.length === 1) {
          this.segmentation = segmentationList[0]
          this.$store.dispatch('chatBot/askResult', {
            questionId,
            segmentation: this.segmentation,
            // TODO: 處理 filter, drill down
            restrictions: null,
            selectedColumnList: null
          })
            .then(res => this.getComponentV2(res.resultId))
            .catch((error) => {})
        } else {
          // 多個結果
          this.$store.commit('dataSource/setAppQuestion', null)
          this.layout = 'MultiResultV2'
          this.resultInfo = {...response, question: question}
          this.$emit('update:isLoading', false)
          this.$emit('update:isAddable', null)
        }
      }).catch((error) => {
        this.$emit('update:isLoading', false)
        this.$emit('update:isAddable', null)
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
                keyResultId: componentResponse.componentIds.key_result[0],
                dataColumns: componentResponse.segmentationPayload.transcript.subjectList.map(item => ({
                  columnId: item.dataColumn.dataColumnId,
                  statsType: item.dataColumn.statsType,
                  dataType: item.dataColumn.dataType
                })),
                segmentation: componentResponse.segmentationPayload,
                question: componentResponse.segmentationPayload.sentence.reduce((acc, cur) => acc + cur.word, ''),
                questionId: componentResponse.questionId,
                dataSourceId: this.dataSourceId,
                dataFrameId: this.dataFrameId
              })
              this.$emit('update:isAddable', componentResponse.layout === 'general' || false)
              this.$emit('update:isLoading', false)
              break
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              this.resultInfo = { description: componentResponse.errorMessage }
              this.layout = 'EmptyResult'
              this.$store.commit('result/updateCurrentResultId', null)
              this.$store.commit('result/updateCurrentResultInfo', null)
              this.$emit('update:isAddable', null)
              this.$emit('update:isLoading', false)
              break
          }
        }).catch((error) => {
          this.$emit('update:isAddable', null)
          this.$emit('update:isLoading', false)
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
    margin-bottom: 40px;
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

  &__empty-message {
    display: flex;
    align-items: center;
    margin-top: 30px;
    background: rgba(255,223,111,0.08);
    color: #FFDF6F;
    font-size: 14px;
    text-align: left;
    padding: 8px 14px;
    .icon {
      font-size: 20px;
      margin-right: 5px;
    }
  }
}
</style>