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
        <div class="key-result__switch-wrapper">
          <div 
            :class="{ 'active': currentComponent.type === 'chart' || currentComponent.type === 'paramCompare' }"
            class="key-result__switch" 
            @click="switchComponentType('chart')" >
            <svg-icon 
              class="icon" 
              icon-class="check-circle" />
            {{ $t('miniApp.displayChart') }}
          </div>
          <div 
            v-if="currentComponent.isIndexTypeAvailable" 
            :class="{ 'active': currentComponent.type === 'index' }" 
            class="key-result__switch"
            @click="switchComponentType('index')">
            <svg-icon 
              class="icon" 
              icon-class="check-circle" />
            {{ $t('miniApp.displayIndex') }}
          </div>
          <div 
            v-if="currentComponent.isTextTypeAvailable" 
            :class="{ 'active': currentComponent.type === 'text' }" 
            class="key-result__switch"
            @click="switchComponentType('text')" >
            <svg-icon 
              class="icon" 
              icon-class="check-circle" />
            {{ $t('miniApp.displayText') }}
          </div>
        </div>
        <div 
          v-show="currentComponent.type === 'chart' || currentComponent.type === 'paramCompare'" 
          class="key-result__card card"
        >
          <div class="card__content">
            <task
              :key="'chart-' + computedKeyResultId"
              :component-id="computedKeyResultId"
              :is-show-description="false"
              :is-show-coefficients="false"
              :is-show-donwnload-btn="false"
              :is-show-toolbox="false"
              intend="key_result"
              @setDiagram="$emit('setDiagram', $event)"
            />
          </div>
        </div>
        <div
          v-show="currentComponent.type === 'index'" 
          class="key-result__card card"
        >
          <div class="card__content">
            <div class="setting">
              <div class="setting__label">{{ $t('miniApp.index') }}</div>
              <task
                :key="'index-' + computedKeyResultId"
                :component-id="computedKeyResultId"
                :converted-type="'index_info'"
                class="setting__input"
                intend="key_result"
              />
            </div>
            <div class="setting">
              <div class="setting__label">{{ $t('miniApp.displayedUnit') }}</div>
              <input
                :disabled="isLoading"
                v-model.trim="currentComponent.indexInfo.unit"
                :placeholder="$t('miniApp.pleaseEnterUnitName')"
                class="input setting__input"
              >
            </div>
          </div>
        </div>
        <!--Text Type Component-->
        <div
          v-show="currentComponent.type === 'text'" 
          class="key-result__card card"
        >
          <div class="card__content">
            <task
              :key="'text-' + computedKeyResultId"
              :component-id="computedKeyResultId"
              :converted-type="'text_info'"
              intend="key_result"
            />
          </div>
        </div>
      </div>
      <!-- 其餘狀況 MultiResult, NoResult, ErrorMessage -->
      <component
        v-else
        :is="layout || 'EmptyResult'"
        :key="appQuestion"
        :result-info="resultInfo"
        :redirect-on-select="false"
        @select-result="askResult($event)"
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
import { getDateTimeColumns } from '@/API/DataSource'
import DefaultSelect from '@/components/select/DefaultSelect'
import moment from 'moment'

export default {
  components: {
    DefaultSelect
  },
  props: {
    currentComponent: {
      type: Object,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isAddable: {
      type: Boolean,
      default: null
    },
    filters: {
      type: Array,
      default: () => []
    },
    controls: {
      type: Array,
      default: () => []
    },
  },
  data () {
    return {
      questionInfo: null,
      resultInfo: null,
      layout: '',
      timeoutFunction: null,
      totalSec: 50,
      periodSec: 200,
      question: '',
      segmentation: null,
      mainDateColumn: null,
    }
  },
  computed: {
    ...mapState('dataSource', ['dataSourceId', 'dataFrameId', 'appQuestion', 'currentQuestionInfo', 'currentQuestionId', 'algoConfig']),
    ...mapGetters('dataSource', ['filterRestrictionList']),
    computedKeyResultId () {
      return (this.resultInfo && this.resultInfo.key_result && this.resultInfo.key_result[0])
    },
    computedQuestion () {
      return this.question || this.currentComponent.question
    },
    isShowKeyResultContent () {
      return this.computedKeyResultId || this.layout
    },
    allFilterList () {
      // 可能會有階層，因此需要完全攤平
      return [].concat.apply([], [...this.filters, ...this.controls])
    },
  },
  watch: {
    appQuestion (question) {
      if (!question) return
      this.resetComponent()
      this.askQuestion(question)
    }
  },
  mounted () {
    if (this.currentComponent.keyResultId) this.askQuestion(this.currentComponent.question)
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
  },
  methods: {
    checkIsTextTypeAvailable (transcript) {
      // 以下需確保問句中只帶有一個 category 欄位
      const isSingleSubject = transcript.subjectList && transcript.subjectList.length === 1
      const isSingleCategoryDataColumn = transcript.subjectList[0].categoryDataColumnList && transcript.subjectList[0].categoryDataColumnList.length === 1
      const haveSameDataColumn = isSingleCategoryDataColumn && transcript.subjectList[0].categoryDataColumnList[0].dataColumnId === transcript.subjectList[0].dataColumn.dataColumnId
      // 確保不是該 category 欄位中的值，因為他會被視為該欄位下的 filter 條件
      const isEmptyFilterList = transcript.subjectList[0].filterList === null
      return isSingleSubject && isEmptyFilterList && isSingleCategoryDataColumn && haveSameDataColumn 
    },
    askQuestion (question) {
      this.$store.commit('result/updateCurrentResultInfo', null)
      // 關閉介紹資料集
      this.closePreviewDataSource()
      // 恢復新增元件的狀態
      this.$emit('update:isAddable', null)
      this.$emit('update:isLoading', true)
      this.totalSec = 50
      this.periodSec = 200
      this.resultInfo = null
      this.layout = ''
      this.$store.dispatch('chatBot/askQuestion', {
        question,
        dataSourceId: this.currentComponent.dataSourceId || this.dataSourceId,
        dataFrameId: this.currentComponent.dataFrameId || this.dataFrameId,
        shouldCancelToken: true
      }).then(response => {
        let questionId = response.questionId
        let segmentationList = response.segmentationList
        
        // 無結果
        if (segmentationList[0].denotation === 'NO_ANSWER') {
          this.segmentation = segmentationList[0]
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
          // 取得 dataframe 預設日期欄位資訊
          getDateTimeColumns(this.segmentation.transcript.dataFrame.dataFrameId)
            .then(columnList => {
              this.mainDateColumn = columnList.find(column => column.isDefault)

              // 存取問句結果讓 restriction 使用
              this.questionInfo = {
                dataFrameId: segmentationList[0].transcript.dataFrame.dataFrameId,
                dataColumns: this.getDataColumnlist(segmentationList[0].transcript.subjectList)
              }
              return this.askResult(null, questionId)
            })
            .then(res => this.getComponentV2(res.resultId))
            .catch((error) => {})
        } else {
          // 多個結果
          this.$store.commit('dataSource/setAppQuestion', null)
          this.$store.commit('dataSource/setCurrentQuestionId', response.questionId)
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
    },
    askResult (selectedResultSegmentationInfo, questionId) {
      this.$emit('update:isLoading', true)
      const segmentation = this.segmentation || selectedResultSegmentationInfo

      // 初次創建時，預設元件名稱為使用者輸入的問句
      if (!this.currentComponent.init) {
        this.currentComponent.config.diaplayedName = segmentation.sentence.reduce((acc, cur) =>  acc += ` ${cur.matchedWord}`, '')
      }
      
      // 確認是否為趨勢類型問題
      const isTrendQuestion = segmentation.denotation === 'TREND'
      return this.$store.dispatch('chatBot/askResult', {
        questionId: questionId || this.currentQuestionId,
        algoConfig: this.algoConfig[segmentation.denotation.toLowerCase()] || null,
        segmentation,
        restrictions: this.restrictions(),
        selectedColumnList: null,
        isFilter: true,
        ...(isTrendQuestion && {
          sortOrders: [
            {
              dataColumnId: this.segmentation.transcript.subjectList.find(subject => subject.dateTime).dateTime.dataColumn.dataColumnId,
              sortType: 'DESC'
            }
          ]
        })
      })
      .then(res => this.getComponentV2(res.resultId))
      .catch(error => {})
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
              this.currentComponent.isIndexTypeAvailable = componentResponse.isIndexTypeComponent
              this.currentComponent.isTextTypeAvailable = this.checkIsTextTypeAvailable(componentResponse.transcript)
              this.question = componentResponse.segmentationPayload.sentence.reduce((acc, cur) => acc + cur.word, '')
              this.$store.commit('result/updateCurrentResultId', resultId)

              // data columns 重新處理是因為 ask question 取得的是建議的句子切法
              // 最終切法和辨別結果要以 get component list 為主
              this.$store.commit('result/updateCurrentResultInfo', {
                keyResultId: componentResponse.componentIds.key_result[0],
                dataColumns: this.getDataColumnlist(componentResponse.segmentationPayload.transcript.subjectList),
                segmentation: componentResponse.segmentationPayload,
                question: componentResponse.segmentationPayload.sentence.reduce((acc, cur) => `${acc} ${cur.word}`, ''),
                questionId: componentResponse.questionId,
                dataSourceId: this.dataSourceId,
                dataFrameId: componentResponse.segmentationPayload.transcript.dataFrame.dataFrameId,
                dateTimeColumn: this.mainDateColumn
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
          // this.hasError = true
          if (error.message !== 'cancel') this.resultInfo = null
        })
    },
    getDataColumnlist (subjectList) {
      return subjectList
        .filter(item => item.dataColumn || item.categoryDataColumnList || item.filterList || item.dateTime)
        .reduce((acc, cur, index, filteredSubjectList) => {
          // 匯集所有欄位
          const columnList = [
            ...(cur.categoryDataColumnList || []),
            ...(cur.dataColumn !== null && [cur.dataColumn]),
            ...(cur.filterList !== null && cur.filterList.map(filter => filter.dataColumn) || []),
            ...(cur.dateTime !== null && [cur.dateTime.dataColumn])
          ]
          // 將不重複的欄位存起來
          columnList.forEach(column => { if (!acc[column.dataColumnId]) acc[column.dataColumnId] = column })
          // 最後一筆時，回傳所有不重複的欄位清單
          return index === filteredSubjectList.length - 1 ? Object.keys(acc).map(key => acc[key]) : acc
        }, {})
        .map((item, index, list) => ({
          columnId: item.dataColumnId,
          columnName: item.dataColumnAlias,
          statsType: item.statsType,
          dataType: item.dataType
        }))
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
    },
    switchComponentType (type) {
      this.currentComponent.type = type
    },
    includeSameColumnPrimaryAliasFilter (filterName) {
      return this.questionInfo.dataColumns.find(column => column.columnName === filterName)
    },
    restrictions () {
      return this.allFilterList
        .filter(filter => {
          // 相對時間有全選的情境，不需帶入限制中
          if (filter.statsType === 'RELATIVEDATETIME') return filter.dataValues.length > 0 && filter.dataValues[0] !== 'unset'

          // 時間欄位要有開始和結束時間// 只處理相同 datafram 或欄位名稱相同的 filter
          // if (this.questionInfo.dataFrameId !== filter.dataFrameId && !this.includeSameColumnPrimaryAliasFilter(filter.columnName)) return false
          if (
            filter.statsType === 'NUMERIC'
            || filter.statsType === 'FLOAT'
            || filter.statsType === 'DATETIME'
          ) return filter.start && filter.end
          // filter 必須有值
          if (filter.statsType === 'CATEGORY') return filter.dataValues.length > 0
          return false
        })
        .map(filter => {
          let type = ''
          let data_type = ''
          switch (filter.statsType) {
            case ('STRING'):
            case ('BOOLEAN'):
            case ('CATEGORY'):
              data_type = 'string'
              type = 'enum'
              break
            case ('FLOAT'):
            case ('NUMERIC'):
              data_type = 'int'
              type = 'range'
              break
            case ('DATETIME'):
            case ('RELATIVEDATETIME'):
              data_type = 'datetime'
              type = 'range'
              break  
          }

          // 相對時間 filter 需取當前元件所屬 dataframe 的預設時間欄位和當前時間來套用
          if (filter.statsType === 'RELATIVEDATETIME') return [{
            type,
            properties: {
              data_type,
              dc_id: this.mainDateColumn.dataColumnId,
              display_name: this.mainDateColumn.dataColumnPrimaryAlias,
              ...this.formatRelativeDatetime(filter.dataValues[0])
            }
          }]

          return [{
            type,
            properties: {
              data_type,
              dc_id: filter.columnId,
              display_name: filter.columnName,
              ...((filter.statsType === 'STRING' || filter.statsType === 'BOOLEAN' || filter.statsType === 'CATEGORY')  && {
                datavalues: filter.dataValues,
                display_datavalues: filter.dataValues
              }),
              ...((filter.statsType === 'NUMERIC' || filter.statsType === 'FLOAT' || filter.statsType === 'DATETIME') && {
                start: filter.start,
                end: filter.end
              }),
            }
          }]
        })
    },
    formatRelativeDatetime (dataValue) {
      const properties = {
        start: null,
        end: null
      }
      
      // update datetime range
      if (dataValue === 'today') {
        properties.start = moment().startOf('day').format('YYYY-MM-DD HH:mm')
        properties.end = moment().endOf('day').format('YYYY-MM-DD HH:mm')
      } else if (RegExp('^.*hour.*$').test(dataValue)) {
        const hour = Number(dataValue.split('hour')[0])
        properties.start = moment().subtract(hour, 'hours').format('YYYY-MM-DD HH:mm')
        properties.end = moment().format('YYYY-MM-DD HH:mm')
      } else {
        properties.start = null
        properties.end = null
      }

      return properties
    },
    resetComponent () {
      this.switchComponentType('chart')
      this.currentComponent.indexInfo = { 
        unit: ''
      }
      this.currentComponent.config.fontSize = 'middle'
    }
  }
}
</script>

<style lang="scss" scoped>
.key-result {
  padding: 24px;
  &__question {
    font-size: 18px;
    margin-bottom: 18px;
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

  &__switch-wrapper {
    display: flex;
    margin-bottom: 16px;
  }

  &__switch {
    background: #1C292B;
    border-radius: 12px;
    border: 2px solid #1C292B;
    color: #6C7678;
    font-weight: 600;
    font-size: 14px;
    padding: 8px 16px;
    cursor: pointer;

    &.active {
      color: #2AD2E2;
      border: 2px solid #2AD2E2;
    }

    &:not(:last-of-type) {
      margin-right: 8px;
    }
  }

  &__card {
    &:not(:last-of-type) {
      margin-bottom: 16px;
    }
  }

  .card {
    background: #1C292B;
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 18.5px;
    cursor: pointer;

    &__content {
      display: flex;
    }
    
    .setting {
      &__label {
        font-size: 14px;
        color: #AAAAAA;
      }
      &__input {
        height: 39px;
        font-size: 16px;
        border-color: #FFFFFF;

        &::placeholder {
          color: #AAAAAA;
        }
        /deep/ .el-input__inner {
          padding-left: 0;
        }
      }

      &:not(:last-of-type) {
        margin-right: 100px;
      }
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