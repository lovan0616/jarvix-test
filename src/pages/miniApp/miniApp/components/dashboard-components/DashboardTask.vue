<template>
  <div
    ref="component"
    class="component__item"
  >
    <div class="component__item-inner-container">
      <spinner
        v-if="isInitializing"
        class="component__item-init-spinner"
      />
      <template v-else>
        <span class="component__item-header">
          <div class="header-left">
            <el-tooltip
              v-if="isTitleTooltip"
              :content="taskOriginTitle"
              placement="bottom"
            >
              <span
                class="item-title"
                v-html="dashboardTaskTitle"
              />
            </el-tooltip>
            <p v-else>{{ dashboardTaskTitle }}</p>
          </div>
          <div class="header-right">
            <div class="component-property-box">
              <el-tooltip
                v-if="componentData.config.hasRelatedDashboard"
                :content="displayedRelatedDashboard"
              >
                <div
                  class="property__item"
                  @click="$emit('redirect', componentData.config.relatedDashboard.id)"
                >
                  <svg-icon
                    icon-class="chain"
                    class="icon-chain"
                  />
                </div>
              </el-tooltip>
              <el-tooltip
                v-if="componentData.config.isAutoRefresh"
                :content="displayedUpdateFrequency"
              >
                <div class="property__item">
                  <svg-icon
                    icon-class="auto-refresh"
                    class="icon-refresh"
                  />
                </div>
              </el-tooltip>
            </div>
            <div
              v-if="isEditMode"
              class="component-setting-box"
            >
              <svg-icon
                icon-class="more"
                class="more-icon"
              />
              <!-- <slot name="drowdown"/> -->
              <dropdown-select
                :bar-data="componentSettingOptions"
                @switchDialogName="$emit('switchDialogName', { name: $event, componentComplementaryInfo })"
              />
            </div>
            <div v-if="!isEditMode && componentData.type === 'monitor-warning-list'">
              <svg-icon
                icon-class="warning"
                class="icon-warning"
              />
            </div>
          </div>
        </span>
        <div
          v-if="componentData.type === 'index' || componentData.type === 'formula'"
          class="component__item-content index"
        >
          <div class="index-data">
            <spinner v-if="isProcessing" />
            <template v-else>
              <task
                :class="{ 'not-empty': !isEmptyData && !isComponentFailed }"
                :custom-chart-style="indexComponentStyle"
                :key="'index-' + keyResultId"
                :component-id="keyResultId"
                :converted-type="'index_info'"
                intend="key_result"
                @isEmpty="isEmptyData = true"
                @failed="onComponentFailed"
                @finished="isIndexTypeComponentLoading = false"
                @setConfig="updateComponentConfigInfo"
              />
              <span
                v-if="!isIndexTypeComponentLoading && (!isEmptyData && !isComponentFailed)"
                :class="[componentData.config.fontSize || 'middle']"
                class="index-unit"
              >{{ componentData.indexInfo.unit }}</span>
            </template>
          </div>
        </div>
        <div
          v-else-if="componentData.type === 'text'"
          class="component__item-content text"
        >
          <spinner v-if="isProcessing" />
          <template v-else>
            <task
              :class="{ 'not-empty': !isEmptyData }"
              :custom-chart-style="textComponentStyle"
              :key="'text-' + keyResultId"
              :component-id="keyResultId"
              :converted-type="'text_info'"
              intend="key_result"
              @isEmpty="isEmptyData = true"
            />
            <span
              v-if="!isEmptyData"
              class="index-unit"
            >{{ componentData.indexInfo.unit }}</span>
          </template>
        </div>
        <monitor-warning-list
          v-else-if="componentData.type === 'monitor-warning-list'"
          :setting="warningModuleSetting"
          :is-edit-mode="isEditMode"
          @warningLogTriggered="$emit('warningLogTriggered', $event)"
        />
        <abnormal-statistics
          v-else-if="componentData.type === 'abnormal-statistics'"
          :type="componentData.diagram"
          :filter-time="filterTime"
          :conponent-config="componentData.config"
          :warning-module-setting="warningModuleSetting"
          :is-edit-mode="isEditMode"
        />
        <parameters-optimized-simulator
          v-else-if="componentData.type === 'parameters-optimized-simulator'"
          :is-edit-mode="isEditMode"
          :restrictions="restrictions()"
          :model-setting="componentData.modelSetting"
          :key="taskId"
        />
        <simulator
          v-else-if="componentData.type === 'simulator'"
          :is-edit-mode="isEditMode"
          :restrictions="restrictions()"
          :model-setting="componentData.modelSetting"
          :key="taskId"
        />
        <div
          v-else
          class="component__item-content chart"
        >
          <spinner v-if="isProcessing" />
          <no-result
            v-else-if="isAskQuestionFailed"
            :message="$t('miniApp.noSuitableResult')"
            class="no-result"
          />
          <task
            v-else
            :custom-chart-style="dynamicComponentStyle"
            :key="'chart' + keyResultId"
            :component-id="keyResultId"
            :is-show-description="false"
            :is-show-coefficients="componentData.segmentation.denotation === 'STABILITY'"
            :converted-type="componentData.type === 'paramCompare' ? 'param_comparison_table' : null"
            :is-show-toolbox="false"
            :custom-cell-class-name="customCellClassName"
            :is-hoverable="isHoverable"
            :anomaly-setting="anomalySetting"
            intend="key_result"
            @clickCell="columnTriggered($event)"
            @clickRow="rowTriggered($event)"
            @clickChart="chartriggered($event)"
            @setConfig="updateComponentConfigInfo"
            @failed="onComponentFailed"
          />
        </div>
      </template>
    </div>
    <decide-dialog
      v-if="isShowConfirmDelete"
      :title="$t('miniApp.confirmDeletingComponentRelation', { name: componentData.config.relatedDashboard.name })"
      :type="'delete'"
      @closeDialog="isShowConfirmDelete = false"
      @confirmBtn="confirmDelete"
    />
  </div>
</template>

<script>
import DecideDialog from '@/components/dialog/DecideDialog'
import MonitorWarningList from './MonitorWarningList'
import AbnormalStatistics from './AbnormalStatistics'
import ParametersOptimizedSimulator from './ParametersOptimizedSimulator'
import Simulator from './Simulator'
import DropdownSelect from '@/components/select/DropdownSelect'
import momentTZ from 'moment-timezone'
import { mapState } from 'vuex'
import { askFormulaResult } from '@/API/NewAsk'
import { sizeTable } from '@/utils/general'
import { formatAnomalySetting } from '@/components/display/common/addons'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'DashboardTask',
  components: {
    DecideDialog,
    MonitorWarningList,
    AbnormalStatistics,
    DropdownSelect,
    ParametersOptimizedSimulator,
    Simulator
  },
  props: {
    componentData: {
      type: Object,
      default: null,
      required: true
    },
    filters: {
      type: Array,
      default: () => []
    },
    yAxisControls: {
      type: Array,
      default: () => {}
    },
    controls: {
      type: Array,
      default: () => []
    },
    isEditMode: {
      type: Boolean,
      default: false,
      required: true
    },
    warningModuleSetting: {
      type: Object,
      default: () => {}
    },
    isCurrentDashboardInit: {
      type: Boolean,
      default: false
    },
    timeZone: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      sizeTable,
      timeoutFunction: null,
      totalSec: 50,
      periodSec: 200,
      isShowConfirmDelete: false,
      autoRefreshFunction: null,
      debouncedAskFunction: null,
      isEmptyData: false,
      isComponentFailed: false,
      isIndexTypeComponentLoading: true,
      textComponentStyle: {
        'font-size': '20px',
        color: '#DDDDDD',
        'text-align': 'center',
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center'
      },
      chartComponentStyle: {
        width: '100%',
        height: '100%'
      },
      isProcessing: false,
      isAskQuestionFailed: false,
      tempFilteredKeyResultId: null,
      isInitializing: true,
      enableAlert: false,
      componentComplementaryInfo: null,
      taskId: uuidv4()
    }
  },
  computed: {
    ...mapState('dataSource', ['algoConfig']),
    isIndependentComponent () {
      return this.componentData.type === 'monitor-warning-list' ||
        this.componentData.type === 'abnormal-statistics' ||
        this.componentData.type === 'simulator' ||
        this.componentData.type === 'parameters-optimized-simulator'
    },
    shouldComponentBeFiltered () {
      if (this.isIndependentComponent) return false
      return true
      // // 有任一filter 與 任一column 來自同 dataFrame，或者 任一filter 與 任一column 的 columnPrimaryAlias 相同
      // return this.allFilterList.find(filter => this.includeSameColumnPrimaryAliasFilter(filter.columnName))
      //   || this.includeSameDataFrameFilter
      //   || this.includeRelativeDatetimeFilter
    },
    shouldComponentYAxisBeControlled () {
      // 表格型元件 不受 Y軸控制器 影響
      // 元件問題需包含數值型欄位
      if (
        this.componentData.diagram === 'table' ||
        this.componentData.type === 'monitor-warning-list' ||
        this.componentData.type === 'simulator' ||
        this.componentData.type === 'formula' ||
        this.componentData.type === 'parameters-optimized-simulator' ||
        this.yAxisControls.length === 0 ||
        this.componentNumericColumns.length === 0
      ) return false

      // 至少其中一個欄位名稱是任一 controller 中的選項
      return this.yAxisControls.some(controller => {
        return controller.some(option => {
          return this.componentNumericColumns.find(column => column.columnName === option.columnName)
        })
      })
    },
    componentNumericColumns () {
      if (!this.componentData.dataColumns) return []
      return this.componentData.dataColumns.filter(column => column.statsType === 'NUMERIC') || []
    },
    keyResultId () {
      return this.tempFilteredKeyResultId
    },
    dataColumnAlias () {
      if (this.isIndependentComponent) return []
      return this.componentData.segmentation.transcript.subjectList.reduce((acc, cur) => {
        if (!cur.dataColumn) return acc
        acc.push(cur.dataColumn.dataColumnAlias)
        return acc
      }, [])
    },
    isTitleTooltip () {
      return this.componentData.config.isCustomizeTitle || this.shouldComponentYAxisBeControlled
    },
    dashboardTaskTitle () {
      if (this.componentData.config.isCustomizeTitle) {
        return this.componentData.config.diaplayedName
      } else if (this.shouldComponentYAxisBeControlled) {
        return this.controllerMutatedQuestion(true)
      }
      return this.componentData.question
    },
    taskOriginTitle () {
      if (this.shouldComponentYAxisBeControlled) {
        return this.componentData.question
      }
      return this.controllerMutatedQuestion(false)
    },
    allFilterList () {
      // 可能會有階層，因此需要完全攤平
      return [].concat.apply([], [...this.filters, ...this.controls])
    },
    filterTime () {
      const relativeDatetime = this.filters
        .filter(item => item[0].statsType === 'RELATIVEDATETIME')
        .map(filter => (this.formatRelativeDatetime(filter[0].dataValues[0])))
      return relativeDatetime[0]
    },
    includeSameDataFrameFilter () {
      let filterDataFrameIds = this.allFilterList.reduce((acc, cur) => acc.concat(cur.dataFrameId), [])
      return filterDataFrameIds.includes(this.componentData.dataFrameId)
    },
    includeRelativeDatetimeFilter () {
      return this.allFilterList.some(filter => filter.statsType === 'RELATIVEDATETIME')
    },
    customCellClassName () {
      if (
        this.componentData.type !== 'chart' ||
        this.componentData.diagram !== 'table' ||
        !this.componentData.config.hasTableRelatedDashboard ||
        this.componentData.config.tableRelationInfo.triggerTarget !== 'column'
      ) return []
      if (this.isIndependentComponent) return []
      const relation = this.componentData.config.tableRelationInfo.columnRelations[0].columnInfo
      if (!relation) return []
      const index = this.componentData.dataColumns.findIndex(item => item.columnId === relation.dataColumnId)
      return [{
        type: 'column',
        index: index + 1,
        className: 'has-underline is-text-blue'
      }]
    },
    isHoverable () {
      return this.componentData.type === 'chart' &&
        this.componentData.diagram === 'table' &&
        this.componentData.config.hasTableRelatedDashboard &&
        this.componentData.config.tableRelationInfo.triggerTarget === 'row'
    },
    displayedRelatedDashboard () {
      if (!this.componentData.config.relatedDashboard) return
      return `
        ${this.$t('miniApp.relatedDashboard')}：
        ${this.componentData.config.relatedDashboard.name}
      `
    },
    displayedUpdateFrequency () {
      return `
        ${this.$t('miniApp.updateFrequency')}：
        ${this.$t('warRoom.everyMinute', { number: this.convertRefreshFrequency(this.componentData.config.refreshFrequency) / (60 * 1000) })}
      `
    },
    indexComponentStyle () {
      return {
        ...this.sizeTable[this.componentData.config.fontSize || 'middle'],
        color: '#2AD2E2'
      }
    },
    dynamicComponentStyle () {
      return {
        ...this.chartComponentStyle,
        ...((this.componentData.segmentation.denotation === 'ANOMALY' || this.componentData.segmentation.denotation === 'NORMALITY_TEST') && {
          height: 'calc(100% - 150px)'
        }),
        ...(this.componentData.segmentation.denotation === 'STABILITY' && {
          height: 'calc(100% - 80px)'
        }),
        minHeight: '200px'
      }
    },
    componentSettingOptions () {
      const options = [
        {
          title: 'miniApp.componentSetting',
          icon: 'filter-setting',
          dialogName: 'CreateComponent'
        },
        {
          title: 'button.delete',
          icon: 'delete',
          dialogName: 'DeleteComponent'
        },
        ...(this.enableAlert ? [
          {
            title: 'button.createAlert',
            icon: 'warning',
            dialogName: 'CreateWarningCriteria'
          }
        ] : [])
      ]
      return options
    },
    anomalySetting () {
      return {
        xAxis: {
          upperLimit: null,
          lowerLimit: null,
          markLine: null
        },
        yAxis: {
          upperLimit: null,
          lowerLimit: null,
          markLine: null,
          ...(this.componentData.anomalySettings && this.componentData.anomalySettings.length > 0 && formatAnomalySetting(this.componentData.anomalySettings))
        }
      }
    }
  },
  watch: {
    isCurrentDashboardInit: {
      immediate: true,
      handler (isInit) {
        if (!isInit) return
        if (!this.isIndependentComponent) {
          this.isProcessing = true
          this.deboucedAskQuestion()
        }
        this.isInitializing = false
      }
    },
    // 當 Dashboard的 fitler 變動時，由元件內部去重新問問題
    filters: {
      deep: true,
      handler (controls) {
        if (this.shouldComponentBeFiltered) this.deboucedAskQuestion()
      }
    },
    controls: {
      deep: true,
      handler (controls) {
        if (this.shouldComponentBeFiltered) this.deboucedAskQuestion()
      }
    },
    yAxisControls: {
      deep: true,
      handler (controls) {
        if (this.isIndependentComponent) return
        if (controls.length === 0 || this.shouldComponentYAxisBeControlled) this.deboucedAskQuestion(true)
      }
    },
    'componentData.config.size' ({ row: newRow }, { row: oldRow }) {
      if (newRow === oldRow) return
      // 需等到元件樣式被更新後才重新計算
      if (this.componentData.diagram === 'table') window.setTimeout(() => this.adjustToTableComponentStyle(), 300)
    },
    'componentData.formulaSetting': {
      deep: true,
      handler (setting) {
        if (!setting) return
        this.deboucedAskQuestion()
      }
    },
    allFilterList () {
      this.taskId = uuidv4()
    }
  },
  mounted () {
    if (this.componentData.config.isAutoRefresh && !this.isEditMode) this.setComponentRefresh()
    // table 需要設定額外設定樣式
    if (this.componentData.diagram === 'table') this.adjustToTableComponentStyle()
  },
  destroyed () {
    if (this.autoRefreshFunction) window.clearTimeout(this.autoRefreshFunction)
    if (this.debouncedAskFunction) window.clearTimeout(this.debouncedAskFunction)
    if (this.timeoutFunction) window.clearTimeout(this.timeoutFunction)
  },
  methods: {
    /**
     * 上下兼容
     * 某些舊資料的 segmenation 資訊短缺，得重新取
     */
    checkHasCorrectSegmentation (segmentation) {
      if (!segmentation) return false
      if (!Array.isArray(segmentation.sentence)) return false
      return Object.keys(segmentation.sentence[0]).length > 4
    },
    deboucedAskQuestion (isNeededAskQuestion) {
      // 避免在極短時間內，因 filter/controller 變動而多次觸發 askQuestion
      // Ex: 當外層 initFilters 的情境
      window.clearTimeout(this.debouncedAskFunction)
      /* 跳過 askQuestion 步驟
       * 但在場上有 YAxisController 且會被影響的 component 仍要從頭問問句
       * */
      if (!isNeededAskQuestion && !this.shouldComponentYAxisBeControlled && this.checkHasCorrectSegmentation(this.componentData.segmentation)) {
        this.debouncedAskFunction = window.setTimeout(this.askResult, 0)
        return
      }
      this.debouncedAskFunction = window.setTimeout(this.askQuestion, 0)
    },
    askQuestion (question = this.controllerMutatedQuestion() || this.componentData.question) {
      window.clearTimeout(this.timeoutFunction)
      this.isProcessing = true
      this.isIndexTypeComponentLoading = true
      this.isComponentFailed = false
      this.enableAlert = false
      this.totalSec = 50
      this.periodSec = 200
      this.isEmptyData = false
      this.componentComplementaryInfo = null
      this.isAskQuestionFailed = false

      // 透過公式創建元件需使用不同方式取得 result
      if (this.componentData.type === 'formula') return this.getFormulaResult()

      this.$store.dispatch('chatBot/askQuestion', {
        question,
        dataSourceId: this.componentData.dataSourceId,
        dataFrameId: this.componentData.dataFrameId,
        previewQuestionId: this.componentData.questionId,
        shouldCancelToken: false,
        language: this.componentData.parserLanguage
      }).then(response => {
        let questionId = response.questionId
        let segmentationList = response.segmentationList

        // 處理 NO_ANSWER, 多個結果
        if (segmentationList[0].denotation === 'NO_ANSWER' || segmentationList.length > 1) {
          this.isAskQuestionFailed = true
          this.isProcessing = false
          return
        }

        if (segmentationList.length === 1) {
          this.askResult(segmentationList[0], questionId)
        }
      }).catch(error => { this.isProcessing = false })
    },
    askResult (segmentation = this.componentData.segmentation, questionId = this.componentData.questionId) {
      // 確認是否為趨勢類型問題
      const isTrendQuestion = segmentation.denotation === 'TREND'
      let dateTimeColumn = segmentation.transcript.subjectList.find(subject => subject.dateTime)
      return this.$store.dispatch('chatBot/askResult', {
        algoConfig: this.componentData.algoConfig || null,
        questionId,
        segmentation: segmentation,
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
      }).then(res => {
        this.getComponent(res.resultId)
      }).catch(error => { this.isProcessing = false })
    },
    getFormulaResult () {
      askFormulaResult({
        algoConfig: {
          ...this.algoConfig.formula,
          dataColumnIdList: this.componentData.formulaSetting.inputList.map(input => input.dcId),
          formulaId: this.componentData.formulaSetting.formulaId
        },
        dataFrameId: this.componentData.formulaSetting.dataFrameId,
        restrictions: this.restrictions(),
        isFilter: true
      })
        .then(resultInfo => this.getComponent(resultInfo.resultId))
        .catch(error => { this.isProcessing = false })
    },
    getComponent (resultId) {
      this.$store.dispatch('chatBot/getComponentList', { resultId })
        .then(componentResponse => {
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
              this.componentData.keyResultId = componentResponse.componentIds.key_result[0]
              this.tempFilteredKeyResultId = componentResponse.componentIds.key_result[0]
              this.isProcessing = false
              // 定期更新 component 資料
              if (this.componentData.config.isAutoRefresh && !this.isEditMode) this.setComponentRefresh()
              break
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              this.isProcessing = false
              break
          }
        }).catch((error) => {
          this.isProcessing = false
          window.clearTimeout(this.autoRefreshFunction)
        })
    },
    restrictions () {
      return this.allFilterList
        .filter(filter => this.checkShouldApplyMiniAppFilter(filter, this.componentData.dateTimeColumn))
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
          if (filter.statsType === 'RELATIVEDATETIME') {
            return [{
              type,
              properties: {
                data_type,
                dc_id: this.componentData.dateTimeColumn.dataColumnId,
                display_name: this.componentData.dateTimeColumn.dataColumnPrimaryAlias,
                ...this.formatRelativeDatetime(filter.dataValues[0])
              }
            }]
          }

          return [{
            type,
            properties: {
              data_type,
              dc_id: filter.columnId,
              display_name: filter.columnName,
              ...((filter.statsType === 'STRING' || filter.statsType === 'BOOLEAN' || filter.statsType === 'CATEGORY') && {
                datavalues: filter.dataValues,
                display_datavalues: filter.dataValues
              }),
              ...((filter.statsType === 'NUMERIC' || filter.statsType === 'FLOAT' || filter.statsType === 'DATETIME') && {
                start: filter.start,
                end: filter.end
              })
            }
          }]
        })
    },
    includeSameColumnPrimaryAliasFilter (filterName) {
      return this.componentData.dataColumns.find(column => column.columnName === filterName)
    },
    confirmDelete () {
      this.isShowConfirmDelete = false
      this.$emit('deleteComponentRelation', this.componentData.id)
    },
    setComponentRefresh () {
      this.autoRefreshFunction = window.setTimeout(() => {
        this.askQuestion()
      }, this.convertRefreshFrequency(this.componentData.config.refreshFrequency))
    },
    convertRefreshFrequency (cronTab) {
      switch (cronTab) {
        case '* * * * *':
          return 60 * 1000
        case '*/5 * * * *':
          return 5 * 60 * 1000
        case '*/15 * * * *':
          return 15 * 60 * 1000
        case '*/30 * * * *':
          return 30 * 60 * 1000
        case '*/45 * * * *':
          return 45 * 60 * 1000
        case '0 * * * *':
          return 60 * 60 * 1000
        case '0 0 * * *':
          return 24 * 60 * 60 * 1000
        case '0 0 * * 0':
          return 7 * 24 * 60 * 1000
        case '0 0 1 * *':
          return 30 * 7 * 24 * 60 * 1000
      }
    },
    formatRelativeDatetime (dataValue) {
      const properties = {
        start: null,
        end: null
      }
      // update datetime range
      switch (dataValue) {
        case 'today':
          properties.start = momentTZ().tz(this.timeZone).startOf('day').format('YYYY-MM-DD HH:mm')
          properties.end = momentTZ().tz(this.timeZone).endOf('day').format('YYYY-MM-DD HH:mm')
          break
        case 'week':
        case 'month':
        case 'quarter':
        case 'year':
          properties.start = momentTZ().tz(this.timeZone).startOf(dataValue).format('YYYY-MM-DD HH:mm')
          properties.end = momentTZ().tz(this.timeZone).endOf(dataValue).format('YYYY-MM-DD HH:mm')
          break
        default:
          if (RegExp('^.*hour.*$').test(dataValue)) {
            const hour = Number(dataValue.split('hour')[0])
            properties.start = momentTZ().tz(this.timeZone).subtract(hour, 'hours').format('YYYY-MM-DD HH:mm')
            properties.end = momentTZ().tz(this.timeZone).format('YYYY-MM-DD HH:mm')
          } else {
            properties.start = null
            properties.end = null
          }
      }
      return properties
    },
    columnTriggered ({ row, column }) {
      const { relatedDashboardId, columnInfo } = this.componentData.config.tableRelationInfo.columnRelations[0]
      const triggerTarget = this.componentData.config.tableRelationInfo.triggerTarget
      if (triggerTarget !== 'column' || column.label !== columnInfo.dataColumnAlias) return

      this.$emit('columnTriggered', {
        relatedDashboardId,
        columnName: columnInfo.dataColumnAlias,
        columnId: columnInfo.dataColumnId,
        cellValue: row[column.index - 1]
      })
    },
    rowTriggered ({ row, header }) {
      const triggerTarget = this.componentData.config.tableRelationInfo.triggerTarget
      if (triggerTarget !== 'row') return
      const { relatedDashboardId } = this.componentData.config.tableRelationInfo.rowRelation
      const rowData = this.componentData.dataColumns.map(column => ({
        ...column,
        cellValue: row[header.indexOf(column.columnName)]
      }))
      this.$emit('rowTriggered', {
        relatedDashboardId,
        rowData
      })
    },
    chartriggered (restrictions) {
      if (!this.componentData.config.relatedDashboard) return
      const acceptedColumnStatesTypeList = ['category']
      if (!restrictions.some(restriction => acceptedColumnStatesTypeList.includes(restriction.stats_type))) return
      this.$emit('chartTriggered', {
        relatedDashboardId: this.componentData.config.relatedDashboard.id,
        restrictions
      })
    },
    adjustToTableComponentStyle () {
      // 取當前元件中，擺放 table 空間的高度（扣除 pagination）
      const maxHeight = this.$refs.component.getBoundingClientRect().height - 135
      this.$set(this.chartComponentStyle, 'height', maxHeight + 'px')
    },
    updateComponentConfigInfo ({ enableAlert, supportedFunction, ...axisData }) {
      // 存取元件能使用的功能及其資料
      this.componentComplementaryInfo = {
        chartInfo: axisData || {},
        supportedFunction
      }

      // 能用來轉示警條件的元件類型
      const enabledComponentTypeList = ['formula', 'chart']
      const isEnabledComponent = enabledComponentTypeList.includes(this.componentData.type)
      if (!isEnabledComponent) return
      this.enableAlert = enableAlert
    },
    onComponentFailed () {
      this.isComponentFailed = true
      this.enableAlert = false
    },
    columnNameStringToTag (name) {
      return `
        <div style="text-decoration: underline; margin-left: 4px; white-space: nowrap; display: inline-block;">${name}</div>
      `
    },
    controllerMutatedQuestion (isWithStyling = false) {
      if (this.isIndependentComponent) return ''
      if (!this.shouldComponentYAxisBeControlled) return ''

      const questionWordList = this.componentData.segmentation.sentence.map(word => ({
        ...word,
        isChanged: false
      }))

      const availableControllers = [...this.yAxisControls]
      for (let alias of this.dataColumnAlias) {
        // 逐一確認有無 y controller 包含當前 alias 的選項
        availableControllers.forEach((controller, index) => {
          const hasMatchedOption = controller.some(option => option.columnName === alias)
          if (hasMatchedOption) {
            // 替換成選定的欄位名稱
            const selectedOption = controller.find(option => option.isSelected)
            const matchedWord = questionWordList.find(wordItem => !wordItem.isChanged && wordItem.matchedWord === alias)
            matchedWord.word = isWithStyling ? this.columnNameStringToTag(selectedOption.columnName) : selectedOption.columnName
            matchedWord.isChanged = true

            // 從可用名單中拔除，下一個 alias 只能從其他 y controller 適用
            availableControllers.splice(index, 1)
          }
        })
        if (availableControllers.length === 0) break
      }
      return questionWordList.reduce((acc, cur, index) => {
        acc += `${index === 0 ? '' : ' '}${cur.word}`
        return acc
      }, '')
    }
  }
}
</script>

<style lang="scss" scoped>
/* 定義欄和列的尺寸 */
$direction-size: ('col': 100%, 'row': 100%);

/* 定義每欄和每列要切幾等分 */
$direction-span: ('col': 12, 'row': 12);

/* 依照已定義好的尺寸和等份，製作欄和列使用的 class */
@each $direction, $size in $direction-size {
  $span-amount: map-get($direction-span, $direction);

  @for $span from 1 through $span-amount {
    $property: if($direction == 'col', 'width', 'height');
    .#{$direction}-#{$span} {
      #{$property}: to-fixed(($size / $span-amount) * $span);
    }
  }
}

@mixin dropdown-select-controller {
  &:hover {
    .dropdown-select { visibility: visible; }
  }
}

@keyframes flash {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.component__item {
  border-radius: 5px;
  float: left;
  height: 100%;
  // padding-bottom: 16px;
  // padding-right: 16px;
  transition: all 0.2s linear;
  width: 100%;

  &-init-spinner {
    margin: auto;
  }

  &-inner-container {
    background-color: #192323;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 16px;
    width: 100%;
  }

  &-header {
    align-items: center;
    display: flex;
    height: 30px;
    justify-content: space-between;
    margin-bottom: 16px;

    .header-left {
      display: flex;

      .item-title {
        @include text-hidden;

        color: #ddd;
        display: flex;
      }
    }

    .header-right {
      display: flex;
      justify-content: flex-end;
      z-index: 3;

      .component-property-box {
        align-items: center;
        cursor: pointer;
        display: flex;
        justify-content: flex-end;

        .property__item {
          align-items: center;
          background-color: #474f4f;
          border: 1px solid #192323;
          border-radius: 50%;
          display: flex;
          flex: 0 0 24px;
          height: 24px;
          justify-content: center;
          transition: 0.1s all cubic-bezier(1, -0.9, 0.89, 1.34);

          &:not(:last-child) {
            margin-right: -5px;
          }

          .svg-icon {
            width: 14px;
          }

          .icon-refresh {
            // 為了讓此 icon 與相鄰的 icon 視覺面積較為一致
            transform: scale(1.1);
          }
        }

        &:hover {
          .property__item {
            &:not(:last-child) {
              margin-right: 5px;
            }
          }
        }
      }

      .component-setting-box {
        @include dropdown-select-controller;

        align-items: center;
        color: $theme-color-primary;
        cursor: pointer;
        display: flex;
        flex: 0 0 30px;
        height: 30px;
        justify-content: center;
        position: relative;
        transition: 0.2s all ease;

        &:hover {
          background-color: $theme-color-primary;
          border-radius: 4px;
          color: #fff;
        }

        .dropdown-select {
          visibility: hidden;
          z-index: 1;

          ::v-deep .dropdown-select-box {
            box-shadow: 0 2px 5px rgba(34, 117, 125, 0.5);
            left: unset;
            right: 0;
            top: 31px;

            &::before {
              right: 5px;
            }

            .svg-icon {
              color: $theme-color-primary;
            }

            .dropdown-flex {
              min-width: unset;
            }
          }
        }
      }

      .component-property-box ~ .component-setting-box {
        margin-left: 8px;
      }
    }

    .icon-warning {
      animation: flash 1s infinite;
      color: $theme-color-danger;
    }
  }

  &-content {
    align-items: center;
    display: flex;
    flex: 1;
    height: 100%;
    justify-content: center;
    min-height: 0;
    overflow: auto;
    overflow: overlay;

    ::v-deep .task,
    ::v-deep .task-component {
      height: 100%;
      position: relative;
      width: 100%;
    }

    ::v-deep .no-result-block {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
    }

    .no-result {
      position: relative;
      top: unset;
      transform: unset;
    }

    &.index {
      ::v-deep .not-empty {
        max-width: 100%;
        width: auto;
      }

      .index-unit {
        color: #2ad2e2;
        font-size: 36px;
        font-weight: 600;
        &.large { font-size: 36px; }
        &.middle { font-size: 24px; }
        &.small { font-size: 18px; }
        &.mini { font-size: 18px; }
      }

      .index-data {
        align-items: flex-end;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
      }
    }

    .spinner-block {
      flex: 1;
    }
  }

  ::v-deep .task {
    .task-spinner.key-result-spinner {
      height: 100%;
    }
  }
}

.component__item-wrapper-size {
  input {
    background-color: transparent;
    border: 1px solid #ddd;
    color: #fff;
    width: 40px;
  }
}
</style>
