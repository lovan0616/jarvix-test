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
      <unknown-info-block
        v-if="segmentationInfo.unknownToken.length > 0 && computedKeyResultId"
        :segmentation-info="segmentationInfo"
        @close="closeUnknowInfoBlock"
      />

      <div
        v-if="computedKeyResultId"
        class="key-result__content"
      >
        <div class="key-result__question">
          <span class="question-mark">Q</span>
          {{ computedQuestion }}
        </div>
        <div class="key-result__switch-wrapper">
          <div
            :class="{
              active:
                currentComponent.type === 'chart' ||
                currentComponent.type === 'paramCompare',
            }"
            class="key-result__switch"
            @click="switchComponentType('chart')"
          >
            <svg-icon
              class="icon"
              icon-class="check-circle"
            />
            {{ $t("miniApp.displayChart") }}
          </div>
          <div
            v-if="currentComponent.isIndexTypeAvailable"
            :class="{ active: currentComponent.type === 'index' }"
            class="key-result__switch"
            @click="switchComponentType('index')"
          >
            <svg-icon
              class="icon"
              icon-class="check-circle"
            />
            {{ $t("miniApp.displayIndex") }}
          </div>
          <div
            v-if="currentComponent.isTextTypeAvailable"
            :class="{ active: currentComponent.type === 'text' }"
            class="key-result__switch"
            @click="switchComponentType('text')"
          >
            <svg-icon
              class="icon"
              icon-class="check-circle"
            />
            {{ $t("miniApp.displayText") }}
          </div>
        </div>
        <div
          v-show="
            currentComponent.type === 'chart' ||
              currentComponent.type === 'paramCompare'
          "
          class="key-result__card card"
        >
          <div class="card__content">
            <task
              :key="'chart-' + computedKeyResultId"
              :component-id="computedKeyResultId"
              :is-show-description="false"
              :is-show-coefficients="
                segmentation && segmentation.denotation === 'STABILITY'
              "
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
              <div class="setting__label">
                {{ $t("miniApp.index") }}
              </div>
              <task
                :key="'index-' + computedKeyResultId"
                :component-id="computedKeyResultId"
                :converted-type="'index_info'"
                class="setting__input"
                intend="key_result"
              />
            </div>
            <div class="setting">
              <div class="setting__label">
                {{ $t("miniApp.displayedUnit") }}
              </div>
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
        />{{
          $t("miniApp.componentNotAddable")
        }}
      </div>
      <div
        v-if="
          computedKeyResultId &&
            isNeededDisplaySetting &&
            currentComponent.algoConfig
        "
        class="key-result__setting display-setting"
      >
        <div class="display-setting__title">
          {{ $t("miniApp.displaySetting") }}
        </div>
        <div class="display-setting__content">
          <div class="display-setting__item-box">
            <div class="display-setting__item item">
              <div class="item__label">
                {{ $t("miniApp.standardLine") }}
              </div>
              <default-select
                v-model="currentComponent.algoConfig.standardLineType"
                :option-list="standardLineTypeOptionList"
                :placeholder="$t('miniApp.chooseStandardLine')"
                class="input item__input"
              />
            </div>
            <div
              v-if="segmentation.denotation === 'ANOMALY'"
              class="display-setting__item item"
            >
              <div class="item__label">
                {{ $t("miniApp.stddevTimes") }}
              </div>
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
              {{ $t("button.change") }}
            </button>
          </div>
        </div>
      </div>
      <!--異常標記設定-->
      <form
        v-if="computedKeyResultId && isShowAnomalySetting"
        data-vv-scope="anomaly"
        class="key-result__setting anomaly"
        @submit.prevent="saveAnomalySetting"
      >
        <div class="anomaly__title">
          {{ $t("miniApp.anomalySetting") }}
        </div>
        <div class="anomaly__content">
          <div class="anomaly__content-title">
            {{ $t("miniApp.anomalyRules") }}
          </div>
          <div class="anomaly__settings">
            <div class="anomaly__settings--top">
              <div
                v-if="tempComponentAnomalySettings.length === 0"
                class="anomaly__empty-message"
              >
                {{ $t("miniApp.emptyRules") }}
              </div>
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
                  @click="removeSetting(setting.id)"
                >
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
              >
                {{ $t("button.createNewRule") }}
              </button>
              <button
                v-if="isAnomalySettingChanged"
                type="submit"
                class="btn btn-default anomaly__button"
              >
                {{ $t("button.applyToChart") }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </template>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { getDateTimeColumns } from '@/API/DataSource'
import UnknownInfoBlock from '@/components/resultBoard/UnknownInfoBlock'
import DefaultSelect from '@/components/select/DefaultSelect'
import InputVerify from '@/components/InputVerify'
import { algoConfig } from '@/utils/general'
import { v4 as uuidv4 } from 'uuid'
import { formatAnomalySetting } from '@/components/display/common/addons'

export default {
  name: 'DashboardComponent',
  inject: ['$validator', 'computeRestrictions', 'computeSelectedColumns'],
  components: {
    DefaultSelect,
    InputVerify,
    UnknownInfoBlock
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
    }
  },
  data () {
    return {
      questionInfo: null,
      resultInfo: null,
      layout: null,
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
      tempComponentAnomalySettings: [],
      segmentationInfo: {
        question: '',
        unknownToken: []
      }
    }
  },
  computed: {
    ...mapState('dataSource', [
      'dataSourceId',
      'dataFrameId',
      'appQuestion',
      'currentQuestionInfo',
      'currentQuestionId',
      'isManuallyTriggeredAskQuestion'
    ]),
    ...mapGetters('dataFrameAdvanceSetting', ['selectedColumnList', 'filterRestrictionList']),
    computedKeyResultId () {
      return (
        this.resultInfo &&
        this.resultInfo.key_result &&
        this.resultInfo.key_result[0]
      )
    },
    computedQuestion () {
      return this.question || this.currentComponent.question
    },
    isShowKeyResultContent () {
      return this.computedKeyResultId || this.layout
    },
    isNeededDisplaySetting () {
      return (
        this.segmentation &&
        (this.segmentation.denotation === 'STABILITY' ||
          this.segmentation.denotation === 'ANOMALY')
      )
    },
    isAnomalySettingChanged () {
      if (!this.computedKeyResultId || !this.isShowAnomalySetting) return
      let tempSetting = this.tempComponentAnomalySettings
        ? [...this.tempComponentAnomalySettings]
        : []
      let tempCurrentSetting = this.currentComponent.anomalySettings
        ? [...this.currentComponent.anomalySettings]
        : []
      if (tempSetting.length !== tempCurrentSetting.length) return true
      tempSetting = tempSetting.sort((a, b) => a.value - b.value)
      tempCurrentSetting = tempCurrentSetting.sort((a, b) => a.value - b.value)
      for (let i = 0; i < tempSetting.length; i++) {
        if (
          tempSetting[i].comparison !== tempCurrentSetting[i].comparison ||
          tempSetting[i].value !== tempCurrentSetting[i].value
        ) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    isManuallyTriggeredAskQuestion (isTriggered) {
      if (!isTriggered) return
      this.resetComponent()
      this.askQuestion(this.appQuestion)
      this.setIsManuallyTriggeredAskQuestion(false)
    },
    selectedColumnList: {
      deep: true,
      handler () {
        console.log('a')
        if (this.appQuestion) this.setIsManuallyTriggeredAskQuestion(true)
      }
    },
    filterRestrictionList: {
      deep: true,
      handler () {
        console.log('b')
        if (this.appQuestion) this.setIsManuallyTriggeredAskQuestion(true)
      }
    }
  },
  mounted () {
    this.resetAnomalySetting()
    if (this.currentComponent.keyResultId) {
      this.tempComponentAnomalySettings = JSON.parse(
        JSON.stringify(this.currentComponent.anomalySettings || [])
      )
      if (
        this.currentComponent.anomalySettings &&
        this.currentComponent.anomalySettings.length > 0
      ) {
        this.anomalySetting.yAxis = {
          ...this.anomalySetting.yAxis,
          ...formatAnomalySetting(this.tempComponentAnomalySettings)
        }
      }
      // 假如已經有完整的舊有問句資訊，就不需要重新再問
      if (
        this.checkHasCorrectSegmentation(this.currentComponent.segmentation)
      ) {
        this.askResult(
          this.currentComponent.segmentation,
          this.currentComponent.questionId
        )
      } else {
        this.askQuestion(this.currentComponent.question)
      }
    }
  },
  destroyed () {
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
  },
  methods: {
    ...mapMutations('dataSource', ['setIsManuallyTriggeredAskQuestion']),
    /**
     * 上下兼容
     * 某些舊資料的 segmenation 資訊短缺，得重新取
     */
    checkHasCorrectSegmentation (segmentation) {
      if (!segmentation) return false
      if (!Array.isArray(segmentation.sentence)) return false
      return Object.keys(segmentation.sentence[0]).length > 4
    },
    checkIsTextTypeAvailable (transcript) {
      // 以下需確保問句中只帶有一個 category 欄位
      const isSingleSubject =
        transcript.subjectList && transcript.subjectList.length === 1
      const isSingleCategoryDataColumn =
        transcript.subjectList[0].categoryDataColumnList &&
        transcript.subjectList[0].categoryDataColumnList.length === 1
      const haveSameDataColumn =
        isSingleCategoryDataColumn &&
        transcript.subjectList[0].categoryDataColumnList[0].dataColumnId ===
          transcript.subjectList[0].dataColumn.dataColumnId
      // 確保不是該 category 欄位中的值，因為他會被視為該欄位下的 filter 條件
      const isEmptyFilterList = transcript.subjectList[0].filterList === null
      return (
        isSingleSubject &&
        isEmptyFilterList &&
        isSingleCategoryDataColumn &&
        haveSameDataColumn
      )
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
      this.layout = null
      this.isShowAnomalySetting = false
      this.closeUnknowInfoBlock()

      this.$store
        .dispatch('chatBot/askQuestion', {
          question,
          dataSourceId: this.currentComponent.dataSourceId || this.dataSourceId,
          dataFrameId: this.currentComponent.dataFrameId || this.dataFrameId,
          shouldCancelToken: true,
          // 編輯模式下帶入當初問問句使用的 parser 語系；新創時走原本流程（拿當前 store 中的語系）
          language:
            this.currentComponent.init && this.currentComponent.parserLanguage
        })
        .then((response) => {
          let questionId = response.questionId
          let segmentationList = response.segmentationList

          // 處理沒顯示結果的狀況：無結果 or 不支援問題所以不顯示結果
          const noShowAnswerSituations = [
            'NO_ANSWER',
            'DIFFERENCE',
            'CORRELATION_EXPLORATION',
            'ROOT_CAUSE',
            'PROFILE'
          ]
          const hasNoShowAnswerDenotation = (el) =>
            el === segmentationList[0].denotation

          if (noShowAnswerSituations.some(hasNoShowAnswerDenotation)) {
            this.segmentation = segmentationList[0]

            switch (this.segmentation.denotation) {
              // 無結果
              case 'NO_ANSWER':
                this.resultInfo = {
                  title: this.segmentation.errorCategory,
                  description: this.segmentation.errorMessage
                }
                break
              // 有關、根因分析、畫像分析、差異分析的問句 => 不顯示結果
              default:
                this.resultInfo = {
                  title: this.$t('editing.notShowResultTitle'),
                  description: this.$t('editing.notShowResultDescription')
                }
                break
            }

            this.layout = 'EmptyResult'
            this.$emit('update:isLoading', false)
            return false
          }

          // 一個結果
          if (segmentationList.length === 1) {
            this.segmentation = segmentationList[0]
            // 取得 dataframe 預設日期欄位資訊
            getDateTimeColumns(
              this.segmentation.transcript.dataFrame.dataFrameId
            )
              .then((columnList) => {
                this.mainDateColumn = columnList.find(
                  (column) => column.isDefault
                )

                // 存取問句結果讓 restriction 使用
                this.questionInfo = {
                  questionId: response.questionId,
                  dataFrameId:
                    segmentationList[0].transcript.dataFrame.dataFrameId,
                  dataColumns: this.getDataColumnlist(
                    segmentationList[0].transcript.subjectList
                  )
                }
                return this.askResult(null, questionId)
              })
              .then((res) => this.getComponent(res.resultId))
              .catch((error) => {})
          } else {
            // 多個結果
            this.$store.commit(
              'dataSource/setCurrentQuestionId',
              response.questionId
            )
            this.layout = 'MultiResult'
            this.resultInfo = { ...response, question: question }
            this.$emit('update:isLoading', false)
            this.$emit('update:isAddable', null)
          }
        })
        .catch((error) => {
          this.$emit('update:isLoading', false)
          this.$emit('update:isAddable', null)
          // 解決重新問問題，前一次請求被取消時，保持 loading 狀態
          this.$store.commit('dataSource/setCurrentQuestionInfo', null)
        })
    },
    askResult (selectedResultSegmentationInfo, questionId, isSetAlgoConfig) {
      this.$emit('update:isLoading', true)
      if (selectedResultSegmentationInfo) {
        this.segmentation = selectedResultSegmentationInfo
      }

      // 確認是否為趨勢類型問題
      const isTrendQuestion = this.segmentation.denotation === 'TREND'
      let dateTimeColumn = this.segmentation.transcript.subjectList.find(
        (subject) => subject.dateTime
      )
      return this.$store
        .dispatch('chatBot/askResult', {
          algoConfig: isSetAlgoConfig
            ? this.currentComponent.algoConfig || null
            : null,
          questionId: questionId || this.currentQuestionId,
          segmentation: this.segmentation,
          restrictions: this.computeRestrictions(this.mainDateColumn),
          selectedColumnList: this.computeSelectedColumns(),
          isFilter: true,
          ...(isTrendQuestion && {
            displayConfig: {
              histogramBarSize: null,
              sortOrders: dateTimeColumn
                ? [
                  {
                    dataColumnId:
                        dateTimeColumn.dateTime.dataColumn.dataColumnId,
                    sortType: 'DESC'
                  }
                ]
                : []
            }
          })
        })
        .then((res) => this.getComponent(res.resultId))
        .catch((error) => {})
    },
    getComponent (resultId) {
      window.clearTimeout(this.timeoutFunction)
      this.$store
        .dispatch('chatBot/getComponentList', { resultId })
        .then((componentResponse) => {
          switch (componentResponse.status) {
            case 'Process':
            case 'Ready':
              this.timeoutFunction = window.setTimeout(() => {
                this.getComponent(resultId)
              }, this.totalSec)
              this.totalSec += this.periodSec
              this.periodSec = this.totalSec
              break
            case 'Complete':
              this.totalSec = 50
              this.periodSec = 200
              this.resultInfo = componentResponse.componentIds
              // 初次創建時，預設元件名稱為使用者輸入的問句
              if (!this.currentComponent.keyResultId) {
                this.currentComponent.config.diaplayedName = this.appQuestion
              }
              this.currentComponent.keyResultId = componentResponse.id
              this.currentComponent.isIndexTypeAvailable =
                componentResponse.isIndexTypeComponent
              this.currentComponent.isTextTypeAvailable =
                this.checkIsTextTypeAvailable(componentResponse.transcript);
              (this.question = this.composeComponentQuestion(
                componentResponse.segmentationPayload.sentence
              )),
              this.$store.commit('result/updateCurrentResultId', resultId)
              // data columns 重新處理是因為 ask question 取得的是建議的句子切法
              // 最終切法和辨別結果要以 get component list 為主
              this.$store.commit('result/updateCurrentResultInfo', {
                keyResultId: componentResponse.componentIds.key_result[0],
                dataColumns: this.getDataColumnlist(
                  componentResponse.segmentationPayload.transcript.subjectList
                ),
                segmentation: this.segmentation,
                question: this.composeComponentQuestion(
                  componentResponse.segmentationPayload.sentence
                ),
                questionId: componentResponse.questionId,
                dataSourceId: this.dataSourceId,
                dataFrameId:
                  componentResponse.segmentationPayload.transcript.dataFrame
                    .dataFrameId,
                dateTimeColumn: this.mainDateColumn
              })
              // 比照智能分析ResultDisplay，過濾出紀錄parser無法判斷字詞的物件，裝進unknownToken陣列中，以此判斷是否顯示unknow-info-block
              this.segmentationInfo.unknownToken =
                componentResponse.segmentationPayload.sentence.filter(
                  (element) => {
                    return element.type === 'UNKNOWN'
                  }
                )
              this.segmentationInfo.question = this.appQuestion

              if (this.isNeededDisplaySetting) {
                this.currentComponent.algoConfig =
                  this.currentComponent.algoConfig ||
                  this.algoConfig[componentResponse.intent.toLowerCase()]
              } else {
                this.currentComponent.algoConfig = null
              }
              this.$emit(
                'update:isAddable',
                componentResponse.layout === 'general' || false
              )
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
        })
        .catch((error) => {
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
        return regex.test(cur.word) && index > 0
          ? `${acc} ${cur.word}`
          : `${acc}${cur.word}`
      }, '')
    },
    getDataColumnlist (subjectList) {
      return subjectList
        .filter(
          (item) =>
            item.dataColumn ||
            item.categoryDataColumnList ||
            item.filterList ||
            item.dateTime
        )
        .reduce((acc, cur, index, filteredSubjectList) => {
          // 匯集所有欄位
          const columnList = [
            ...(cur.categoryDataColumnList || []),
            ...(cur.dataColumn !== null ? [cur.dataColumn] : []),
            ...((cur.filterList !== null &&
              cur.filterList.map((filter) => filter.dataColumn)) ||
              []),
            ...(cur.dateTime !== null ? [cur.dateTime.dataColumn] : [])
          ]
          // 將不重複的欄位存起來
          columnList.forEach((column) => {
            if (!acc['dataColumnId-' + column.dataColumnId]) {
              acc['dataColumnId-' + column.dataColumnId] = column
            }
          })
          // 最後一筆時，回傳所有不重複的欄位清單
          return index === filteredSubjectList.length - 1
            ? Object.keys(acc).map((key) => acc[key])
            : acc
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
      return this.questionInfo.dataColumns.find(
        (column) => column.columnName === filterName
      )
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
      this.askResult(this.segmentation, this.currentQuestionId, isSetAlgoConfig)
    },
    saveAnomalySetting () {
      this.$validator.validateAll('anomaly').then((valid) => {
        if (!valid) return
        this.resetAnomalySetting()

        // 確保 input 字串轉為數值
        this.tempComponentAnomalySettings =
          this.tempComponentAnomalySettings.map((setting) => ({
            ...setting,
            value: parseFloat(setting.value)
          }))

        // 將暫存儲存回 component data 當中
        this.currentComponent.anomalySettings = JSON.parse(
          JSON.stringify(this.tempComponentAnomalySettings)
        )

        // 如果有設定，則轉換成上下線及射線的格式
        if (
          this.tempComponentAnomalySettings &&
          this.tempComponentAnomalySettings.length > 0
        ) {
          this.anomalySetting.yAxis = formatAnomalySetting(
            this.tempComponentAnomalySettings
          )
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
    removeSetting (settingId) {
      this.tempComponentAnomalySettings =
        this.tempComponentAnomalySettings.filter(
          (setting) => setting.id !== settingId
        )
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
.key-result {
  padding: 24px;

  &__question {
    font-size: 18px;
    margin-bottom: 18px;

    .question-mark {
      background-color: $theme-color-primary;
      border-radius: 8px;
      color: #fff;
      display: inline-block;
      font-weight: bold;
      height: 30px;
      line-height: 30px;
      margin-right: 8px;
      text-align: center;
      width: 30px;
    }
  }

  &__switch-wrapper {
    display: flex;
    margin-bottom: 16px;
  }

  &__switch {
    background: #1c292b;
    border: 2px solid #1c292b;
    border-radius: 12px;
    color: #6c7678;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    padding: 8px 16px;

    &.active {
      border: 2px solid #2ad2e2;
      color: #2ad2e2;
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
    background: #1c292b;
    border: 2px solid transparent;
    border-radius: 12px;
    cursor: pointer;
    padding: 18.5px;

    &__content {
      display: flex;
      overflow: hidden;
    }

    .setting {
      &__label {
        color: #aaa;
        font-size: 14px;
      }

      &__input {
        border-color: #fff;
        font-size: 16px;
        height: 39px;

        &::placeholder {
          color: #aaa;
        }

        ::v-deep .el-input__inner {
          padding-left: 0;
        }
      }

      &:not(:last-of-type) {
        margin-right: 100px;
      }
    }
  }

  &__empty-message {
    align-items: center;
    background: rgba(255, 223, 111, 0.08);
    color: #ffdf6f;
    display: flex;
    font-size: 14px;
    margin-top: 30px;
    padding: 8px 14px;
    text-align: left;

    .icon {
      font-size: 20px;
      margin-right: 5px;
    }
  }

  .display-setting {
    &__title {
      font-size: 18px;
      font-weight: 600;
      line-height: 25px;
      margin-bottom: 8px;
    }

    &__content {
      background: #1c292b;
      border: 2px solid transparent;
      border-radius: 12px;
      display: flex;
      flex-direction: row;
      padding: 18.5px;
    }

    &__item-box {
      display: flex;
      flex-direction: column;
    }

    &__item {
      align-items: center;
      display: flex;
      flex-direction: row;
      padding: 6px 0;
    }

    .item {
      &__label {
        color: #ccc;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        margin-right: 9px;
        width: 80px;
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
      height: 30px;
      margin-left: 16px;
      margin-top: auto;
      min-width: 50px;
    }
  }

  .anomaly {
    &__title {
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      line-height: 25px;
    }

    &__content {
      background: #1c292b;
      border-radius: 12px;
      display: flex;
      padding: 18.5px;
    }

    &__content-title {
      color: #aaa;
      font-size: 14px;
      font-weight: 600;
      margin-right: 33px;
    }

    &__settings {
      display: flex;
      flex: 1;
      flex-direction: column;

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
      color: #aaa;
      font-size: 14px;
    }

    .threshold {
      background: #141c1d;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      padding: 18px 20px;
      width: 50%;

      &--left {
        display: flex;
      }

      &__select {
        border-bottom: 1px solid #fff;
        height: 40px;
        margin-right: 16px;
        max-width: 115px;
      }

      &__input {
        width: 135px;

        ::v-deep .input-verify-text {
          margin-bottom: 12px;
        }

        ::v-deep .input-error {
          margin-bottom: -20px;
        }
      }

      &__delete-icon {
        color: #aaa;
        cursor: pointer;
      }
    }
  }
}
</style>
