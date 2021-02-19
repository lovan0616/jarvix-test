<template>
  <div 
    ref="component"
    :class="[
      `col-${componentData.config.size.column}`,
      `row-${componentData.config.size.row}`
    ]"
    class="component__item"
  >
    <div class="component__item-inner-container">
      <spinner 
        v-if="isInitializing" 
        class="component__item-init-spinner"/>
      <template v-else>
        <span class="component__item-header">
          <div class="header-left">
            <el-tooltip 
              :content="componentData.config.diaplayedName" 
              placement="bottom">
              <span 
                class="item-title" 
                v-html="dashboardTaskTitle" />
            </el-tooltip>
          </div>
          <div class="header-right">
            <div class="component-property-box" >
              <el-tooltip
                v-if="componentData.config.relatedDashboard" 
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
              class="component-setting-box">
              <svg-icon 
                icon-class="more"
                class="more-icon" />
              <!-- <slot name="drowdown"/> -->
              <dropdown-select
                :bar-data="componentSettingOptions"
                @switchDialogName="$emit('switchDialogName', $event)"
              />
            </div>
            <div v-if="!isEditMode && componentData.type === 'monitor-warning-list'">
              <svg-icon 
                icon-class="warning" 
                class="icon-warning"/>
            </div>
          </div>
        </span>
        <div
          v-if="componentData.type === 'index' || componentData.type === 'formula'" 
          class="component__item-content index">
          <div class="index-data">
            <spinner v-if="isProcessing"/>
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
              />
              <span 
                v-if="!isIndexTypeComponentLoading && (!isEmptyData && !isComponentFailed)"
                :class="[componentData.config.fontSize || 'middle']" 
                class="index-unit">{{ componentData.indexInfo.unit }}</span>
            </template>
          </div>
        </div>
        <div
          v-else-if="componentData.type === 'text'" 
          class="component__item-content text">
          <spinner v-if="isProcessing"/>
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
              class="index-unit">{{ componentData.indexInfo.unit }}</span>
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
        <simulator
          v-else-if="componentData.type === 'simulator'"
          :is-edit-mode="isEditMode"
          :restrictions="restrictions()"
          :script-id="componentData.scriptId"
          :key="JSON.stringify(allFilterList)"
        />
        <div 
          v-else
          class="component__item-content chart">
          <spinner v-if="isProcessing"/>
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
import Simulator from './Simulator'
import DropdownSelect from '@/components/select/DropdownSelect'
import moment from 'moment'
import { mapState } from 'vuex'
import { askFormulaResult } from '@/API/NewAsk'
import { sizeTable } from '@/utils/general'

export default {
  name: 'DashboardTask',
  components: {
    DecideDialog,
    MonitorWarningList,
    AbnormalStatistics,
    Simulator,
    DropdownSelect
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
        'color': '#DDDDDD',
        'text-align': 'center',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
      },
      chartComponentStyle: {
        'width': '100%',
        'height': '100%'
      },
      isProcessing: false,
      tempFilteredKeyResultId: null,
      isInitializing: true,
      segmentation: null,
      enableAlert: false
    }
  },
  computed: {
    ...mapState('dataSource', ['algoConfig']),
    isIndependentComponent () {
      return this.componentData.type === 'monitor-warning-list' || this.componentData.type === 'abnormal-statistics' || this.componentData.type === 'simulator'
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
      if (
        this.componentData.diagram === 'table'
        || this.componentData.type === 'monitor-warning-list'
        || this.componentData.type === 'simulator'
        || this.componentData.type === 'formula'
      ) return false

      const yAxisControlsDataFrames = this.selectedYAxisControls.reduce((acc, cur) => acc.concat(cur.dataFrameId), [])
      return yAxisControlsDataFrames.includes(this.componentData.dataFrameId)
    },
    keyResultId () {
      return this.tempFilteredKeyResultId
    },
    dataColumnAlias () {
      if (this.isIndependentComponent) return ''
      const dataColumn = this.componentData.segmentation.transcript.subjectList[0].dataColumn
      return dataColumn ? dataColumn.dataColumnAlias : ''
    },
    newYAxisColumnNames () {
      if (!this.shouldComponentYAxisBeControlled) return null
      return this.selectedYAxisControls.reduce((acc, cur) => acc.concat(` ${cur.columnName}`), '')
    },
    controllerMutatedQuestion () {
      if (this.isIndependentComponent) return ''
      if (!this.shouldComponentYAxisBeControlled) return ''
      return this.componentData.question.replace(this.dataColumnAlias, this.newYAxisColumnNames)
    },
    controllerMutatedQuestionWithStyleTag () {
      if (this.isIndependentComponent) return ''
      if (!this.shouldComponentYAxisBeControlled) return ''
      return this.componentData.question.replace(this.dataColumnAlias, `
        <div style="text-decoration: underline; margin-left: 4px; white-space: nowrap; display: flex;">${this.newYAxisColumnNames}<div>
      `)
    },
    dashboardTaskTitle () {
      return this.shouldComponentYAxisBeControlled
        ? this.controllerMutatedQuestionWithStyleTag
        : this.componentData.config.diaplayedName
    },
    allFilterList () {
      // 可能會有階層，因此需要完全攤平
      return [].concat.apply([], [...this.filters, ...this.controls])
    },
    filterTime () {
      const relativeDatetime =  this.filters
        .filter(item => item[0]['statsType'] === 'RELATIVEDATETIME')
        .map(filter => (this.formatRelativeDatetime(filter[0].dataValues[0])))
      return relativeDatetime[0]
    },
    selectedYAxisControls () {
      return this.yAxisControls.reduce((acc, cur) => {
        // 只有相同 dataFrame 才有作用
        if (cur[0].dataFrameId === this.componentData.dataFrameId) {
          // 找出被選到的 controller
          const option = cur.find(item => item.isSelected)
          return option ? acc.concat(option) : acc
        }
        return acc
      }, [])
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
        this.componentData.type !== 'chart'
        || this.componentData.diagram !== 'table'
        || !this.componentData.config.hasTableRelatedDashboard
        || this.componentData.config.tableRelationInfo.triggerTarget !== 'column'
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
      return this.componentData.type === 'chart'
        && this.componentData.diagram === 'table'
        && this.componentData.config.hasTableRelatedDashboard
        && this.componentData.config.tableRelationInfo.triggerTarget === 'row'
    },
    displayedRelatedDashboard () {
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
        'color': '#2AD2E2'
      }
    },
    dynamicComponentStyle () {
      return {
        ...this.chartComponentStyle,
        ...((this.componentData.segmentation.denotation === 'ANOMALY' || this.componentData.segmentation.denotation === 'NORMALITY_TEST') && {
          'height': 'calc(100% - 150px)',
        }),
        ...(this.componentData.segmentation.denotation === 'STABILITY' && {
          'height': 'calc(100% - 80px)',
        })
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
        ...(this.enableAlert && [
          {
            title: 'button.createAlert',
            icon: 'warning',
            dialogName: 'CreateWarningCriteria'
          }
        ])
      ]
      return options
    },
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
        if (controls.length === 0 || this.shouldComponentYAxisBeControlled) this.deboucedAskQuestion()
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
    deboucedAskQuestion (question) {
      // 避免在極短時間內，因 filter/controller 變動而多次觸發 askQuestion
      // Ex: 當外層 initFilters 的情境
      window.clearTimeout(this.debouncedAskFunction)
      this.debouncedAskFunction = window.setTimeout(this.askQuestion, 0)
    },
    askQuestion (question = this.controllerMutatedQuestion || this.componentData.question) {
      window.clearTimeout(this.timeoutFunction)
      this.isProcessing = true
      this.isIndexTypeComponentLoading = true
      this.isComponentFailed = false
      this.enableAlert = false
      this.totalSec = 50
      this.periodSec = 200
      this.isEmptyData = false

      // 透過公式創建元件需使用不同方式取得 result
      if (this.componentData.type === 'formula') return this.getFormulaResult()
      
      this.$store.dispatch('chatBot/askQuestion', {
        question,
        dataSourceId: this.componentData.dataSourceId,
        dataFrameId: this.componentData.dataFrameId,
        previewQuestionId: this.componentData.questionId,
        shouldCancelToken: false
      }).then(response => {
        let questionId = response.questionId
        let segmentationList = response.segmentationList
        // TODO 處理 NO_ANSWER
        if (segmentationList.length === 1) {
          this.segmentation = segmentationList[0]
          // 確認是否為趨勢類型問題
          const isTrendQuestion = segmentationList[0].denotation === 'TREND'
          this.$store.dispatch('chatBot/askResult', {
            algoConfig: this.componentData.algoConfig || null,
            questionId,
            segmentation: segmentationList[0],
            restrictions: this.restrictions(),
            selectedColumnList: null,
            isFilter: true,
            ...(isTrendQuestion && {
              sortOrders: [
                {
                  dataColumnId: segmentationList[0].transcript.subjectList.find(subject => subject.dateTime).dateTime.dataColumn.dataColumnId,
                  sortType: 'DESC'
                }
              ]
            })
          }).then(res => {
            this.getComponentV2(res.resultId)
          }).catch(error => {this.isProcessing = false})
        }
        // TODO 無結果和多個結果
      }).catch(error => { this.isProcessing = false })
    },
    getFormulaResult () {
      askFormulaResult({
        algoConfig: {
          ...this.algoConfig['formula'],
          dataColumnIdList: this.componentData.formulaSetting.inputList.map(input => input.dcId),
          formulaId: this.componentData.formulaSetting.formulaId
        },
        dataFrameId: this.componentData.formulaSetting.dataFrameId,
        restrictions: this.restrictions(),
        isFilter: true
      })
      .then(resultInfo => this.getComponentV2(resultInfo.resultId))
      .catch(error => { this.isProcessing = false })
    },
    getComponentV2 (resultId) {
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
              this.componentData.keyResultId = componentResponse.componentIds.key_result[0]
              this.tempFilteredKeyResultId = componentResponse.componentIds.key_result[0]
              this.isProcessing = false
              // 定期更新 component 資料
              if(this.componentData.config.isAutoRefresh && !this.isEditMode) this.setComponentRefresh()
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
        .filter(filter => {
          // 相對時間有全選的情境，不需帶入限制中
          if (filter.statsType === 'RELATIVEDATETIME') return filter.dataValues.length > 0 && filter.dataValues[0] !== 'unset'
          // 只處理相同 datafram 或欄位名稱相同的 filter
          // if (this.componentData.dataFrameId !== filter.dataFrameId && !this.includeSameColumnPrimaryAliasFilter(filter.columnName)) return false
          // 時間欄位要有開始和結束時間
          if (
            filter.statsType === 'NUMERIC'
            || filter.statsType === 'FLOAT'
            || filter.statsType === 'DATETIME'
          ) return filter.start && filter.end
          // filter 必須有值
          if (filter.statsType === 'CATEGORY' || filter.statsType === 'BOOLEAN') return filter.dataValues.length > 0
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
              dc_id: this.componentData.dateTimeColumn.dataColumnId,
              display_name: this.componentData.dateTimeColumn.dataColumnPrimaryAlias,
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
    updateComponentConfigInfo (config) {
      this.enableAlert = config.enableAlert
    },
    onComponentFailed () {
      this.isComponentFailed = true
      this.enableAlert = false
    }
  }
}
</script>

<style lang="scss" scoped>
/*定義欄和列的尺寸*/
$direction-size: ("col": 100%, "row": 100%);
/*定義每欄和每列要切幾等分*/
$direction-span: ("col": 12, "row": 12);
/*依照已定義好的尺寸和等份，製作欄和列使用的 class */
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
	0% { opacity: 0 }
	50% { opacity: 1 }
  100% { opacity: 0 }
}

.component__item {
  padding-right: 16px;
  border-radius: 5px;
  padding-bottom: 16px;
  float: left;
  transition: all .2s linear;

  &-init-spinner {
    margin: auto;
  }

  &-inner-container {
    background-color: #192323;
    border-radius: 5px;
    padding: 16px; 
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  &-header {
    display: flex;
    justify-content: space-between;
    height: 30px;
    align-items: center;
    margin-bottom: 16px;
    .header-left {
      display: flex;
      .item-title {
        color: #DDD;
        @include text-hidden;
        display: flex;
      }
    }
    .header-right {
      display: flex;
      justify-content: flex-end;
      .component-property-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        cursor: pointer;
        .property__item {
          height: 24px;
          flex: 0 0 24px;
          background-color: #474F4F;
          border: 1px solid #192323;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: .1s all cubic-bezier(1, -0.9, .89, 1.34);
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
        position: relative;
        color: $theme-color-primary;
        flex: 0 0 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: .2s all ease;
        cursor: pointer;
        @include dropdown-select-controller;
        &:hover {
          background-color: $theme-color-primary;
          color: #FFF;
          border-radius: 4px;
        }
        .dropdown-select {
          visibility: hidden;
          z-index: 1;
          /deep/ .dropdown-select-box {
            box-shadow: 0px 2px 5px rgba(34, 117, 125, 0.5);
            top: 31px;
            right: 0;
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
      color: $theme-color-danger;
      animation: flash 1s infinite;
    }
  }

  &-content {
    flex: 1;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /deep/ .task,
    /deep/ .task-component {
      position: relative;
      height: 100%;
      width: 100%;
    }

    /deep/ .no-result-block {
      width: 100%;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    &.index {
      /deep/ .not-empty {
        width: auto;
        max-width: 100%;
      }
      .index-unit {
        font-weight: 600;
        font-size: 36px;
        color: #2AD2E2;
        &.large { font-size: 36px }
        &.middle { font-size: 24px }
        &.small { font-size: 18px }
        &.mini { font-size: 18px }
      }
      .index-data {
        display: flex;
        align-items: flex-end;
        width: 100%;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
    .spinner-block {
      flex: 1;
    } 
  }

  /deep/ .task {
    .task-spinner.key-result-spinner {
      height: 100%;
    }
  }
}

</style>