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
              :is-show-coefficients="segmentation && segmentation.denotation === 'STABILITY'"
              :is-show-donwnload-btn="false"
              :is-show-toolbox="false"
              :anomaly-setting="anomalySetting"
              intend="key_result"
              @setDiagram="$emit('setDiagram', $event)"
              @setConfig="setConfig($event)"
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
      <div 
        v-if="computedKeyResultId && isNeededDisplaySetting && currentComponent.algoConfig"
        class="key-result__setting display-setting">
        <div class="display-setting__title">{{ $t('miniApp.displaySetting') }}</div>
        <div class="display-setting__content">
          <div class="display-setting__item-box">
            <div class="display-setting__item item">
              <div class="item__label">{{ $t('miniApp.standardLine') }}</div>
              <default-select
                v-model="currentComponent.algoConfig.standardLineType"
                :option-list="standardLineTypeOptionList"
                :placeholder="$t('miniApp.chooseStandardLine')"
                class="input item__input"
              />
            </div>
            <div 
              v-if="segmentation.denotation === 'ANOMALY'"
              class="display-setting__item item">
              <div class="item__label">{{ $t('miniApp.stddevTimes') }}</div>
              <default-select
                v-model="currentComponent.algoConfig.stddevTimes"
                :option-list="stddevTimesOptionList"
                :placeholder="$t('miniApp.chooseStddevTimes')"
                class="input item__input"
              />
            </div>
          </div>
          <div class="display-setting__button-box">
            <button 
              class="btn btn-default display-setting__button" 
              @click="saveChartSetting(true)"
            >
              {{ $t('button.change') }}
            </button>
          </div>
        </div>
      </div>
      <!--異常標記設定-->
      <form 
        v-if="computedKeyResultId && isShowAnomalySetting"
        data-vv-scope="anomaly"
        class="key-result__setting anomaly"
        @submit.prevent="saveAnomalySetting">
        <div class="anomaly__title">{{ $t('miniApp.anomalySetting') }}</div>
        <div class="anomaly__content">
          <div class="anomaly__content-title">{{ $t('miniApp.anomalyRules') }}</div>
          <div class="anomaly__settings">
            <div class="anomaly__settings--top">
              <div
                v-if="tempComponentAnomalySettings.length === 0" 
                class="anomaly__empty-message">{{ $t('miniApp.emptyRules') }}</div>
              <div
                v-for="setting in tempComponentAnomalySettings"
                v-else
                :key="setting.id"
                class="anomaly__setting-item threshold"
              >
                <div class="threshold--left">
                  <default-select
                    v-model="setting.comparison"
                    :option-list="anomalyOptionList"
                    class="input threshold__select"
                  />
                  <input-verify
                    v-validate="'decimal|required'"
                    v-model.trim="setting.value"
                    :placeholder="$t('miniApp.datumValue')"
                    :name="'anomaly.' + setting.id + '-componentDisplayName'"
                    class="threshold__input"
                  />
                </div>
                <div 
                  class="threshold--right" 
                  @click="removeSetting(setting.id)">
                  <svg-icon
                    icon-class="delete"
                    class="icon threshold__delete-icon" 
                  />
                </div>
              </div>
            </div>
            <div class="anomaly__settings--bottom">
              <button 
                v-if="tempComponentAnomalySettings.length < 2"
                type="button" 
                class="btn btn-outline"
                @click="createAnomolyNewRule"
              >{{ $t('button.createNewRule') }}</button>
              <button
                v-if="isAnomalySettingChanged"
                type="submit"
                class="btn btn-default anomaly__button" 
              >{{ $t('button.applyToChart') }}</button>
            </div>
          </div>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getDateTimeColumns } from '@/API/DataSource'
import DefaultSelect from '@/components/select/DefaultSelect'
import InputVerify from '@/components/InputVerify'
import { algoConfig } from '@/utils/general'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { formatAnomalySetting } from '@/components/display/common/addons'

export default {
  name: 'DashboardComponent',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputVerify
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
      algoConfig,
      standardLineTypeOptionList: [
        {
          value: 'MEDIAN',
          name: this.$t('chart.feature.median')
        },
        {
          value: 'MEAN',
          name: this.$t('chart.feature.mean')
        }
      ],
      stddevTimesOptionList: [
        {
          value: '2',
          name: 2
        },
        {
          value: '3',
          name: 3
        }
      ],
      isShowAnomalySetting: false,
      anomalyOptionList: [
        {
          value: 'gt',
          name: this.$t('miniApp.greaterThan')
        },
        {
          value: 'gte',
          name: this.$t('miniApp.greaterThanAndEqualTo')
        },
        {
          value: 'equal',
          name: this.$t('miniApp.equalTo')
        },
        {
          value: 'lte',
          name: this.$t('miniApp.lessThanAndEqualTo')
        },
        {
          value: 'lt',
          name: this.$t('miniApp.lessThan')
        }
      ],
      anomalySetting: null,
      tempComponentAnomalySettings: []
    }
  },
  computed: {
    ...mapState('dataSource', ['dataSourceId', 'dataFrameId', 'appQuestion', 'currentQuestionInfo', 'currentQuestionId']),
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
    isNeededDisplaySetting () {
      return this.segmentation && (this.segmentation.denotation === 'STABILITY' || this.segmentation.denotation === 'ANOMALY')
    },
    isAnomalySettingChanged () {
      if (!this.computedKeyResultId || !this.isShowAnomalySetting) return
      let tempSetting = this.tempComponentAnomalySettings ? [...this.tempComponentAnomalySettings] : []
      let tempCurrentSetting = this.currentComponent.anomalySettings ? [...this.currentComponent.anomalySettings] : []
      if (tempSetting.length !== tempCurrentSetting.length) return true
      tempSetting = tempSetting.sort((a, b) => a.value - b.value)
      tempCurrentSetting  = tempCurrentSetting.sort((a, b) => a.value - b.value)
      for (let i = 0; i < tempSetting.length; i++) {
        if (
          (tempSetting[i].comparison !== tempCurrentSetting[i].comparison)
          || (tempSetting[i].value !== tempCurrentSetting[i].value)
        )  return true
      }
      return false
    }
  },
  watch: {
    appQuestion (question) {
      if (!question) return
      this.resetComponent()
      this.askQuestion(question)
    }
  },
  mounted () {
    this.resetAnomalySetting()
    if (this.currentComponent.keyResultId) {
      this.tempComponentAnomalySettings = JSON.parse(JSON.stringify(this.currentComponent.anomalySettings || []))
      if (this.currentComponent.anomalySettings && this.currentComponent.anomalySettings.length > 0) {
        this.anomalySetting.yAxis = {
          ...this.anomalySetting.yAxis,
          ...formatAnomalySetting(this.tempComponentAnomalySettings)
        }
      }
      this.askQuestion(this.currentComponent.question)
    }
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
      this.isShowAnomalySetting = false
      this.$store.dispatch('chatBot/askQuestion', {
        question,
        dataSourceId: this.currentComponent.dataSourceId || this.dataSourceId,
        dataFrameId: this.currentComponent.dataFrameId || this.dataFrameId,
        shouldCancelToken: true,
        // 編輯模式下帶入當初問問句使用的 parser 語系；新創時走原本流程（拿當前 store 中的語系）
        language: this.currentComponent.init && this.currentComponent.parserLanguage
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
                questionId: response.questionId,
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
    askResult (selectedResultSegmentationInfo, questionId, isSetAlgoConfig) {
      this.$emit('update:isLoading', true)
      if (selectedResultSegmentationInfo) this.segmentation = selectedResultSegmentationInfo

      // 初次創建時，預設元件名稱為使用者輸入的問句
      if (!this.currentComponent.init) {
        this.currentComponent.config.diaplayedName = this.segmentation.sentence.reduce((acc, cur) =>  acc += ` ${cur.matchedWord}`, '')
      }

      // 確認是否為趨勢類型問題
      const isTrendQuestion = this.segmentation.denotation === 'TREND'
      let dateTimeColumn = this.segmentation.transcript.subjectList.find(subject => subject.dateTime)
      return this.$store.dispatch('chatBot/askResult', {
        algoConfig: isSetAlgoConfig ? this.currentComponent.algoConfig || null : null,
        questionId: questionId || this.currentQuestionId,
        segmentation: this.segmentation,
        restrictions: this.restrictions(),
        selectedColumnList: null,
        isFilter: true,
        ...(isTrendQuestion && {
          displayConfig: {
            histogramBarSize: null,
            sortOrders: dateTimeColumn ? [
              {
                dataColumnId: dateTimeColumn.dateTime.dataColumn.dataColumnId,
                sortType: 'DESC'
              }
            ] : []
          }
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
              // 初次創建時，預設元件名稱為使用者輸入的問句
              if (!this.currentComponent.keyResultId) this.currentComponent.config.diaplayedName = this.appQuestion
              this.currentComponent.keyResultId = componentResponse.id
              this.currentComponent.isIndexTypeAvailable = componentResponse.isIndexTypeComponent
              this.currentComponent.isTextTypeAvailable = this.checkIsTextTypeAvailable(componentResponse.transcript)
              this.question = this.composeComponentQuestion(componentResponse.segmentationPayload.sentence),
              this.$store.commit('result/updateCurrentResultId', resultId)
              // data columns 重新處理是因為 ask question 取得的是建議的句子切法
              // 最終切法和辨別結果要以 get component list 為主
              this.$store.commit('result/updateCurrentResultInfo', {
                keyResultId: componentResponse.componentIds.key_result[0],
                dataColumns: this.getDataColumnlist(componentResponse.segmentationPayload.transcript.subjectList),
                segmentation: componentResponse.segmentationPayload,
                question: this.composeComponentQuestion(componentResponse.segmentationPayload.sentence),
                questionId: componentResponse.questionId,
                dataSourceId: this.dataSourceId,
                dataFrameId: componentResponse.segmentationPayload.transcript.dataFrame.dataFrameId,
                dateTimeColumn: this.mainDateColumn
              })
            
              if (this.isNeededDisplaySetting) {
                this.currentComponent.algoConfig = this.currentComponent.algoConfig || this.algoConfig[componentResponse.intent.toLowerCase()]
              } else {
                this.currentComponent.algoConfig = null
              }
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
    composeComponentQuestion (sentence) {
      const regex = /^[A-Za-z0-9]/
      return sentence.reduce((acc, cur, index) => {
          return (regex.test(cur.word) && index > 0) ? `${acc} ${cur.word}` : `${acc}${cur.word}`
        }, '')
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
          columnList.forEach(column => { if (!acc['dataColumnId-' + column.dataColumnId]) acc['dataColumnId-' + column.dataColumnId] = column })
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
        .filter(filter => this.checkShouldApplyMiniAppFilter(filter, this.mainDateColumn))
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
      this.resetAnomalySetting()
      this.currentComponent.anomalySettings = []
      this.switchComponentType('chart')
      this.currentComponent.indexInfo = { 
        unit: ''
      }
      this.currentComponent.config.fontSize = 'middle'
    },
    saveChartSetting (isSetAlgoConfig) {
      this.askResult(this.segmentation, this.questionInfo.questionId, isSetAlgoConfig)
    },
    saveAnomalySetting () {
      this.$validator.validateAll('anomaly')
        .then(valid => {
          if (!valid) return
          this.resetAnomalySetting()
  
          // 確保 input 字串轉為數值
          this.tempComponentAnomalySettings = this.tempComponentAnomalySettings.map(setting => ({
            ...setting,
            value: parseFloat(setting.value)
          }))

          // 將暫存儲存回 component data 當中
          this.currentComponent.anomalySettings = JSON.parse(JSON.stringify(this.tempComponentAnomalySettings))

          // 如果有設定，則轉換成上下線及射線的格式
          if (this.tempComponentAnomalySettings && this.tempComponentAnomalySettings.length > 0) {
            this.anomalySetting.yAxis = formatAnomalySetting(this.tempComponentAnomalySettings)
          }
          this.saveChartSetting(false)
        })
    },
    setConfig (configData) {
      const { supportedFunction = {} } = configData
      this.isShowAnomalySetting = supportedFunction.enableAnomalySetting
      this.$emit('setConfig', configData)
    },
    createAnomolyNewRule () {
      this.tempComponentAnomalySettings.push({
        id: uuidv4(),
        comparison: 'gt',
        value: null
      })
    },
    removeSetting(settingId) {
      this.tempComponentAnomalySettings = this.tempComponentAnomalySettings.filter(setting => setting.id !== settingId)
    },
    resetAnomalySetting () {
      this.anomalySetting = {
        xAxis: {
          upperLimit: null,
          lowerLimit: null,
          markLine: null
        },
        yAxis: {
          upperLimit: null,
          lowerLimit: null,
          markLine: null
        }
      }
    },
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

  .display-setting {

    &__title {
      margin-bottom: 8px;
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
    }

    &__content {
      display: flex;
      flex-direction: row;
      background: #1C292B;
      border: 2px solid transparent;
      border-radius: 12px;
      padding: 18.5px;
    }

    &__item-box {
      display: flex;
      flex-direction: column;
    }
    
    &__item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 6px 0;
    }

    .item {
      &__label {
        margin-right: 9px;
        width: 80px;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        color: #CCCCCC;
      }

      &__input {
        width: 200px;
      }
    }

    &__button-box {
      display: flex;
      flex-direction: column;
      padding: 6px 0;
    }

    &__button {
      margin-top: auto;
      margin-left: 16px;
      height: 30px;
      min-width: 50px;
    }
  }

  .anomaly {
    &__title {
      font-weight: 600;
      font-size: 18px;
      line-height: 25px;
      color: #FFFFFF;
    }

    &__content {
      background: #1C292B;
      border-radius: 12px;
      padding: 18.5px;
      display: flex;
    }

    &__content-title {
      font-weight: 600;
      font-size: 14px;
      color: #AAAAAA;
      margin-right: 33px;
    }

    &__settings {
      display: flex;
      flex-direction: column;
      flex: 1;

      &--top {
        display: flex;
        margin-bottom: 16px;
      }
    }

    &__setting-item {
      &:not(:last-of-type) {
        margin-right: 16px;
      }
    }

    &__empty-message {
      color: #AAAAAA;
      font-size: 14px;
    }

    .threshold {
      display: flex;
      width: 50%;
      background: #141C1D;
      border-radius: 8px;
      padding: 18px 20px;
      justify-content: space-between;

      &--left {
        display: flex;
      }
      
      &__select {
        height: 40px;
        border-bottom: 1px solid #FFFFFF;
        max-width: 115px;
        margin-right: 16px;
      }

      &__input {
        width: 135px;
        /deep/ .input-verify-text {
          margin-bottom: 12px;
        }
        /deep/ .input-error {
          margin-bottom: -20px;
        }
      }

      &__delete-icon {
        cursor: pointer;
        color: #AAAAAA;
      }
    }
  }
}
</style>