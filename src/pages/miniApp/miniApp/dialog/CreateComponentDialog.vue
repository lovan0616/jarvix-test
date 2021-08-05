<template>
  <div class="dialog">
    <nav class="dialog__nav">
      <div class="nav--left">
        <div
          class="icon-arrow"
          @click="$emit('close')"
        >
          <svg-icon icon-class="arrow-left" />
        </div>
        <span>{{ currentComponent.init ? $t('miniApp.editComponent') : $t('miniApp.createComponent') }}</span>
        <div
          v-if="topFilters.length > 0"
          class="filter-list"
        >
          <div class="filter-list__label">
            <svg-icon icon-class="filter-outline" />
            <span class="label-text">{{ $t('dataFrameAdvanceSetting.filterCriteria') }}</span>
          </div>
          <single-filter-status-badge
            v-for="(filter, index) in topFilters.slice(0, 4)"
            :key="`single-filter-status-badge-${index}`"
            :filter="filter"
          />
          <overflow-filter-status-badge :filters="topFilters.slice(4)" />
        </div>
      </div>
      <div class="nav--right">
        <div
          v-if="!isLoading && isAddable === false"
          class="message"
        >
          <svg-icon
            class="icon"
            icon-class="information-circle"
          />
          {{ $t('miniApp.componentNotAddable') }}
        </div>
        <button
          v-if="currentComponent.init"
          class="btn btn-default"
          @click="saveComponent"
        >
          {{ $t('button.save') }}
        </button>
        <button
          v-else
          :disabled="!isAddable || isLoading || isFailed"
          class="btn btn-default"
          @click="createComponent"
        >
          {{ $t('button.create') }}
        </button>
      </div>
    </nav>
    <div class="dialog__content">
      <div class="dialog__content--left">
        <template v-if="currentComponent.isCreatedViaAsking">
          <div class="search-bar">
            <data-frame-menu
              :redirect-on-change="false"
              :is-show-preview-entry="true"
              :is-show-advance-setting-entry="true"
            />
            <ask-block
              :redirect-on-ask="false"
              :is-show-ask-helper-entry="false"
              :default-question="currentComponent.question"
            />
          </div>
          <div
            class="dashboard-container"
            :class="{ 'show-settings': isShowSettingBox }"
          >
            <transition name="fast-fade-in">
              <advance-data-frame-setting v-if="isShowSettingBox" />
            </transition>
            <dashboard-component
              :current-component="currentComponent"
              :is-addable.sync="isAddable"
              :is-loading.sync="isLoading"
              @setDiagram="currentComponent.diagram = $event"
              @updateTitle="updateComponentTitle"
              @checkTitleMatch="checkTitleMatch"
            />
          </div>
          <transition name="fast-fade-in">
            <section
              v-if="isShowPreviewDataSource"
              class="preview-datasource"
            >
              <preview-data-source
                :is-previewing="true"
                mode="popup"
              />
              <a
                href="javascript:void(0)"
                class="preview-datasource__close-btn"
                @click="closePreviewDataSource"
              ><svg-icon icon-class="close" /></a>
            </section>
          </transition>
        </template>
        <formula-setting
          v-else-if="currentComponent.type === 'formula'"
          :formula-setting="currentComponent.formulaSetting"
          :formula-component-info="formulaComponentInfo"
          :current-component="currentComponent"
        />
        <simulator-setting
          v-else-if="currentComponent.type === 'simulator' || currentComponent.type === 'parameters-optimized-simulator'"
          :model-setting="currentComponent.modelSetting"
          :model-component-info="modelComponentInfo"
          :current-component-type="currentComponent.type"
          :is-loading.sync="isLoading"
          :is-failed.sync="isFailed"
        />
      </div>
      <div
        class="dialog__content--right"
      >
        <div class="setting__header">
          <svg-icon icon-class="filter-setting" />
          {{ $t('miniApp.componentSetting') }}
        </div>
        <!-- Title Setting -->
        <div class="setting__content">
          <div class="setting__block">
            <div class="setting__label-block">
              {{ $t('miniApp.componentName') }}
              <el-switch
                v-model="currentComponent.config.isCustomizeTitle"
                :width="Number('32')"
                active-color="#2AD2E2"
                inactive-color="#324B4E"
              />
            </div>
            <div
              v-if="currentComponent.config.isCustomizeTitle"
              class="setting__blok-select-field"
            >
              <input-verify
                v-validate="'required'"
                v-model="currentComponent.config.diaplayedName"
                name="createComponentDisplayName"
              />
            </div>
          </div>
        </div>
        <!--Related dashboard of current component-->
        <div
          v-if="isShowRelatedOption"
          class="setting__content"
        >
          <div class="setting__block">
            <div class="setting__label-block">
              {{ $t('miniApp.selectDashboard') }}
              <el-switch
                v-model="currentComponent.config.hasRelatedDashboard"
                :width="Number('32')"
                active-color="#2AD2E2"
                inactive-color="#324B4E"
                @change="updateHasRelatedDashboard"
              />
            </div>
            <div
              v-if="currentComponent.config.hasRelatedDashboard"
              class="setting__block-select-field"
            >
              <default-select
                v-validate="'required'"
                :value="currentComponent.config.relatedDashboard.id"
                :option-list="dashboardOptions"
                :placeholder="$t('miniApp.selectDashboard')"
                class="setting__block-select"
                name="createRelatedDashboard"
                @change="updateRelatedDashboard"
              />
              <div
                v-show="errors.has('createRelatedDashboard')"
                class="error-text"
              >
                {{ errors.first('createRelatedDashboard') }}
              </div>
            </div>
          </div>
        </div>
        <!-- Related dashboard of component columns or rows -->
        <div
          v-if="currentComponent.diagram === 'table'"
          class="setting__content"
        >
          <div class="setting__block">
            <div class="setting__label-block">
              <span class="setting__label-block-label">
                {{ $t('miniApp.dataColumnRelationSetting') }}
              </span>
              <el-switch
                v-model="currentComponent.config.hasTableRelatedDashboard"
                :width="Number('32')"
                active-color="#2AD2E2"
                inactive-color="#324B4E"
                @change="updateHasTableRelatedDashboard"
              />
              <span class="setting__label-block-description">
                {{ $t('miniApp.dataColumnRelationSettingReminding') }}
              </span>
            </div>
            <template v-if="currentComponent.config.hasTableRelatedDashboard">
              <div class="setting__block-select-field">
                <label class="setting__block-select-label">{{ $t('miniApp.triggerColumn') }}</label>
                <div class="setting__block-radio-groups">
                  <div
                    v-for="(option, index) in triggerTargetOptions"
                    :key="index"
                    class="input-radio-group"
                  >
                    <input
                      :id="option.value"
                      :value="option.value"
                      :checked="option.value === currentComponent.config.tableRelationInfo.triggerTarget"
                      name="triggerOption"
                      class="input-radio"
                      type="radio"
                      @change="updateTriggerTarget(option.value)"
                    >
                    <label
                      :for="option.value"
                      class="input-radio-label"
                    >
                      {{ `${ option.name }` }}
                    </label>
                  </div>
                </div>
              </div>
              <div
                v-if="currentComponent.config.tableRelationInfo.triggerTarget === 'column'"
                class="setting__block-select-field"
              >
                <label class="setting__block-select-label">{{ $t('miniApp.triggerColumn') }}</label>
                <default-select
                  v-validate="'required'"
                  v-model="selectedTriggerColumn"
                  :option-list="categoryColumnOptions"
                  :placeholder="$t('miniApp.chooseColumn')"
                  class="setting__block-select"
                  name="createTriggerColumn"
                  @change="updateTriggerColumnInfo"
                />
                <div
                  v-show="errors.has('createTriggerColumn')"
                  class="error-text"
                >
                  {{ errors.first('createTriggerColumn') }}
                </div>
              </div>
              <div class="setting__block-select-field">
                <label class="setting__block-select-label">{{ $t('miniApp.relatedDashboard') }}</label>
                <default-select
                  v-validate="'required'"
                  :value="tableRelatedDashboard"
                  :option-list="dashboardOptions"
                  :placeholder="$t('miniApp.chooseDashboard')"
                  class="setting__block-select"
                  name="createColumnRelatedDashboard"
                  @change="updateTableRelatedDashboard"
                />
                <div
                  v-show="errors.has('createColumnRelatedDashboard')"
                  class="error-text"
                >
                  {{ errors.first('createColumnRelatedDashboard') }}
                </div>
              </div>
            </template>
          </div>
        </div>
        <!--Update frequency-->
        <div
          v-if="isShowUpdatedOption"
          class="setting__content"
        >
          <div class="setting__block">
            <div class="setting__label-block">
              {{ $t('miniApp.updateFrequency') }}
              <el-switch
                v-model="currentComponent.config.isAutoRefresh"
                :width="Number('32')"
                active-color="#2AD2E2"
                inactive-color="#324B4E"
                @change="updateRefreshFrequency"
              />
            </div>
            <div
              v-if="currentComponent.config.isAutoRefresh"
              class="setting__block-select-field"
            >
              <default-select
                v-validate="'required'"
                v-model="currentComponent.config.refreshFrequency"
                :option-list="updateFrequency"
                :placeholder="$t('miniApp.chooseUpdateFrequency')"
                class="setting__block-select"
                name="createUpdateFrequency"
              />
              <div
                v-show="errors.has('createUpdateFrequency')"
                class="error-text"
              >
                {{ errors.first('createUpdateFrequency') }}
              </div>
            </div>
          </div>
        </div>
        <!--Index type component font size setting-->
        <div
          v-if="isShowFontSizeOption"
          class="setting__content"
        >
          <div class="setting__block">
            <div class="setting__label-block">
              {{ $t('miniApp.fontSizeSetting') }}
            </div>
            <default-select
              v-model="currentComponent.config.fontSize"
              :option-list="indexSizeOptionList"
              :placeholder="$t('miniApp.chooseColumnSize')"
              class="setting__block-select"
            />
          </div>
        </div>
        <!--Layout Setting-->
        <div class="setting__content">
          <div class="setting__block">
            <div class="setting__label-block">
              {{ $t('miniApp.sizeSetting') }}
            </div>
            <div class="setting__block-select-field">
              <label class="setting__block-select-label">{{ $t('miniApp.columnSpan') }}</label>
              <default-select
                v-model.number="currentComponent.config.size.column"
                :option-list="columnSpanOption"
                :placeholder="$t('miniApp.chooseColumnSize')"
                class="setting__block-select"
                name="columnSpan"
              />
            </div>
            <div class="setting__block-select-field">
              <label class="setting__block-select-label">{{ $t('miniApp.rowSpan') }}</label>
              <input
                type="number"
                v-model.number="currentComponent.config.size.row"
                :placeholder="$t('miniApp.chooseRowSize')"
                class="setting__block-select"
                name="rowSpan"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataFrameMenu from '@/components/select/DataFrameMenu'
import FormulaSetting from '../components/componentSetting/FormulaSetting'
import SimulatorSetting from '../components/componentSetting/SimulatorSetting'
import DefaultSelect from '@/components/select/DefaultSelect'
import AskBlock from '@/components/chatBot/AskBlock'
import ResultDisplay from '@/pages/result/ResultDisplay'
import DashboardComponent from './DashboardComponent'
import InputVerify from '@/components/InputVerify'
import AdvanceDataFrameSetting from '@/components/AdvanceDataFrameSetting'
import SingleFilterStatusBadge from './SingleFilterStatusBadge'
import OverflowFilterStatusBadge from './OverflowFilterStatusBadge'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { algoConfig } from '@/utils/general'
import dataFrameAdvanceSetting from '@/store/modules/dataFrameAdvanceSetting'
import moment from 'moment'

export default {
  inject: ['$validator'],
  provide () {
    return {
      computeRestrictions: (mainDateColumn) => this.computeRestrictions(mainDateColumn),
      computeSelectedColumns: () => this.computeSelectedColumns()
    }
  },
  name: 'CreateComponentDialog',
  components: {
    AdvanceDataFrameSetting,
    DataFrameMenu,
    FormulaSetting,
    SimulatorSetting,
    DefaultSelect,
    AskBlock,
    ResultDisplay,
    DashboardComponent,
    InputVerify,
    SingleFilterStatusBadge,
    OverflowFilterStatusBadge
  },
  props: {
    initialCurrentComponent: {
      type: Object,
      default: () => {}
    },
    dashboardList: {
      type: Array,
      default: () => []
    },
    filters: {
      type: Array,
      default: () => []
    },
    controls: {
      type: Array,
      default: () => []
    },
    rowHeight: {
      type: Number,
      default: null
    },
    gap: {
      type: Number,
      default: 0
    }
  },
  data () {
    const isDirectAddableComponentTypes = ['formula', 'simulator', 'parameters-optimized-simulator']
    const currentComponent = this.initialCurrentComponent ? JSON.parse(JSON.stringify(this.initialCurrentComponent)) : {}
    const columnInfo = currentComponent.config.tableRelationInfo.columnRelations[0]?.columnInfo

    return {
      isAddable: isDirectAddableComponentTypes.includes(currentComponent.type),
      isLoading: false,
      isFailed: false,
      currentComponent,
      selectedTriggerColumn: columnInfo && columnInfo.dataColumnId,
      relatedDashboardTemplate: {
        id: null,
        name: null
      },
      algoConfig,
      indexSizeOptionList: [
        {
          value: 'large',
          name: this.$t('miniApp.large')
        },
        {
          value: 'middle',
          name: this.$t('miniApp.middle')
        },
        {
          value: 'small',
          name: this.$t('miniApp.small')
        },
        {
          value: 'mini',
          name: this.$t('miniApp.mini')
        }
      ],
      formulaComponentInfo: {},
      modelComponentInfo: {}
    }
  },
  computed: {
    ...mapState('result', ['currentResultId', 'currentResultInfo']),
    ...mapState('previewDataSource', ['isShowPreviewDataSource']),
    ...mapState('chatBot', ['parserLanguage']),
    ...mapState('dataSource', ['appQuestion']),
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox']),
    ...mapGetters('dataFrameAdvanceSetting', ['filterRestrictionList', 'selectedColumnList']),
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    isShowRelatedOption () {
      return this.currentComponent.type !== 'monitor-warning-list' && this.currentComponent.type !== 'abnormal-statistics' && this.currentComponent.type !== 'simulator' && this.currentComponent.type !== 'parameters-optimized-simulator'
    },
    isShowUpdatedOption () {
      return this.currentComponent.type !== 'monitor-warning-list' && this.currentComponent.type !== 'abnormal-statistics' && this.currentComponent.type !== 'simulator' && this.currentComponent.type !== 'parameters-optimized-simulator'
    },
    isShowFontSizeOption () {
      return this.currentComponent.type === 'index' || this.currentComponent.type === 'formula' || this.currentComponent.type === 'abnormal-statistics'
    },
    updateFrequency () {
      return [
        {
          value: '* * * * *',
          name: this.$t('warRoom.everyMinute', { number: 1 })
        },
        {
          value: '*/5 * * * *',
          name: this.$t('warRoom.everyMinute', { number: 5 })
        },
        {
          value: '*/15 * * * *',
          name: this.$t('warRoom.everyMinute', { number: 15 })
        },
        {
          value: '*/30 * * * *',
          name: this.$t('warRoom.everyMinute', { number: 30 })
        },
        {
          value: '*/45 * * * *',
          name: this.$t('warRoom.everyMinute', { number: 45 })
        },
        {
          value: '0 * * * *',
          name: this.$t('warRoom.everyHour')
        },
        {
          value: '0 0 * * *',
          name: this.$t('warRoom.everyDay')
        },
        {
          value: '0 0 * * 0',
          name: this.$t('warRoom.everyWeek')
        },
        {
          value: '0 0 1 * *',
          name: this.$t('warRoom.everyMonth')
        }
      ]
    },
    columnSpanOption () {
      // 最小值為 2, 最大值為 12
      return [...Array(11).keys()].map(value => ({
        value: value + 2,
        name: this.$t('miniApp.columnSpanAmount', { number: value + 2 })
      }))
    },
    rowSpanOption () {
      // 最小值為 2, 最大值為 12
      return [...Array(11).keys()].map(value => ({
        value: value + 2,
        name: this.$t('miniApp.rowSpanAmount', { number: value + 2 })
      }))
    },
    categoryColumnOptions () {
      const origin = this.currentResultInfo || this.initialCurrentComponent
      let options = origin.segmentation.transcript.subjectList.reduce((acc, cur) => {
        const isExist = acc.findIndex(item => item.dataColumnId === cur.categoryDataColumnList[0].dataColumnId) > -1
        return isExist ? acc : acc.concat(
          ...cur.categoryDataColumnList.map(item => ({
            ...item,
            value: item.dataColumnId,
            name: item.dataColumnAlias
          })))
      }, [])
      options.unshift(this.defaultOptionFactory(this.$t('miniApp.chooseColumn')))
      return options
    },
    dashboardOptions () {
      let options = this.dashboardList
        .filter(item => item.id !== this.dashboardId)
        .map(item => ({
          value: item.id,
          name: item.name
        }))
      options.unshift(this.defaultOptionFactory(this.$t('miniApp.chooseDashboard')))
      return options
    },
    tableRelatedDashboard () {
      if (!this.currentComponent.config.hasTableRelatedDashboard) return
      const triggerTarget = this.currentComponent.config.tableRelationInfo.triggerTarget
      return triggerTarget === 'column' ? this.currentComponent.config.tableRelationInfo.columnRelations[0].relatedDashboardId : this.currentComponent.config.tableRelationInfo.rowRelation.relatedDashboardId
    },
    triggerTargetOptions () {
      return [
        {
          name: this.$t('miniApp.singleColumnData'),
          value: 'column'
        },
        {
          name: this.$t('miniApp.singleRowData'),
          value: 'row'
        }
      ]
    },
    topFilters () {
      // 全部外層傳進來的 filters / controls，遇到階層控制項會攤平
      return [...this.filters, ...this.controls].flat(1)
    }
  },
  mounted () {
    this.setAppQuestion(this.currentComponent.question)
    if (this.$store.hasModule('dataFrameAdvanceSetting')) {
      this.$store.unregisterModule('dataFrameAdvanceSetting', dataFrameAdvanceSetting)
    }
    this.$store.registerModule('dataFrameAdvanceSetting', dataFrameAdvanceSetting)
  },
  destroyed () {
    this.$store.commit('result/updateCurrentResultInfo', null)
    this.$store.commit('result/updateCurrentResultId', null)
    this.$store.commit('dataSource/setAppQuestion', null)
    this.toggleSettingBox(false)
    if (this.isShowPreviewDataSource) this.closePreviewDataSource()
  },
  methods: {
    ...mapMutations('dataSource', ['setAppQuestion']),
    ...mapMutations('dataFrameAdvanceSetting', ['toggleSettingBox']),
    createComponent () {
      this.$validator.validateAll().then(valid => {
        if (!valid) return
        this.$emit('create', {
          ...this.currentComponent,
          // Demo 使用：為了展示參數最佳化比較，把元件名稱帶有特定字串的元件改 type
          ...(this.isParameterComparisonTypeComponent(this.currentComponent.config.diaplayedName) && {
            type: 'paramCompare'
          }),
          parserLanguage: this.parserLanguage,
          init: true,
          resultId: this.currentResultId,
          // 將來 增/刪 filter 時，重打 askResult 所需的 request body
          ...this.currentResultInfo,
          // 公式元件需補上一般問問句會取得的資料
          ...this.formulaComponentInfo,
          ...this.modelComponentInfo
        })
      })
    },
    isParameterComparisonTypeComponent (componentName) {
      const regex = new RegExp(this.$t('miniApp.optimalParameterComparison'), 'g')
      return componentName.match(regex)
    },
    saveComponent () {
      this.$validator.validateAll().then(valid => {
        if (!valid) return
        this.$emit('updateSetting', {
          ...this.currentComponent,
          ...this.formulaComponentInfo,
          ...this.modelComponentInfo,
          ...this.currentResultInfo // 公式元件需補上一般問問句會取得的資料
        })
      })
    },
    closePreviewDataSource () {
      this.$store.commit('previewDataSource/togglePreviewDataSource', false)
    },
    updateRefreshFrequency (isTurnedOn) {
      if (isTurnedOn) return
      const { refreshFrequency } = JSON.parse(JSON.stringify(this.initialCurrentComponent.config))

      // 關閉時，恢復原本預設，避免存取時送錯的格式給後端
      this.$nextTick(() => {
        this.currentComponent.config.refreshFrequency = refreshFrequency
      })
    },
    updateHasRelatedDashboard (isTurnedOn) {
      if (isTurnedOn) {
        if (this.currentComponent.config.relatedDashboard) return
        return this.currentComponent.config.relatedDashboard = this.relatedDashboardTemplate
      }

      const { relatedDashboard } = JSON.parse(JSON.stringify(this.initialCurrentComponent.config))

      // 關閉時，恢復原本預設，避免存取時送錯的格式給後端
      this.$nextTick(() => {
        this.currentComponent.config.relatedDashboard = relatedDashboard
      })
    },
    updateHasTableRelatedDashboard (isTurnedOn) {
      if (!isTurnedOn) {
        // this.$validator.detach('columnRelatedDashboard')
        this.currentComponent.config.tableRelationInfo = {
          triggerTarget: 'column',
          columnRelations: [{ relatedDashboardId: null, columnInfo: null }],
          rowRelation: { relatedDashboardId: null }
        }
      }
    },
    defaultOptionFactory (placholder) {
      return {
        value: null,
        name: placholder
      }
    },
    updateRelatedDashboard (selectedDashboardId) {
      const { id, name } = this.dashboardList.find(dashboard => dashboard.id === selectedDashboardId)
      this.currentComponent.config.relatedDashboard = { id, name }
    },
    updateTriggerColumnInfo () {
      const column = this.categoryColumnOptions.find(item => item.dataColumnId === this.selectedTriggerColumn)
      this.currentComponent.config.tableRelationInfo.columnRelations[0].columnInfo = column
    },
    setAlgoConfig (intent) {
      this.currentComponent.algoConfig = this.algoConfig[intent.toLowerCase()]
    },
    async updateTriggerTarget (triggerTarget) {
      this.currentComponent.config.tableRelationInfo.triggerTarget = triggerTarget
      if (triggerTarget === 'row') {
        // 避免資料被清空時觸發驗證導致 error
        this.$validator.detach('triggerColumn')
        await this.$nextTick()
      }

      this.currentComponent.config.tableRelationInfo.rowRelation = { relatedDashboardId: null }
      this.selectedTriggerColumn = null
      this.currentComponent.config.tableRelationInfo.columnRelations = [{ relatedDashboardId: null, columnInfo: null }]
    },
    updateTableRelatedDashboard (selectedDashboardId) {
      const triggerTarget = this.currentComponent.config.tableRelationInfo.triggerTarget
      triggerTarget === 'column' ? this.currentComponent.config.tableRelationInfo.columnRelations[0].relatedDashboardId = selectedDashboardId : this.currentComponent.config.tableRelationInfo.rowRelation.relatedDashboardId = selectedDashboardId
    },
    updateComponentTitle (val) {
      if (this.currentComponent && !this.isCustomTitle) {
        this.currentComponent.config.diaplayedName = val
      }
    },
    checkTitleMatch (val) {
      if (val) {
        this.isCustomTitle = val.replaceAll(/ /g, '').toLowerCase() !== this.titleTemp.replaceAll(/ /g, '').toLowerCase()
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
        properties.start = moment()
          .subtract(hour, 'hours')
          .format('YYYY-MM-DD HH:mm')
        properties.end = moment().format('YYYY-MM-DD HH:mm')
      } else {
        properties.start = null
        properties.end = null
      }

      return properties
    },
    transformToRestrictionBy (filter, mainDateColumn) {
      let type = ''
      let data_type = ''
      switch (filter.statsType) {
        case 'STRING':
        case 'BOOLEAN':
        case 'CATEGORY':
          data_type = 'string'
          type = 'enum'
          break
        case 'FLOAT':
        case 'NUMERIC':
          data_type = 'int'
          type = 'range'
          break
        case 'DATETIME':
        case 'RELATIVEDATETIME':
          data_type = 'datetime'
          type = 'range'
          break
      }

      // 相對時間 filter 需取當前元件所屬 dataframe 的預設時間欄位和當前時間來套用
      if (filter.statsType === 'RELATIVEDATETIME') {
        return [
          {
            type,
            properties: {
              data_type,
              dc_id: mainDateColumn.dataColumnId,
              display_name: mainDateColumn.dataColumnPrimaryAlias,
              ...this.formatRelativeDatetime(filter.dataValues[0])
            }
          }
        ]
      }

      return [
        {
          type,
          properties: {
            data_type,
            dc_id: filter.columnId,
            display_name: filter.columnName,
            ...((filter.statsType === 'STRING' ||
              filter.statsType === 'BOOLEAN' ||
              filter.statsType === 'CATEGORY') && {
              datavalues: filter.dataValues,
              display_datavalues: filter.dataValues
            }),
            ...((filter.statsType === 'NUMERIC' ||
              filter.statsType === 'FLOAT' ||
              filter.statsType === 'DATETIME') && {
              start: filter.start,
              end: filter.end
            })
          }
        }
      ]
    },
    computeRestrictions (mainDateColumn = null) {
      const topRestrictions = this.topFilters
        .filter((filter) => this.checkShouldApplyMiniAppFilter(filter, mainDateColumn))
        .map((filter) => this.transformToRestrictionBy(filter, mainDateColumn))

      // 進階設定提供的 restrictions
      const restrictionsFromAdvancedSettings = this.filterRestrictionList

      const result = [
        ...topRestrictions,
        ...restrictionsFromAdvancedSettings
      ]

      return result
    },
    computeSelectedColumns () {
      const selectedColumnsFromAdvancedSettings = this.selectedColumnList ?? []
      const result = [...selectedColumnsFromAdvancedSettings]

      return result.length === 0
        ? null
        : result
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: 100%;

  &__nav {
    align-items: center;
    background: rgba(0, 0, 0, 0.55);
    border-bottom: 1px solid #232c2e;
    display: flex;
    flex: 0 0 56px;
    padding: 0 24px;

    .nav--left {
      align-items: center;
      display: flex;

      .icon-arrow {
        color: $theme-color-primary;
        cursor: pointer;
        margin-right: 20px;
      }

      .filter-list {
        align-items: center;
        display: flex;
        margin-left: 42px;

        &__label {
          align-items: center;
          color: #aaa;
          display: flex;
          font-size: 13px;

          .label-text {
            margin-left: 10px;
          }
        }

        .filter-status-badge {
          margin-left: 10px;
        }
      }
    }

    .nav--right {
      display: flex;
      margin: 0 0 0 auto;

      .message {
        color: #ffdf6f;
        font-size: 12px;
        line-height: 36px;
        margin-right: 6px;
      }
    }
  }

  &__content {
    display: flex;
    flex: 1;
    height: 0;
    overflow: auto;
    overflow: overlay; // 讓scrollbar不佔位。for有支援此屬性的瀏覽器

    &--left {
      border-right: 1px solid #232c2e;
      flex: 1;
      min-width: 0;
      position: relative;

      .search-bar {
        border-bottom: 1px solid #232c2e;
        display: flex;
        height: 60px;
        padding: 8px 24px;
        position: relative;
        z-index: 4;

        .data-frame-select-block {
          margin-right: 16px;
          width: 300px;
        }
      }

      .dashboard-container {
        transition: all 0.3s;

        &.show-settings {
          padding-left: 280px;
        }

        ::v-deep .setting__wrapper {
          height: calc(100vh - 116px);
          top: 60px;
          width: 280px;
        }
      }
    }

    &--right {
      flex: 0 0 280px;

      .setting {
        &__header {
          align-items: center;
          border-bottom: 1px solid #232c2e;
          display: flex;
          height: 60px;
          padding: 16px 24px;

          .svg-icon {
            color: $theme-color-primary;
            margin-right: 12px;
            width: 16px;
          }
        }

        &__content {
          border-bottom: 1px solid #232c2e;
          padding: 16px 24px;
        }

        &__label-block {
          color: #fff;
          display: flex;
          flex-wrap: wrap;
          font-size: 14px;
          font-weight: 600;
          justify-content: space-between;

          &-description {
            color: #aaa;
            font-size: 12px;
            margin-top: 12px;
          }
        }

        &__block {
          ::v-deep .input-verify {
            .input-verify-text {
              margin-bottom: 10px;
            }

            .input-error.error-text {
              bottom: -10px;
            }
          }
        }

        &__block-select-field {
          margin-top: 8px;
        }

        &__block-select-label {
          color: #aaa;
          display: block;
          font-size: 14px;
          font-weight: 600;
          padding-top: 8px;
        }

        &__block-select {
          width: 100%;

          ::v-deep .el-input__inner {
            border-bottom: 1px solid #fff;
            padding-left: 0;
          }
        }

        &__block-radio-groups {
          display: flex;
          font-size: 14px;

          .input-radio-group {
            &:last-of-type {
              margin-right: 0;
            }
          }
        }
      }
    }

    .preview-datasource {
      background: rgba(0, 0, 0, 0.89);
      height: calc(100vh - 56px - 60px);
      left: 0;
      overflow: auto;
      padding: 40px;
      position: absolute;
      right: 0;
      text-align: left;
      top: 60px;

      &__close-btn {
        color: #fff;
        font-size: 14px;
        position: absolute;
        right: 40px;
        top: 32px;
      }
    }
  }
}
</style>
