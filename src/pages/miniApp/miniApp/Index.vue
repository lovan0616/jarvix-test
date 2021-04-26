<template>
  <div class="wrapper wrapper--without-nav-header mini-app">
    <spinner
      v-if="isLoading"
      :title="$t('editing.loading')"
      size="50"/>
    <main 
      v-else 
      class="mini-app__page">
      <nav class="mini-app__nav">
        <div class="nav--left">
          <div
            v-if="isEditMode"
            class="icon-arrow"
            @click="$router.push({ name: 'MiniAppList' })">
            <svg-icon icon-class="arrow-left" />
          </div>
          <div
            v-else
            class="app-logo"
          >
            <img src="@/assets/images/logo-light.svg">
          </div>
          <div
            :class="{ 'is-live': !isEditMode }"
            class="app-name"
          >
            <template v-if="isEditingAppName">
              <input-verify
                v-validate="`required|max:${max}`"
                key="appNameInput"
                v-model="newAppEditModeName"
                class="new-name-input"
                name="appNameInput"
              />
              <button
                class="btn-m btn-default" 
                @click="updateAppName">
                <svg-icon
                  v-if="isProcessing"
                  icon-class="spinner"/>
                {{ $t('button.save') }}
              </button>
              <button
                class="btn-m btn-outline cancel-btn"
                @click="isEditingAppName = false"
              >
                {{ $t('button.cancel') }}
              </button>
            </template>
            <template v-else>
              {{ appData.displayedName }}
              <div
                v-if="isEditMode"
                class="edit-app-name"
                @click="isEditingAppName = true"
              >
                <svg-icon 
                  icon-class="edit" 
                  class="icon-edit"/>
              </div>
            </template>
          </div>
        </div>
        <div
          v-if="isEditMode"
          class="nav--right"
        >
          <div class="button-container"> 
            <span
              v-if="miniApp.settings.viewModeData.updateDate"
              class="button-container__time"
            >
              {{ $t('miniApp.updateTime') + '：' + formatTimeStamp(miniApp.settings.viewModeData.updateDate) }}
            </span>
            <template v-if="isEditMode">
              <span
                :class="{ 'button-container__status--active': appData.isPublishing }"
                class="button-container__status"
              >
                {{ appData.isPublishing ? $t('miniApp.hasPublished') : $t('miniApp.notPublished') }}
              </span>
              <button
                v-if="!appData.isPublishing"
                :disabled="isProcessing"
                type="button"
                class="btn-m btn-default button-container__button"
                @click="publishMiniApp('publish')"
              >{{ $t('miniApp.publish') }}</button>
              <template v-if="appData.isPublishing">
                <button
                  :disabled="isProcessing"
                  type="button"
                  class="btn-m btn-default button-container__button"
                  @click="publishMiniApp('update')"
                >{{ $t('button.update') }}</button>
                <button
                  :disabled="isProcessing"
                  type="button"
                  class="btn-m btn-secondary button-container__button"
                  @click="unpublishMiniApp"
                >{{ $t('miniApp.unpublish') }}</button>
              </template>
              <button 
                type="button"
                class="btn-m btn-secondary button-container__button"
                @click="directToCertainModeMiniApp('preview')"
              >{{ $t('miniApp.preview') }}</button>
              <custom-dropdown-select
                :data-list="otherFeatureList"
                trigger="hover"
                @select="doOtherFeature"
              >
                <template #display>
                  <button
                    type="button"
                    class="btn-m btn-secondary button-container__button"
                  >
                    <svg-icon 
                      icon-class="more" 
                      class="icon"/>
                  </button>
                </template>
              </custom-dropdown-select>
            </template>
          </div>
        </div>
      </nav>
      <div class="mini-app__content">
        <template v-if="(isViewMode && !miniApp.settings.editModeData.isPublishing)">
          <div class="empty-block">
            {{ $t('miniApp.noData') }}
          </div>
        </template>
        <template v-else>
          <mini-app-side-nav
            :is-edit-mode="isEditMode"
            :dashboard-list="dashboardList"
            :current-dashboard-id="currentDashboardId"
            :is-warning-module-activate="appData.warningModule.activate"
            :is-show-warning-module="isShowWarningModule"
            @openWarningModule="openWarningModule"
            @activeCertainDashboard="activeCertainDashboard($event)"
            @showCreateDashboardDialog="isShowCreateDashboardDialog = true"
            @updateDashboardOrder="updateDashboardOrder($t('miniApp.dashboard'))"
          />
          <!-- 監控示警模組 -->
          <main 
            v-if="isShowWarningModule && !currentDashboardId"
            class="mini-app__main warning">
            <warning-module
              :setting="appData.warningModule"
              :dashboard-list="dashboardList"
              @update="updateWarningModuleSetting"
              @goToCertainDashboard="warningLogTriggered($event)"
            />
          </main>
          <!-- 分析看板模組 -->
          <div 
            v-else-if="dashboardList.length === 0" 
            class="empty-block">
            {{ $t('miniApp.noneDashboard') }}
            <button
              v-if="isEditMode"
              class="btn-m btn-default btn-has-icon create-btn" 
              @click="isShowCreateDashboardDialog = true">
              <svg-icon icon-class="plus"/>
              {{ $t('miniApp.createDashboard') }}
            </button>
          </div>
          <main 
            v-else
            class="mini-app__main dashboard">
            <div class="dashboard__header">
              <div class="header-left">
                <template v-if="isEditingDashboardName">
                  <input-verify
                    v-validate="`required|max:${max}`"
                    key="dashboardNameInput"
                    v-model="newDashboardName"
                    class="new-name-input"
                    name="dashboardNameInput"
                  />
                  <button
                    class="btn-m btn-default"
                    @click="updateDashboardName"
                  >
                    {{ $t('button.save') }}
                  </button>
                  <button
                    class="btn-m btn-outline cancel-btn"
                    @click="isEditingDashboardName = false"
                  >
                    {{ $t('button.cancel') }}
                  </button>
                </template>
                <template v-else>
                  <span class="name">{{ currentDashboard.name }}</span>
                  <div
                    v-if="isEditMode"
                    @click="isEditingDashboardName = true"
                  >
                    <svg-icon
                      icon-class="edit"
                      class="icon-edit"/>
                  </div>
                </template>
              </div>
              <div class="header-right">
                <custom-dropdown-select
                  v-if="isEditMode"
                  :data-list="componentTypeOptions"
                  :has-bullet-point="false"
                  trigger="hover"
                  class="component-type-dropdown"
                  @select="createComponentType"
                >
                  <template #display>
                    <button class="btn-m btn-outline btn-has-icon create-component-btn">
                      <svg-icon icon-class="plus"/>
                      <span class="button-label">{{ $t('miniApp.component') }}</span>
                      <svg-icon 
                        icon-class="triangle" 
                        class="icon-triangle"/>
                    </button>
                  </template>
                </custom-dropdown-select>
                <custom-dropdown-select
                  v-if="isEditMode"
                  :data-list="controlTypeOptions"
                  :has-bullet-point="false"
                  trigger="hover"
                  @select="createFilterAndControl"
                >
                  <template #display>
                    <button
                      class="btn-m btn-outline btn-has-icon create-filter-btn" 
                      @click.prevent>
                      <svg-icon icon-class="plus"/>
                      <span class="button-label">{{ $t('miniApp.panelControl') }}</span>
                      <svg-icon 
                        icon-class="triangle" 
                        class="icon-triangle"/>
                    </button>
                  </template>
                </custom-dropdown-select>
                <!--Filter-->
                <custom-dropdown-select
                  v-if="isEditMode"
                  :data-list="filterTypeOptions"
                  :has-bullet-point="false"
                  trigger="hover"
                  @select="createFilterAndControl"
                >
                  <template #display>
                    <button
                      class="btn-m btn-outline btn-has-icon create-filter-btn" 
                      @click.prevent>
                      <svg-icon icon-class="plus"/>{{ $t('miniApp.filterCondition') }}
                    </button>
                  </template>
                </custom-dropdown-select>
                <div
                  v-if="isEditMode"
                  class="dashboard-setting-box">
                  <svg-icon
                    icon-class="more"
                    class="more-icon" />
                  <dropdown-select
                    :bar-data="dashboardSettingOptions"
                    @switchDialogName="switchDialogName($event)"
                  />
                </div>
              </div>
            </div>
            <div
              v-if="controlColumnValueInfoList.length > 0 || yAxisControlColumnValueInfoList.length > 0"
              :class="{ 'editing': isEditMode }" 
              class="mini-app__dashboard-control mini-app__dashboard-control--top">
              <!--Control panel-->
              <filter-control-panel
                v-if="controlColumnValueInfoList.length > 0"
                :key="'control' + currentDashboardId"
                :is-edit-mode="isEditMode"
                :initial-filter-list="controlColumnValueInfoList"
                :is-single-choice-filter="true"
                class="mini-app__dashboard-filter"
                @updateFilter="updateFilter($event, 'single')"
                @updateInit="isCurrentDashboardInit = $event"
              />
              <!--Y Axis Control panel-->
              <axis-control-panel
                v-if="yAxisControlColumnValueInfoList.length > 0"
                :key="'yAxisControl' + currentDashboardId"
                :is-edit-mode="isEditMode"
                :initial-control-list="yAxisControlColumnValueInfoList"
                class="mini-app__dashboard-filter"
                @updateControl="updateControl"
              />
            </div>
            <div
              v-if="filterColumnValueInfoList.length > 0"
              :class="{ 'editing': isEditMode }" 
              class="mini-app__dashboard-control mini-app__dashboard-control--bottom">
              <!--Filter Panel-->
              <filter-control-panel
                :key="'filter' + currentDashboardId"
                :is-edit-mode="isEditMode"
                :initial-filter-list="filterColumnValueInfoList"
                :is-single-choice-filter="false"
                class="mini-app__dashboard-filter"
                @updateFilter="updateFilter($event, 'multiple')"
              />
            </div>
            <div class="mini-app__dashboard-components">
              <template v-if="currentDashboard.components.length > 0">
                <draggable
                  :list="currentDashboard.components"
                  :move="logDraggingMovement"
                  :disabled="!isEditMode || currentDashboard.components.length === 1"
                  ghost-class="dragging-ghost"
                  style="height: 100%"
                  @end="updateComponentOrder($t('miniApp.component'))"
                >
                  <dashboard-task
                    v-for="componentData in currentDashboard.components"
                    :key="`${componentData.id} - ${componentData.updateTime}`"
                    :filters="filterColumnValueInfoList"
                    :y-axis-controls="yAxisControlColumnValueInfoList"
                    :controls="controlColumnValueInfoList"
                    :component-data="componentData"
                    :is-edit-mode="isEditMode"
                    :warning-module-setting="appData.warningModule"
                    :is-current-dashboard-init="isCurrentDashboardInit"
                    @redirect="activeCertainDashboard($event)"
                    @deleteComponentRelation="deleteComponentRelation"
                    @columnTriggered="columnTriggered"
                    @rowTriggered="rowTriggered"
                    @chartTriggered="chartTriggered"
                    @warningLogTriggered="warningLogTriggered($event)"
                    @goToCertainDashboard="activeCertainDashboard($event)"
                    @switchDialogName="handleDashboardSwitchName($event, componentData)"
                  >
                    <template 
                      v-if="componentData.type === 'monitor-warning-list'" 
                      slot="icon">
                      <svg-icon 
                        icon-class="warning" 
                        class="warning-icon"/>
                    </template>
                  </dashboard-task>
                </draggable>
              </template>
              <template v-else>
                <div class="empty-block">
                  {{ $t('miniApp.noneComponent') }}
                  <button
                    v-if="isEditMode"
                    class="btn-m btn-default btn-has-icon create-btn" 
                    @click="createGeneralComponent">
                    <svg-icon icon-class="plus"/>
                    {{ $t('miniApp.createComponent') }}
                  </button>
                </div>
              </template>
            </div>
          </main>
        </template>
      </div>
    </main>
    <div 
      v-show="isProcessing" 
      class="dialog">
      <spinner 
        :title="$t('button.processing')"
        size="50"/>
    </div>
    <create-dashboard-dialog
      v-if="isShowCreateDashboardDialog"
      :is-processing="isProcessingCreateDashboard"
      @close="isShowCreateDashboardDialog = false"
      @create="createDashboard"
    />
    <create-component-dialog
      v-if="isShowCreateComponentDialog"
      :initial-current-component="currentComponent || initComponent"
      :dashboard-list="dashboardList"
      :filters="filterColumnValueInfoList"
      :controls="controlColumnValueInfoList"
      @close="closeCreateComponentDialog"
      @create="createComponent"
      @updateSetting="updateComponentSetting"
    />
    <create-filter-dialog
      v-if="isShowCreateFilterDialog"
      :is-processing="isProcessing"
      :title="filterCreationDialogTitle"
      :is-single-choice-filter="isSingleChoiceFilter"
      :is-y-axis-controller="isYAxisController"
      :is-hierarchical-filter="isHierarchicalFilter"
      @closeDialog="closeFilterCreationDialog"
      @filterCreated="saveCreatedFilter"
    />
    <delete-dashboard-dialog
      v-if="isShowDeleteDashboardDialog"
      :dashboard-name="currentDashboard.name"
      @close="isShowDeleteDashboardDialog = false"
      @confirm="deleteDashboard"
    />
    <delete-component-dialog
      v-if="isShowDeleteComponentDialog"
      @close="isShowDeleteComponentDialog = false"
      @confirm="deleteComponent"
    />
    <update-dashboard-name-dialog
      v-if="isShowUpdateDashboardNameDialog"
      :original-dashboard-name="currentDashboard.name"
      @close="isShowUpdateDashboardNameDialog = false"
      @confirm="updateDashboardNameByDialog"
    />
    <writing-dialog
      v-if="isShowShare"
      :title="$t('miniApp.getPublishedUrl')"
      :button="$t('button.copy')"
      :show-both="false"
      @closeDialog="closeShare"
      @confirmBtn="copyLink"
    >
      <input
        ref="shareInput"
        v-model="shareLink" 
        readonly 
        type="text" 
        class="input mini-app__dialog-input">
    </writing-dialog>
    <decide-dialog
      v-if="isShowDelete"
      :is-processing="isProcessing"
      :title="`${confirmDeleteText} ${appData.displayedName}？`"
      :type="'delete'"
      @closeDialog="closeDelete"
      @confirmBtn="confirmDelete"
    />
    <component-to-alert-condition-dialog
      v-if="isShowCreateWarningCriteriaDialog"
      :component-data="componentToWarningCriteriaData"
      @update="addComponentAlertToWarningModuleSetting"
      @close="closeCreateWarningCriteriaDialog"
      @converted="closeCreateWarningCriteriaDialog"
      @confirm="deleteComponent" 
    />
  </div>
</template>

<script>
import CustomDropdownSelect from '@/components/select/CustomDropdownSelect'
import DefaultSelect from '@/components/select/DefaultSelect'
import moment from 'moment'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import SySelect from '@/components/select/SySelect'
import {
  getMiniAppInfo,
  updateAppSetting,
  deleteMiniApp
} from '@/API/MiniApp'
import MiniAppSideNav from './components/MiniAppSideNav'
import DashboardTask from './components/dashboard-components/DashboardTask'
import CreateDashboardDialog from './dialog/CreateDashboardDialog.vue'
import CreateComponentDialog from './dialog/CreateComponentDialog.vue'
import CreateFilterDialog from './dialog/CreateFilterDialog.vue'
import DeleteDashboardDialog from './dialog/DeleteDashboardDialog.vue'
import DeleteComponentDialog from './dialog/DeleteComponentDialog.vue'
import UpdateDashboardNameDialog from './dialog/UpdateDashboardNameDialog.vue'
import InputVerify from '@/components/InputVerify'
import DropdownSelect from '@/components/select/DropdownSelect'
import FilterControlPanel from './filter/FilterControlPanel'
import AxisControlPanel from './filter/AxisControlPanel'
import WarningModule from './components/warning-module/WarningModule'
import ComponentToAlertConditionDialog from './dialog/ComponentToAlertConditionDialog'
import { Message } from 'element-ui'
import { v4 as uuidv4 } from 'uuid'
import draggable from 'vuedraggable'
import { compileMiniApp } from '@/utils/backwardCompatibilityCompiler.js'
import { mapState } from 'vuex'

export default {
  inject: ['$validator'],
  name: 'MiniApp',
  components: {
    MiniAppSideNav,
    DashboardTask,
    CreateDashboardDialog,
    CreateComponentDialog,
    CreateFilterDialog,
    DeleteDashboardDialog,
    DeleteComponentDialog,
    UpdateDashboardNameDialog,
    InputVerify,
    DropdownSelect,
    CustomDropdownSelect,
    WritingDialog,
    SySelect,
    DecideDialog,
    FilterControlPanel,
    AxisControlPanel,
    WarningModule,
    draggable,
    DefaultSelect,
    ComponentToAlertConditionDialog
  },
  data () {
    return {
      miniApp: {},
      currentDashboardId: null,
      currentComponentId: null,
      componentToWarningCriteriaData: {},
      isShowWarningModule: false,
      isShowCreateDashboardDialog: false,
      isShowCreateComponentDialog: false,
      isShowDeleteDashboardDialog: false,
      isShowDeleteComponentDialog: false,
      isShowCreateWarningCriteriaDialog: false,
      isShowUpdateDashboardNameDialog: false,
      isLoading: false,
      isProcessing: false,
      isProcessingCreateDashboard: false,
      isShowShare: false,
      shareLink: null,
      confirmDeleteText: this.$t('editing.confirmDelete'),
      isShowDelete: false,
      newAppEditModeName: '',
      isEditingAppName: false,
      newDashboardName: '',
      isEditingDashboardName: false,
      filterColumnValueInfoList : [],
      controlColumnValueInfoList: [],
      yAxisControlColumnValueInfoList: [],
      isShowCreateFilterDialog: false,
      isSingleChoiceFilter: null,
      isHierarchicalFilter: null,
      isYAxisController: null,
      filterCreationDialogTitle: null,
      draggedContext: { index: -1, futureIndex: -1 },
      isCurrentDashboardInit: false,
      scriptOptionList: [],
      initComponent: null,
      isMiniAppCompiled: false
    }
  },
  computed: {
    ...mapState('chatBot', ['parserLanguage']),
    mode () {
      return this.$route.query.mode
    },
    isEditMode () {
      return this.mode && this.mode === 'edit'
    },
    isViewMode () {
      return this.mode && this.mode === 'view'
    },
    isPreviewMode () {
      return this.mode && this.mode === 'preview'
    },
    appData () {
      if (!this.miniApp.settings) return false
      const { editModeData, viewModeData } = this.miniApp.settings
      return this.isEditMode || this.isPreviewMode ? editModeData : viewModeData
    },
    dashboardList () {
      if (!this.appData) return []
      return this.appData.dashboards
    },
    currentDashboard () {
      return this.dashboardList.length > 0 ? this.dashboardList.find(item => item.id === this.currentDashboardId) : null
    },
    currentDashboardIndex () {
      return this.currentDashboard ? this.dashboardList.findIndex(d => d.id === this.currentDashboardId) : -1
    },
    currentComponent () {
      return this.currentDashboard ? this.currentDashboard.components.find(comp => comp.id === this.currentComponentId) : null
    },
    otherFeatureList () {
      if (!this.isEditMode || !this.appData) return []
      return [
        ...(this.appData.isPublishing && [
          {
            id: 'shareUrl',
            name: this.$t('miniApp.getPublishedUrl')
          },
          {
            id: 'goToLivePage',
            name: this.$t('miniApp.goToLivePage')
          },
        ]),
        {
          id: 'deleteMiniApp',
          name: this.$t('miniApp.deleteApplication')
        }
      ]
    },
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    dashboardSettingOptions () {
      return [
        {
          title: 'miniApp.updateDashboardName',
          icon: 'edit',
          dialogName: 'UpdateDashboardName'
        },
        {
          title: 'miniApp.deleteDashboard',
          icon: 'delete',
          dialogName: 'DeleteDashboard'
        }
      ]
    },
    controlTypeOptions () {
      return [
        {
          name: this.$t('miniApp.generalControl'),
          id: 'SingleChoiceFilter'
        },
        {
          name: this.$t('miniApp.hierarchicalFilter'),
          id: 'HierarchicalFilter'
        },
        {
          name: this.$t('miniApp.yAxisControl'),
          id: 'YAxisController'
        }
      ]
    },
    componentTypeOptions () {
      return [
        {
          name: this.$t('miniApp.generalComponent'),
          id: 'General'
        },
        {
          name: this.$t('miniApp.monitorComponent'),
          id: 'MonitorWarning'
        },
        {
          name: this.$t('miniApp.abnormalStatisticsComponent'),
          children: [
            {
              name: this.$t('miniApp.unhandledAbnormalStatisticsComponent'),
              id: 'UnhandledAbnormalStatistics'
            },
            {
              name: this.$t('miniApp.handledAbnormalStatisticsComponent'),
              id: 'HandledAbnormalStatistics'
            }
          ]
        },
        {
          name: this.$t('miniApp.simulateComponent'),
          children: [
            {
              name: this.$t('miniApp.modelSimulateComponent'),
              id: 'Simulator'
            },
            // 暫時不開放給使用者使用
            // {
            //   name: this.$t('miniApp.parametersOptimizedSimulateComponent'),
            //   id: 'ParametersOptimizedSimulator'
            // }
          ]
        },
        {
          name: this.$t('miniApp.specialIndexTypeComponent'),
          id: 'Formula'
        }
      ]
    },
    filterTypeOptions () {
      const hasRelativeDateTimeFilter = this.filterColumnValueInfoList.find(filterSet => filterSet.find(filter => filter.statsType === "RELATIVEDATETIME"))
      return [
        {
          name: this.$t('miniApp.generalFilter'),
          id: 'MulitipleChoiceFilter'
        },
        ...(!hasRelativeDateTimeFilter && [{
          name: this.$t('miniApp.dateTimeFilter'),
          id: 'TimeFilter'
        }])
      ]
    },
    miniAppId () {
      return this.$route.params.mini_app_id
    },
    currentFilterList () {
      return this.currentDashboard ? this.currentDashboard.filterList : []
    },
    currentControlList () {
      return this.currentDashboard ? this.currentDashboard.controlList : []
    },
    yAxisControlList () {
      return this.currentDashboard ? this.currentDashboard.yAxisControlList : []
    },
    currentModeDataType () {
      return this.isViewMode ? 'viewModeData' : 'editModeData'
    },
    isComponentOrderChanged () {
      return this.draggedContext.index !== this.draggedContext.futureIndex
    }
  },
  watch: {
    filterColumnValueInfoList: {
      deep: true,
      handler (filterList) {
        this.miniApp.settings[this.currentModeDataType].dashboards[this.currentDashboardIndex].filterList = filterList
      }
    },
    controlColumnValueInfoList: {
      deep: true,
      handler (controlList) {
        this.miniApp.settings[this.currentModeDataType].dashboards[this.currentDashboardIndex].controlList = controlList
      }
    },
    yAxisControlColumnValueInfoList: {
      deep: true,
      handler (controlList) {
        this.miniApp.settings[this.currentModeDataType].dashboards[this.currentDashboardIndex].yAxisControlList = controlList
      }
    }
  },
  created () {
    this.getMiniAppInfo()  
  },
  methods: {
    getMiniAppInfo () {
      this.isLoading = true
      getMiniAppInfo(this.miniAppId)
        .then(response => {
          let miniAppInfo = response

          // 處理向下兼容性
          if (!this.isMiniAppCompiled) {
            const { updatedAppData, isDataChanged } = compileMiniApp(miniAppInfo)

            // 如果有變更，需要更新到資料庫
            isDataChanged && this.updateAppSetting(updatedAppData)
            miniAppInfo = updatedAppData
            this.isMiniAppCompiled = true
          }
    
          this.miniApp = miniAppInfo
          this.newAppEditModeName = this.appData.displayedName

          // 如果有 dashboard, focus 在第一個
          if (this.dashboardList.length > 0 && !this.currentDashboardId) {
            this.activeCertainDashboard(this.dashboardList[0].id)
          }
          
          this.initFilters()
          // 確認當前 Dashboard 有無控制項是剛被創完需被設定預設值
          // 有的話 component 應等待控制項更新完成後帶上新 reestriction 問問題
          this.isCurrentDashboardInit = !this.controlColumnValueInfoList.some(controlSet => controlSet.some(control => control.dataValues.length === 0))
        })
        .catch(() => {})
        .finally(() => this.isLoading = false )
    },
    formatRestraint (filterInfo) {
      const columnStatsType = filterInfo.statsType      
      let filter = {
        dataSourceName: filterInfo.dataSourceName,
        dataSourceId: filterInfo.dataSourceId,
        dataFrameName: filterInfo.dataFrameName,
        dataFrameId: filterInfo.dataFrameId,
        columnId: filterInfo.columnId,
        dataType: filterInfo.dataType,
        statsType: filterInfo.statsType,
        columnName: filterInfo.columnName,
        ...(filterInfo.isSelected && { isSelected: filterInfo.isSelected })
      }

      switch (columnStatsType) {
        case 'BOOLEAN':
        case 'CATEGORY':
          filter = {
            ...filter,
            dataValues: filterInfo.dataValues || [],
            dataValueOptionList: filterInfo.dataValueOptionList || []
          }
          break
        case 'DATETIME':
          filter = {
            ...filter,
            dataMax: filterInfo.dataMax || null,
            dataMin: filterInfo.dataMin || null,
            start: filterInfo.start || null,
            end: filterInfo.end || null
          }
          break
        case 'NUMERIC':
          filter = {
            ...filter,
            dataMax: filterInfo.dataMax || null,
            dataMin: filterInfo.dataMin || null,
            start: filterInfo.start || null,
            end: filterInfo.end || null
          }
          break
        case 'RELATIVEDATETIME':
          filter = {
            ...filter,
            dataValues: filterInfo.dataValues || [],
            dataValueOptionList: filterInfo.dataValueOptionList || [],
            start: filterInfo.start || null,
            end: filterInfo.end || null
          }
          break
      }
      return filter
    },
    initFilters () {
      // 一般篩選條件
      this.filterColumnValueInfoList = this.currentFilterList.map(filterSet => filterSet.map(filter => this.formatRestraint(filter)))
      // 看板控制項
      this.controlColumnValueInfoList = this.currentControlList.map(filterSet => filterSet.map(filter => this.formatRestraint(filter)))
      // Y 軸控制器
      this.yAxisControlColumnValueInfoList = this.yAxisControlList.map(control => control.map(filter => this.formatRestraint(filter)))
    },
    createDashboard (newDashBoardInfo) {
      const updatedMiniAppData = JSON.parse(JSON.stringify(this.miniApp))
      updatedMiniAppData.settings.editModeData.dashboards.push({
        ...newDashBoardInfo,
        components: [],
        filterList: [],
        controlList: [],
        yAxisControlList: []
      })
      this.isProcessingCreateDashboard = true
      this.updateAppSetting(updatedMiniAppData)
        .then(() => {
          this.miniApp = updatedMiniAppData
          this.activeCertainDashboard(newDashBoardInfo.id, newDashBoardInfo.name)
          this.isShowCreateDashboardDialog = false
          this.isProcessingCreateDashboard = false
        })
    },
    createComponent (newComponentInfo) {
      const updatedMiniAppData = JSON.parse(JSON.stringify(this.miniApp))
      updatedMiniAppData.settings.editModeData.dashboards.forEach(board => {
        if (board.id === this.currentDashboardId) {
          board.components.push(newComponentInfo)
        }
      })
      this.closeCreateComponentDialog()
      this.updateAppSetting(updatedMiniAppData)
        .then(() => { this.miniApp = updatedMiniAppData })
        .finally(() => {
          this.isProcessing = false
          this.currentComponentId = null
        })
    },
    updateComponentSetting (updatedComponentInfo) {
      const updatedMiniAppData = JSON.parse(JSON.stringify(this.miniApp))
      updatedMiniAppData.settings.editModeData.dashboards.forEach((board, boardIndex) => {
        if (board.id === this.currentDashboardId) {
          board.components.forEach((component, componentIndex) => {
            if (component.id === this.currentComponentId) {
              updatedMiniAppData.settings.editModeData.dashboards[boardIndex].components[componentIndex] = {
                ...updatedComponentInfo,
                updateTime: new Date().getTime()
              }
            }
          })
        }
      })
      this.closeCreateComponentDialog()
      this.updateAppSetting(updatedMiniAppData)
        .then(() => { this.miniApp = updatedMiniAppData })
        .catch(() => {})
        .finally(() => this.currentComponentId = null)
    },
    deleteComponentRelation (componentId) {
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))
      const component = editedMiniApp.settings.editModeData.dashboards[this.currentDashboardIndex].components.find(comp => comp.id === componentId)
      component.config.hasRelatedDashboard = false
      component.config.relatedDashboard = null

      this.updateAppSetting(editedMiniApp)
        .then(() => {
          this.miniApp = editedMiniApp
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(() => {})
    },
    publishMiniApp (type) {
      this.isProcessing = true
      const updatedMiniAppData = JSON.parse(JSON.stringify(this.miniApp))
      // 更新發佈狀態
      updatedMiniAppData.settings.editModeData.isPublishing = true
      // 更新發佈區資料
      updatedMiniAppData.settings.viewModeData = {
        dashboards: this.miniApp.settings.editModeData.dashboards,
        updateDate: new Date(),
        displayedName: this.miniApp.settings.editModeData.displayedName,
        warningModule: this.miniApp.settings.editModeData.warningModule
      }
      this.updateAppSetting(updatedMiniAppData)
        .then(() => {
          this.miniApp = updatedMiniAppData
          Message({
            message: type === 'publish' ? this.$t('miniApp.appSuccessfullyPublished') : this.$t('miniApp.appSuccessfullyUpdated'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => setTimeout(() => {
          this.isProcessing = false
        }, 1000))
    },
    unpublishMiniApp () {
      this.isProcessing = true
      const updatedMiniAppData = JSON.parse(JSON.stringify(this.miniApp))
      // 更新發佈狀態
      updatedMiniAppData.settings.editModeData.isPublishing = false
      // 更新發佈區資料
      updatedMiniAppData.settings.viewModeData = {
        dashboards: [],
        updateDate: new Date(),
        isPublishing: false
      }
      this.updateAppSetting(updatedMiniAppData)
        .then(() => {
          this.miniApp = updatedMiniAppData
          Message({
            message: this.$t('miniApp.appSuccessfullyUnpublished'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => setTimeout(() => {
          this.isProcessing = false
        }, 1000))
    },
    formatTimeStamp (timestampe) {
      return moment(timestampe).format('YYYY/M/D')
    },
    directToCertainModeMiniApp (mode) {
      const { name, params } = this.$route
      const routeData = this.$router.resolve({
        name, 
        params, 
        query: { mode: mode } })
      window.open(routeData.href, '_blank')
    },
    showShareDialog () {
      this.isShowShare = true
      this.shareLink = `${window.location.origin}${this.$route.path}?mode=view`
    },
    closeShare () {
      this.isShowShare = false
    },
    closeCreateComponentDialog () {
      this.currentComponentId = null
      this.initComponent = null
      this.isShowCreateComponentDialog = false
    },
    copyLink () {
      let input = this.$refs.shareInput
      input.select()
      /* For mobile devices */
      input.setSelectionRange(0, 99999)
      document.execCommand('copy')

      Message({
        message: this.$t('message.copiedToBoard'),
        type: 'success',
        duration: 3 * 1000,
        showClose: true
      })
      this.isShowShare = false
    },
    doOtherFeature (action) {
      if (action === 'shareUrl') return this.showShareDialog()
      if (action === 'deleteMiniApp') return this.showDeleteDialog()
      if (action === 'goToLivePage') return this.directToCertainModeMiniApp('view')
    },
    showDeleteDialog (miniAppInfo) {
      this.isShowDelete = true
    },
    closeDelete () {
      this.isShowDelete = false
    },
    confirmDelete () {
      this.isProcessing = true
      deleteMiniApp(this.miniAppId)
        .then(() => {
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.isShowDelete = false
          this.$router.push({ name: 'MiniAppList' })
        })
        .finally(() => { this.isProcessing = false })
    },
    updateAppName () {
      this.$validator.validate('appNameInput')
        .then(valid => {
          if (!valid) return
          
          const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))
          editedMiniApp.settings.editModeData.displayedName = this.newAppEditModeName

          this.isProcessing = true
          this.updateAppSetting(editedMiniApp)
            .then(() => this.miniApp = editedMiniApp)
            .catch(() => {})
            .finally(() => {
              this.isEditingAppName = false
              this.isProcessing = false
            })
        })
    },
    updateDashboardName () {
      this.$validator.validate('dashboardNameInput').then(valid => {
        if (!valid) return

        this.isProcessing = true
        const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))
        editedMiniApp.settings.editModeData.dashboards.forEach(board => {
          if (board.id === this.currentDashboardId) board.name = this.newDashboardName
        })
        
        this.updateAppSetting(editedMiniApp)
          .then(() => {
            this.isEditingDashboardName = false
            this.miniApp = editedMiniApp
          })
          .catch(() => {})
          .finally(() => { this.isProcessing = false })
      })
    },
    updateDashboardNameByDialog (newDashboardName) {
      this.isProcessing = true
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))
      editedMiniApp.settings.editModeData.dashboards.forEach(board => {
        if (board.id === this.currentDashboardId) board.name = newDashboardName
      })
      
      this.updateAppSetting(editedMiniApp)
        .then(() => {
          this.miniApp = editedMiniApp
          this.newDashboardName = newDashboardName
        })
        .catch(() => {})
        .finally(() => {
          this.isShowUpdateDashboardNameDialog = false
          this.isProcessing = false
        })
    },
    deleteDashboard () {
      const dashboradIndex = this.dashboardList.findIndex(board => board.id === this.currentDashboardId)
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))
      editedMiniApp.settings.editModeData.dashboards.splice(dashboradIndex, 1)
      
      this.updateAppSetting(editedMiniApp)
        .then(() => {
          // 預設 focus 到剩餘 Dashboard 的第一個，若刪光了就 null
          const newDashboards = editedMiniApp.settings.editModeData.dashboards
          this.currentDashboardId = newDashboards.length ? newDashboards[0].id : null
          this.miniApp = editedMiniApp

          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(() => {})
        .finally(() => this.isShowDeleteDashboardDialog = false)
    },
    deleteComponent () {
      const componentIndex = this.currentDashboard.components.findIndex(comp => comp.id === this.currentComponentId)
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))
      editedMiniApp.settings.editModeData.dashboards.forEach(board => {
        if (board.id === this.currentDashboardId) board.components.splice(componentIndex, 1)
      })

      this.updateAppSetting(editedMiniApp)
        .then(() => {
          this.currentComponentId = null
          this.miniApp = editedMiniApp

          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(() => {})
        .finally(() => this.isShowDeleteComponentDialog = false)
    },
    updateWarningModuleSetting (warningModule) {
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))
      editedMiniApp.settings.editModeData.warningModule = warningModule

      this.updateAppSetting(editedMiniApp)
        .then(() => {
          this.miniApp = editedMiniApp

          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .catch(() => {})
    },
    updateAppSetting (appInfo, miniAppId = this.miniAppId) {
      return updateAppSetting(miniAppId, { ...appInfo })
    },
    activeCertainDashboard (dashboardId, dashboardName) {
      if (this.currentDashboardId === dashboardId) return
      if (!this.dashboardList.find(item => item.id === dashboardId)) {
        return Message({
          message: this.$t('miniApp.dashboardNoLongerExist'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
      }
      this.isEditingDashboardName = false
      this.isShowWarningModule = false
      this.currentDashboardId = dashboardId
      this.initFilters()
      this.newDashboardName = dashboardName || this.currentDashboard.name
    },
    saveCreatedFilter (filterList) {
      this.isProcessing = true
      const dashboradIndex = this.dashboardList.findIndex(board => board.id === this.currentDashboardId)
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))

      // 決定要新增到控制項或篩選條件中
      if (this.isYAxisController) {
        editedMiniApp.settings.editModeData.dashboards[dashboradIndex].yAxisControlList.push(filterList)
      } else if (this.isSingleChoiceFilter) {
        editedMiniApp.settings.editModeData.dashboards[dashboradIndex].controlList.push(...filterList)
      } else {
        editedMiniApp.settings.editModeData.dashboards[dashboradIndex].filterList.push(...filterList)
      } 

      // 更新 app 資料
      this.updateAppSetting(editedMiniApp)
        .then(() => {
          this.isShowCreateFilterDialog = false
          this.isSingleChoiceFilter = null
          this.isYAxisController = null
          this.getMiniAppInfo() 
        })
        .finally(() => this.isProcessing = false)
    },
    switchDialogName (eventName, componentData) {
      this[`isShow${eventName}Dialog`] = true
      switch(eventName) {
        case 'DeleteComponent':
        case 'CreateComponent':
          this.currentComponentId = componentData && componentData.id
          break
        case 'CreateWarningCriteria':
          this.componentToWarningCriteriaData = {
            ...componentData,
            controlList: this.currentDashboard.controlList,
            filterList: this.currentDashboard.filterList
          }
        break
      }
    },
    closeCreateWarningCriteriaDialog () {
      this.componentToWarningCriteriaData = {}
      this.isShowCreateWarningCriteriaDialog = false
    },
    addComponentAlertToWarningModuleSetting (conditionId) {
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))
      editedMiniApp.settings.editModeData.warningModule.conditions.push({
        id: conditionId, 
        relatedDashboardId: null
      })
      this.updateAppSetting(editedMiniApp)
        .then(() => this.miniApp = editedMiniApp)
        .catch(() => {})
    },
    updateFilter (updatedFilterList, type) {
      const dashboradIndex = this.dashboardList.findIndex(board => board.id === this.currentDashboardId)
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))

      // 決定要新增到控制項或篩選條件中
      editedMiniApp.settings.editModeData.dashboards[dashboradIndex][type === 'single' ? 'controlList' : 'filterList'] = updatedFilterList
      this[type === 'single' ? 'controlColumnValueInfoList' : 'filterColumnValueInfoList'] = [...updatedFilterList]
      
      // edit mode 下可以賦予預設值，其餘模式則無法
      if (!this.isEditMode) return this.isProcessing = false

      // 更新 app
      this.updateAppSetting(editedMiniApp)
        .then(() => this.miniApp = editedMiniApp)
        .catch(() => {})
    },
    updateControl (updatedControlList) {
      const dashboradIndex = this.dashboardList.findIndex(board => board.id === this.currentDashboardId)
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))

      editedMiniApp.settings.editModeData.dashboards[dashboradIndex].yAxisControlList = updatedControlList
      this['yAxisControlColumnValueInfoList'] = [...updatedControlList]

      // edit mode 下可以賦予預設值，其餘模式則無法
      if (!this.isEditMode) return this.isProcessing = false

      // 更新 app
      this.updateAppSetting(editedMiniApp)
        .then(() => this.miniApp = editedMiniApp)
        .catch(() => {})
    },
    closeFilterCreationDialog () {
      this.isShowCreateFilterDialog = false
      this.isHierarchicalFilter = false
      this.isSingleChoiceFilter = null
      this.isYAxisController = null
    },
    createMulitipleChoiceFilter () {
      this.isShowCreateFilterDialog = true
      this.isHierarchicalFilter = false
      this.isSingleChoiceFilter = false
      this.filterCreationDialogTitle = this.$t('miniApp.createFilterCondition')
    },
    createSingleChoiceFilter () {
      this.isShowCreateFilterDialog = true
      this.isHierarchicalFilter = false
      this.isSingleChoiceFilter = true
      this.filterCreationDialogTitle = this.$t('miniApp.createPanelControl')
    },
    createHierarchicalFilter () {
      this.isShowCreateFilterDialog = true
      this.isSingleChoiceFilter = true
      this.isHierarchicalFilter = true
      this.filterCreationDialogTitle = this.$t('miniApp.createHierarchicalFilter')
    },
    createYAxisController () {
      this.isShowCreateFilterDialog = true
      this.isHierarchicalFilter = null
      this.isYAxisController = true
      this.filterCreationDialogTitle = this.$t('miniApp.createSingleYAxisController')
    },
    createDefaultComponent (componentType) {
      this.isProcessing = true
      this.currentComponentId = null
      const updatedMiniAppData = JSON.parse(JSON.stringify(this.miniApp))
      updatedMiniAppData.settings.editModeData.dashboards.forEach(board => {
        if (board.id === this.currentDashboardId) {
          board.components.push(this.componentTemplateFactory(componentType))
        }
      })
      this.closeCreateComponentDialog()
      this.updateAppSetting(updatedMiniAppData)
        .then(() => { this.miniApp = updatedMiniAppData })
        .finally(() => this.isProcessing = false)
    },
    createMonitorWarningComponent () {
      this.createDefaultComponent('monitor-warning-list')
    },
    createUnhandledAbnormalStatisticsComponent () {
      this.createDefaultComponent('unhandled-abnormal-statistics')
    },
    createHandledAbnormalStatisticsComponent () {
      this.createDefaultComponent('handled-abnormal-statistics')
    },
    createSimulatorComponent () {
      this.initComponent = this.componentTemplateFactory('simulator')
      this.isShowCreateComponentDialog = true
    },
    createParametersOptimizedSimulatorComponent () {
      this.initComponent = this.componentTemplateFactory('parameters-optimized-simulator')
      this.isShowCreateComponentDialog = true
    },
    createGeneralComponent () {
      this.initComponent = this.componentTemplateFactory()
      this.isShowCreateComponentDialog = true
    },
    createFormulaComponent () {
      this.initComponent = this.componentTemplateFactory('formula')
      this.isShowCreateComponentDialog = true
    },
    createTimeFilter () {
      this.isSingleChoiceFilter = false
      this.saveCreatedFilter([[{
        id: Date.now().toString(),
        dataSourceId: null,
        dataSourceName: null,
        dataFrameId: null,
        dataFrameName: null,
        columnId: null,
        dataType: null,
        statsType: 'RELATIVEDATETIME',
        columnName: this.$t('miniApp.dateTimeFilter'),
      }]])
    },
    createFilterAndControl (type) {
      this[`create${type}`]()
    },
    warningLogTriggered ({ relatedDashboardId, rowData }) {
      this.activeCertainDashboard(relatedDashboardId)
      
      // 控制項
      if (rowData.controlList.length > 0 && this.controlColumnValueInfoList.length > 0) {
        this.controlColumnValueInfoList.forEach(controlSet => {
          controlSet.forEach(control => {
            // 如果 log rowData 有欄位同 controller 欄位，就將預設值設定為該筆 rowData 該 column 的值
            // 判斷條件：同 columnId 或同 columnName
            const sameColumnRow = rowData.controlList.find(column => column.dataColumnId === control.columnId || column.displayName === control.columnName)
            if (sameColumnRow) control.dataValues = [sameColumnRow.datum[0]]
          })
        })
      }

      // 篩選器
      if (rowData.filterList.length > 0 && this.filterColumnValueInfoList.length > 0) {
        this.filterColumnValueInfoList.forEach(filterSet => {
          filterSet.forEach(filter => {
            // 如果 log rowData 有欄位同 filter 欄位，就將預設值設定為該筆 rowData 該 column 的值
            // 判斷條件：同 columnId 或同 columnName
            const sameColumnRow = rowData.filterList.find(column => column.dataColumnId === filter.columnId || column.displayName === filter.columnName)
            if (sameColumnRow) filter.dataValues = [sameColumnRow.datum[0]]
          })
        })
      }
    },
    columnTriggered ({ relatedDashboardId, cellValue, columnId, columnName }) {
      this.activeCertainDashboard(relatedDashboardId)
      this.controlColumnValueInfoList.forEach(filterSet => {
        filterSet.forEach(filter => {
          // 如果目標 Dashboard 已設定該欄位 controller，就將預設值設定為剛剛使用者點的 cell 的值
          if (filter.columnId === columnId || columnName === filter.columnName) filter.dataValues = [cellValue]
        })
      })
    },
    rowTriggered ({ relatedDashboardId, rowData }) {
      this.activeCertainDashboard(relatedDashboardId)
      this.controlColumnValueInfoList.forEach(filterSet => {
        filterSet.forEach(filter => {
          const matchedColumn = rowData.find(column => column.columnId === filter.columnId || column.columnName === filter.columnName)
          // 如果目標 Dashboard 已設定該欄位 controller，就將預設值設定為剛剛使用者點的 cell 的值
          if (matchedColumn) filter.dataValues = [matchedColumn.cellValue]
        })
      })
    },
    chartTriggered ({ relatedDashboardId, restrictions }) {
      this.activeCertainDashboard(relatedDashboardId)
      this.controlColumnValueInfoList.forEach(filterSet => {
        filterSet.forEach(filter => {
          // 確認有無對應到欲前往的 dashboard 中的任一控制項
          const targetRestriction = restrictions.find(restriction => filter.columnId === restriction.dc_id || filter.columnName === restriction.display_name)

          if (targetRestriction) {
            const value = targetRestriction.value
            // 檢查 Category 類型的 Chart 中的值是否為數字，若為數字會被加上 []，這邊需要把數字取出來
            const regex = /^\[.+\]$/gm
            filter.dataValues = [regex.test(value) ? value.substring(1, value.length - 1) : value]
          }
        })
      })
    },
    createComponentType (type) {
      this[`create${type}Component`]()
    },
    openWarningModule () {
      this.isProcessing = true
      getMiniAppInfo(this.miniAppId)
        .then(miniAppInfo => {
          this.miniApp = miniAppInfo
          this.isShowWarningModule = true
          this.currentDashboardId = null
        })
        .catch(() => {})
        .finally(() => this.isProcessing = false )
    },
    componentTemplateFactory (type = 'chart') {

      const generalConfig = {
        size: { row: 6, column: 6 },
        hasRelatedDashboard: false,
        relatedDashboard: null
      }

      // 一般元件
      return {
        init: false,
        id: uuidv4(),
        type,
        isCreatedViaAsking: true,
        resultId: null,
        orderSequence: null,
        diagram: type,
        indexInfo: { 
          unit: ''
        },
        relatedDashboard: { id: null, name: null },
        config: {
          ...generalConfig,
          diaplayedName: '',
          isAutoRefresh: false,
          refreshFrequency: null,
          hasTableRelatedDashboard: false, // 目前只給 table 元件使用
          tableRelationInfo: {
            triggerTarget: 'column',
            columnRelations: [{ relatedDashboardId: null, columnInfo: null }],
            rowRelation: { relatedDashboardId: null }
          },
          fontSize: 'middle',
        },
        algoConfig: null,
        anomalySettings: [],
        // 給定 null 值存到 DB 時，整個屬性會被拔除，所以先給定預設值
        parserLanguage: this.parserLanguage,
        updateTime: new Date().getTime(),
        // 監控示警元件
        ...(type === 'monitor-warning-list' && {
          init: true,
          isCreatedViaAsking: false,
          config: {
            ...generalConfig,
            diaplayedName: this.$t('alert.realTimeMonitorAlert'),
          },
        }),
        // 異常統計元件
        ...(type.includes('abnormal-statistics') && {
          init: true,
          type: 'abnormal-statistics',
          isCreatedViaAsking: false,
          config: {
            ...generalConfig,
            fontSize: 'middle',
            diaplayedName: this.getAbnormalStatisticsDisplayName(type),
          },
        }),
        // 模擬器元件
        ...((type === 'simulator' || type === 'parameters-optimized-simulator') && {
          isCreatedViaAsking: false,
          config: {
            ...generalConfig,
            // demo 因為有八個 Input，先設定六個列
            size: { row: 12, column: 12 },
            diaplayedName: type === 'simulator' ? this.$t(`miniApp.simulator`) : this.$t(`miniApp.parametersOptimizedSimulator`)
          },
          modelSetting: {
            dataSourceId: null,
            dataFrameId: null,
            modelId: null,
            inputList: []
          }
        }),
        // 特殊數值行元件
        ...(type === 'formula' && {
          isCreatedViaAsking: false,
          formulaSetting: {
            dataSourceId: null,
            dataFrameId: null,
            formulaId: null,
            displayedFormula: null,
            inputList: []
          }
        }),
      }
    },
    getAbnormalStatisticsDisplayName (type) {
      const stringList = type.split('-')
      const displayName = stringList.reduce((acc, cur, index) => {
        return acc + (index !== 0 ? cur.replace(/^./, cur[0].toUpperCase()) : cur.replace(/^./, cur[0].toLowerCase()))
      }, '')
      return this.$t(`miniApp.${displayName}Component`).slice(0, 7)
    },
    logDraggingMovement (e) {
      const { index, futureIndex } = e.draggedContext
      this.draggedContext = { index, futureIndex }
    },
    updateDashboardOrder (target) {
      this.updateOrder(target)
    },
    updateComponentOrder (target) {
      if (!this.isComponentOrderChanged) return
      this.updateOrder(target)
      this.draggedContext = { index: -1, futureIndex: -1 }
    },
    updateOrder (target) {
      this.updateAppSetting(this.miniApp).then(() => {
        Message({
          message: this.$t('miniApp.orderUpdated', { target }),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
      })
    },
    handleDashboardSwitchName({ name, componentComplementaryInfo }, componentData) {
      this.switchDialogName(name, {
        ...componentData,
        ...componentComplementaryInfo
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin dropdown-select-controller {
  &:hover {
    .dropdown-select { visibility: visible; }
  }
}
@mixin dropdown-select-position ($top: 0, $right: 0, $left: 0, $before: 0) {
  box-shadow: 0px 2px 5px rgba(34, 117, 125, 0.5);
  top: calc(50% + 17px);
  right: -3px;
  left: unset;
  &:before { right: 7px; }
  .dropdown-flex {
    min-width: unset;
  }
}

.mini-app {
  .spinner-block {
    margin-top: 30vh;
  }
  &__page {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    /deep/ .new-name-input {
      margin-right: 16px;
      .input-verify-text {
        height: 30px;
        margin-bottom: 0;
      }
      .input-error {
        bottom: -16px;
      }
    }
  }
  &__nav {
    position: relative;
    z-index: 5;
    flex: 0 0 56px;
    padding: 0 20px 0 24px;
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.55);
    border-bottom: 1px solid #232C2E;
    justify-content: space-between;
    .nav--left {
      display: flex;
      align-items: center;
      .app-logo {
        padding-right: 24px;
      }
      .app-name {
        display: flex;
        align-self: center;
        font-size: 20px;
        &.is-live {
          line-height: 30px;
          border-left: 1px solid #404949;
          padding-left: 24px;
          line-height: 30px;
          font-weight: 600;
          letter-spacing: 4px;
        }
        &:hover {
          .icon-edit {
            visibility: visible;
          }
        }
      }
      .icon-arrow {
        cursor: pointer;
        color: $theme-color-primary;
        margin-right: 20px;
      }
      .icon-edit {
        margin-left: 12px;
        color: $theme-color-primary;
        font-size: 16px;
        cursor: pointer;
        visibility: hidden;
      }
      .cancel-btn {
        margin-left: 6px;
      }
    }
    .nav--right {
      cursor: pointer;
      color: $theme-color-primary;
    }
  }
  &__content {
    flex: 1;
    height: 0;
    display: flex;
    .empty-block {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 30vh;
      color: #DDDDDD;
      font-size: 18px;
      .create-btn {
        color: #004046;
        margin-top: 20px;
        .svg-icon {
          margin-right: 6px;
        }
      }
    }
  }
  &__main {
    flex: 1;
    padding: 20px 0 0 20px;
    display: flex;
    flex-direction: column;
    min-width: 0;
    &-header {
      position: relative;
      z-index: 4;
      flex: 0 0 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-right: 20px;
    }
    &.warning {}
    &.dashboard {
      .dashboard__header {
        position: relative;
        z-index: 4;
        flex: 0 0 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        margin-right: 20px;
        .header-left {
          display: flex;
          align-items: center;
          .name {
            font-size: 20px;
            line-height: 28px;
          }
          &:hover {
            .icon-edit {
              visibility: visible;
            }
          }
          .icon-edit {
            color: $theme-color-primary;
            margin-left: 12px;
            cursor: pointer;
            visibility: hidden;
            &:hover {
              visibility: visible;
            }
          }
        }
        .header-right {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .dashboard-setting-box {
            flex: 0 0 30px;
            height: 30px;
            margin-left: 6px;
            cursor: pointer;
            border: 1px solid #FFF;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            @include dropdown-select-controller;
            .dropdown-select {
              z-index: 2;
              /deep/ .dropdown-select-box {
                box-shadow: 0px 2px 5px rgba(34, 117, 125, 0.5);
                top: calc(50% + 17px);
                right: -3px;
                left: unset;
                z-index: 1;
                &:before { right: 7px; }
                .svg-icon {
                  color: $theme-color-primary;
                }
                .dropdown-flex {
                  min-width: unset;
                }
              }
            }
          }
          .icon-triangle {
            font-size: 8px;
            transform: rotate(180deg);
          }
          .button-label {
            margin: 0 6px;
            &:last-child {
              margin-right: 16px;
            }
          }
          .svg-icon {
            flex: 0 0 14px;
          }
        }
        .create-filter-btn {
          margin-left: 8px;
        }
        .cancel-btn {
          margin-left: 6px;
        }

        /deep/ .dropdown {
          &__list-container {
            left: 0;
            top: calc(100% + 10px);
            text-align: left;
            z-index: 1;
            width: auto;

            &::before {
              position: absolute;
              content: "";
              bottom: 100%;
              left: 0;
              width: 100%;
              background-color: transparent;
              height: 12px;
            }

            &::after {
              position: absolute;
              content: "";
              bottom: 100%;
              left: 50%;
              transform: translateX(-50%);
              border-bottom: 8px solid #2B3839;
              border-left: 8px solid transparent;
              border-right: 8px solid transparent;
            }
          }
          &__link {
            line-height: 39px;
            font-weight: 600;
            font-size: 14px;
          }
        }
        .component-type-dropdown >>> .dropdown__list-container {
          width: 160px;
        }
      }
    }
  }
  &__dashboard {
    &-components {
      height: calc(100vh - 56px - 20px - 50px);
      overflow: auto;
      overflow: overlay; // 讓scrollbar不佔位。for有支援此屬性的瀏覽器
      &:after {
        content: '';
        display: block;
        clear: both;
      }
    }
  }
  &__dialog-input {
    margin: 24px 0px;
    padding-bottom: 8px;
  }

  &__dialog-select-wrapper {
    width: 100%;
    margin: 24px 0;
  }

  &__dialog-select {
    width: 100%;
    border-bottom: 1px solid #ffffff;

    /deep/ .el-input__inner {
      padding-left: 0;
    }
    /deep/ .error-text {
      text-align: left;
    }
  }

  .button-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;

    &__button {
      padding: 5px 10px;
      min-width: unset;
      line-height: 20px;
      &:not(:first-child) {
        margin-left: 8px;
      }
      &.btn-default {
        color: #000;
      }
    }

    &__time {
      font-size: 12px;
      color: #DDDDDD;
    }

    &__status {
      display: inline-block;
      padding: 4px 8px;
      background: #333333;
      border-radius: 24px;
      margin-left: 16px;
      font-size: 12px;
      color: #FFFFFF;

      &::before {
        content: '';
        display: inline-block;
        width: 8px;
        height: 8px;
        border: 1px solid #999999;
        background: transparent;
        border-radius: 50%;
        margin: auto 0;
      }

      &--active {
        &::before {
          border: none;
          background: #2FECB3;
        }
      }
    }

    &__description {
      font-size: 14px;
      line-height: 32px;
      [lang="en"] & {
        text-align: right;
        line-height: 24px;
      }
      .question-lamp {
        color: $theme-color-warning;
      }
    }

    /deep/ .dropdown {
      margin-left: 8px;
      &__list-container {
        left: -109px;
        top: calc(100% + 10px);
        text-align: left;
        z-index: 1;
        width: 160px;

        &::before {
          position: absolute;
          content: "";
          bottom: 100%;
          left: 0;
          width: 100%;
          background-color: transparent;
          height: 12px;
        }

        &::after {
          position: absolute;
          content: "";
          bottom: 100%;
          left: 72%;
          border-bottom: 12px solid #2B3839;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
        }
      }

      &__link {
        font-size: 14px;
        line-height: 40px;
        &::before {
          display: none;
        }
      }
    }
  }

  &__dashboard-control {
    display: flex;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    margin-right: 16px;
    flex-wrap: wrap;
    &--top {
      z-index: 2;
      margin-bottom: 12px;
    }
    &--bottom {
      z-index: 1;
      margin-bottom: 20px;
    }

    &.editing {
      padding: 16px 19px 0 19px;
      background: #1C292B;
    }
  }

  &__dashboard-filter {
    &:not(:last-of-type) {
      margin-right: 20px;
    }
  }

  &__dashboard-components {
    margin-right: 4px;
    .warning-icon {
      color: #FF5C46;
    }
  }
}

.dropdown-select {
  visibility: hidden;
}

.dragging-ghost {
  opacity: 0.5;
  background: #192323;
}
</style>
