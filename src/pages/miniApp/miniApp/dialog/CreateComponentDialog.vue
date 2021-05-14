<template>
  <div class="dialog">
    <nav class="dialog__nav">
      <div class="nav--left">
        <div
          class="icon-arrow"
          @click="$emit('close')">
          <svg-icon icon-class="arrow-left" />
        </div>
        {{ currentComponent.init ? $t('miniApp.editComponent') : $t('miniApp.createComponent') }}
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
        <template v-if="isCreatedViaAsking">
          <div 
            v-if="!currentComponent.init" 
            class="search-bar">
            <data-frame-menu
              :redirect-on-change="false"
              :is-show-preview-entry="true"
              :is-show-advance-setting-entry="false"
            />
            <ask-block
              :redirect-on-ask="false"
              :is-show-ask-helper-entry="false"
            />
          </div>
          <dashboard-component
            :current-component="currentComponent"
            :is-addable.sync="isAddable"
            :is-loading.sync="isLoading"
            :filters="filters"
            :controls="controls"
            @setDiagram="currentComponent.diagram = $event"
          />
          <transition name="fast-fade-in">
            <section 
              v-if="isShowPreviewDataSource"
              class="preview-datasource">
              <preview-data-source
                :is-previewing="true"
                mode="popup"
              />
              <a 
                href="javascript:void(0)" 
                class="preview-datasource__close-btn"
                @click="closePreviewDataSource"
              ><svg-icon icon-class="close"/></a>
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
        class="dialog__content--right">
        <div class="setting__header">
          <svg-icon icon-class="filter-setting"/>
          {{ $t('miniApp.componentSetting') }}
        </div>
        <!-- Title Setting -->
        <div class="setting__content">
          <div class="setting__block">
            <div class="setting__label-block">{{ $t('miniApp.componentName') }}</div>
            <input-verify
              v-validate="'required'"
              v-model="currentComponent.config.diaplayedName"
              name="createComponentDisplayName"
            />
          </div>
        </div>
        <!--Related dashboard of current component-->
        <div 
          v-if="isShowRelatedOption" 
          class="setting__content">
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
              >{{ errors.first('createRelatedDashboard') }}</div>
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
                >{{ errors.first('createTriggerColumn') }}</div>
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
                >{{ errors.first('createColumnRelatedDashboard') }}</div>
              </div>
            </template>
          </div>
        </div>
        <!--Update frequency-->
        <div 
          v-if="isShowUpdatedOption" 
          class="setting__content">
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
              >{{ errors.first('createUpdateFrequency') }}</div>
            </div>
          </div>
        </div>
        <!--Index type component font size setting-->
        <div 
          v-if="isShowFontSizeOption" 
          class="setting__content">
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
              <default-select 
                v-model.number="currentComponent.config.size.row"
                :option-list="rowSpanOption"
                :placeholder="$t('miniApp.chooseRowSize')"
                class="setting__block-select"
                name="rowSpan"
              />
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
import { mapState } from 'vuex'
import { algoConfig } from '@/utils/general'

export default {
  inject: ['$validator'],
  name: 'CreateComponentDialog',
  components: {
    DataFrameMenu,
    FormulaSetting,
    SimulatorSetting,
    DefaultSelect,
    AskBlock,
    ResultDisplay,
    DashboardComponent,
    InputVerify
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
    }
  },
  data () {
    return {
      isAddable: null,
      isLoading: false,
      isFailed: false,
      currentComponent: null,
      selectedTriggerColumn: null,
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
    ...mapState('chatBot', ['parserLanguage']),
    ...mapState('dataSource', ['appQuestion']),
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    isShowPreviewDataSource () {
      return this.$store.state.previewDataSource.isShowPreviewDataSource
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
    isCreatedViaAsking () {
      return this.currentComponent && this.currentComponent.isCreatedViaAsking
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
    }
  },
  mounted () {
    this.currentComponent = JSON.parse(JSON.stringify(this.initialCurrentComponent))
    // 所有可以不需透過問問句就能創建的元件類型
    const isDirectAddableComponentTypes = ['formula', 'simulator', 'parameters-optimized-simulator']
    this.isAddable = isDirectAddableComponentTypes.includes(this.currentComponent.type)
    const columnInfo = this.currentComponent.config.tableRelationInfo.columnRelations[0].columnInfo
    this.selectedTriggerColumn = columnInfo && columnInfo.dataColumnId
  },
  destroyed () {
    this.$store.commit('result/updateCurrentResultInfo', null)
    this.$store.commit('result/updateCurrentResultId', null)
    this.$store.commit('dataSource/setAppQuestion', null)
    if (this.isShowPreviewDataSource) this.closePreviewDataSource()
  },
  methods: {
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
      return componentName.match(regex);
    },
    saveComponent () {
      this.$validator.validateAll().then(valid => {
        if (!valid) return
        this.$emit('updateSetting', {
          ...this.currentComponent,
          ...this.formulaComponentInfo,
          ...this.modelComponentInfo
        })
      })
    },
    closePreviewDataSource () {
      this.$store.commit('previewDataSource/togglePreviewDataSource', false)
    },
    updateRefreshFrequency (isTurnedOn) {
      if(isTurnedOn) return
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
      this.currentComponent['algoConfig'] = this.algoConfig[intent.toLowerCase()]
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
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &__nav {
    flex: 0 0 56px;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.55);
    border-bottom: 1px solid #232C2E;
    .nav--left {
      display: flex;
      align-items: center;
      .icon-arrow {
        cursor: pointer;
        color: $theme-color-primary;
        margin-right: 20px;
      }
    }
    .nav--right {
      display: flex;
      .message {
        font-size: 12px;
        line-height: 36px;
        color: #FFDF6F;
        margin-right: 6px;
      }
    }
  }
  &__content {
    flex: 1;
    height: 0;
    overflow: auto;
    overflow: overlay; // 讓scrollbar不佔位。for有支援此屬性的瀏覽器
    display: flex;
    
    &--left {
      position: relative;
      flex: 1;
      min-width: 0;
      border-right: 1px solid #232C2E;
      .search-bar {
        position: relative;
        z-index: 4;
        height: 60px;
        display: flex;
        padding: 8px 24px;
        border-bottom: 1px solid #232C2E;
        .data-frame-select-block {
          width: 300px;
          margin-right: 16px;
        }
      }
    }
    &--right {
      flex: 0 0 280px;
      .setting {
        &__header {
          height: 60px;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #232C2E;
          .svg-icon {
            width: 16px;
            color: $theme-color-primary;
            margin-right: 12px;
          }
        }
        &__content {
          padding: 16px 24px;
          border-bottom: 1px solid #232C2E;
        }
        &__label-block {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          font-size: 14px;
          color: #FFFFFF;
          font-weight: 600;
          &-description {
            font-size: 12px;
            color: #AAA;
            margin-top: 12px;
          }
        }
        &__block {
          /deep/ .input-verify {
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
          display: block;
          color: #AAAAAA;
          font-weight: 600;
          font-size: 14px;
          padding-top: 8px;
        }
        &__block-select {
          width: 100%;
          /deep/ .el-input__inner {
            padding-left: 0;
            border-bottom: 1px solid #FFFFFF;
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
      height: calc(100vh - 56px - 60px);
      position: absolute;
      top: 60px;
      right: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.89);
      overflow: auto;
      padding: 40px;
      text-align: left;

      &__close-btn {
        position: absolute;
        top: 32px;
        right: 40px;
        color: #fff;
        font-size: 14px;
      }
    }
  }
}
</style>