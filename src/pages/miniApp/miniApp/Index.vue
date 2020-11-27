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
                @click="publishMiniApp"
              >{{ $t('miniApp.publish') }}</button>
              <template v-if="appData.isPublishing">
                <button
                  :disabled="isProcessing"
                  type="button"
                  class="btn-m btn-default button-container__button"
                  @click="publishMiniApp"
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
                @click="previewMiniApp"
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
          <div 
            v-if="dashboardList.length === 0" 
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
          <template v-else>
            <div class="mini-app__dashboard-list">
              <div class="title">
                <svg-icon 
                  icon-class="dashboard" 
                  class="label-icon"/>
                <span class="label-name">{{ $t('miniApp.dashboardList') }}</span>
                <div
                  v-if="isEditMode"
                  class="create-dashboard-icon-block"
                  @click="isShowCreateDashboardDialog = true"
                >
                  <svg-icon 
                    icon-class="plus" 
                    class="create-dashboard-icon"/>
                </div>
              </div>
              <ul class="item-wrapper">
                <li
                  v-for="dashboard in dashboardList" 
                  :key="dashboard.id"
                  :class="{'is-active': dashboard.id === currentDashboardId}"
                  class="item"
                  @click="activeCertainDashboard(dashboard.id)"
                >
                  <svg-icon 
                    class="item-icon" 
                    icon-class="triangle"/>
                  <span class="item-name">{{ dashboard.name }}</span>
                </li>
              </ul>
            </div>
            <main class="mini-app__dashbaord">
              <div class="mini-app__dashbaord-header">
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
                  <button 
                    style="width: 80px;" 
                    @click="testYController('利潤')">利潤</button>
                  <button 
                    style="width: 80px;" 
                    @click="testYController('成本')">成本</button>
                  <button 
                    style="width: 80px;" 
                    @click="testYController('收入')">收入</button>
                  <button
                    v-if="isEditMode"
                    class="btn-m btn-outline btn-has-icon create-component-btn" 
                    @click="isShowCreateComponentDialog = true">
                    <svg-icon icon-class="plus"/>
                    {{ $t('miniApp.createComponent') }}
                  </button>
                  <button
                    v-if="isEditMode"
                    class="btn-m btn-outline btn-has-icon create-filter-btn" 
                    @click="createSingleChoiceFilter">
                    <svg-icon icon-class="plus"/>
                    新增看板控制項
                  </button>
                  <button
                    v-if="isEditMode"
                    class="btn-m btn-outline btn-has-icon create-filter-btn" 
                    @click="createMulitipleChoiceFilter">
                    <svg-icon icon-class="plus"/>
                    新增篩選條件
                  </button>
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
              <!--Control panel-->
              <filter-control
                v-if="controlColumnValueInfoList.length > 0"
                :key="'control' + currentDashboardId"
                :is-edit-mode="isEditMode"
                :initial-filter-list.sync="controlColumnValueInfoList"
                :is-single-choice-filter="true"
                class="mini-app__dashboard-filter mini-app__dashboard-filter--top"
                @removeFilter="removeFilter($event, 'single')"
              />
              <!--Filter Panel-->
              <filter-control
                v-if="filterColumnValueInfoList.length > 0"
                :key="'filter' + currentDashboardId"
                :is-edit-mode="isEditMode"
                :initial-filter-list.sync="filterColumnValueInfoList"
                :is-single-choice-filter="false"
                class="mini-app__dashboard-filter mini-app__dashboard-filter--bottom"
                @removeFilter="removeFilter($event, 'multiple')"
              />
              <div class="mini-app__dashbaord-components">
                <template v-if="currentDashboard.components.length > 0">
                  <dashboard-task
                    v-for="componentData in currentDashboard.components"
                    :key="componentData.id"
                    :filters="filterColumnValueInfoList"
                    :y-axis-controller="yAxisController"
                    :controls="controlColumnValueInfoList"
                    :component-data="componentData"
                    :is-edit-mode="isEditMode"
                    @redirect="currentDashboardId = $event"
                    @deleteComponentRelation="deleteComponentRelation"
                  >
                    <template slot="drowdown">
                      <dropdown-select
                        :bar-data="componentSettingOptions"
                        @switchDialogName="switchDialogName($event, componentData.id)"
                      />
                    </template>
                  </dashboard-task>
                </template>
                <template v-else>
                  <div class="empty-block">
                    {{ $t('miniApp.noneComponent') }}
                    <button
                      v-if="isEditMode"
                      class="btn-m btn-default btn-has-icon create-btn" 
                      @click="isShowCreateComponentDialog = true">
                      <svg-icon icon-class="plus"/>
                      {{ $t('miniApp.createComponent') }}
                    </button>
                  </div>
                </template>
              </div>
            </main>
          </template>
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
      @close="isShowCreateDashboardDialog = false"
      @create="createDashboard"
    />
    <create-component-dialog
      v-if="isShowCreateComponentDialog"
      @close="isShowCreateComponentDialog = false"
      @create="createComponent"
    />
    <create-filter-dialog
      v-if="isShowCreateFilterDialog"
      :is-processing="isProcessing"
      :title="filterCreationDialogTitle"
      :is-single-choice-filter="isSingleChoiceFilter"
      @closeDialog="isShowCreateFilterDialog = false"
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
    <create-component-relation-dialog
      v-if="isShowCreateComponentRelationDialog"
      :dashboard-list="dashboardList"
      :dashboard-id="currentDashboardId"
      :related-dashboard="currentComponent.relatedDashboard"
      @close="isShowCreateComponentRelationDialog = false"
      @create="createComponentRelation"
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
  </div>
</template>

<script>
import CustomDropdownSelect from '@/components/select/CustomDropdownSelect'
import moment from 'moment'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import {
  getMiniAppInfo,
  updateAppSetting,
  deleteMiniApp
} from '@/API/MiniApp'
import DashboardTask from './components/DashboardTask'
import CreateDashboardDialog from './dialog/CreateDashboardDialog.vue'
import CreateComponentDialog from './dialog/CreateComponentDialog.vue'
import CreateFilterDialog from './dialog/CreateFilterDialog.vue'
import CreateComponentRelationDialog from './dialog/CreateComponentRelationDialog.vue'
import DeleteDashboardDialog from './dialog/DeleteDashboardDialog.vue'
import DeleteComponentDialog from './dialog/DeleteComponentDialog.vue'
import UpdateDashboardNameDialog from './dialog/UpdateDashboardNameDialog.vue'
import InputVerify from '@/components/InputVerify'
import DropdownSelect from '@/components/select/DropdownSelect'
import FilterControl from './filter/FilterControl'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'MiniApp',
  components: {
    DashboardTask,
    CreateDashboardDialog,
    CreateComponentDialog,
    CreateFilterDialog,
    CreateComponentRelationDialog,
    DeleteDashboardDialog,
    DeleteComponentDialog,
    UpdateDashboardNameDialog,
    InputVerify,
    DropdownSelect,
    CustomDropdownSelect,
    WritingDialog,
    DecideDialog,
    FilterControl
  },
  data () {
    return {
      miniApp: {},
      currentDashboardId: null,
      currentComponentId: null,
      isShowCreateDashboardDialog: false,
      isShowCreateComponentDialog: false,
      isShowCreateComponentRelationDialog: false,
      isShowDeleteDashboardDialog: false,
      isShowDeleteComponentDialog: false,
      isShowUpdateDashboardNameDialog: false,
      isLoading: false,
      isProcessing: false,
      isShowShare: false,
      shareLink: null,
      confirmDeleteText: this.$t('editing.confirmDelete'),
      isShowDelete: false,
      newAppEditModeName: '',
      isEditingAppName: false,
      newDashboardName: '',
      isEditingDashboardName: false,
      filterColumnValueInfoList : [],
      isShowCreateFilterDialog: false,
      yAxisControlList: [
        {
          isSelected: true,
          dataSourceId: 12,
          dataSourceName: '',
          dataFrameId: 45,
          dataFrameName: '',
          columnId: 689,
          dataType: '',
          columnName: '收入'
        },
        {
          isSelected: false,
          dataSourceId: 12,
          dataSourceName: '',
          dataFrameId: 45,
          dataFrameName: '',
          columnId: 689,
          dataType: '',
          columnName: '成本'
        }
      ],
      controlColumnValueInfoList: [],
      isSingleChoiceFilter: false,
      filterCreationDialogTitle: null
    }
  },
  computed: {
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
      return this.dashboardList.length > 0 ? this.dashboardList.find(item => item.id === this.currentDashboardId) : {}
    },
    currentDashboardIndex () {
      return this.currentDashboard ? this.dashboardList.findIndex(d => d.id === this.currentDashboardId) : -1
    },
    currentComponent () {
      return this.currentDashboard ? this.currentDashboard.components.find(comp => comp.id === this.currentComponentId) : {}
    },
    otherFeatureList () {
      if (!this.isEditMode || !this.appData) return []
      return [
        ...(this.appData.isPublishing && [{
          id: 'shareUrl',
          name: this.$t('miniApp.getPublishedUrl')
        }]),
        {
          id: 'deleteMiniApp',
          name: this.$t('miniApp.deleteApplication')
        }
      ]
    },
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    yAxisController () {
      return this.yAxisControlList.length > 0
        ? this.yAxisControlList.find(item => item.isSelected)
        : null
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
    componentSettingOptions () {
      return [
        {
          title: 'miniApp.createRelation',
          icon: 'filter-setting',
          dialogName: 'CreateComponentRelation'
        },
        {
          title: 'button.delete',
          icon: 'delete',
          dialogName: 'DeleteComponent'
        }
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
    currentModeDataType () {
      return this.isViewMode ? 'viewModeData' : 'editModeData'
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
    }
  },
  created () {
    this.getMiniAppInfo()  
  },
  methods: {
    testYController (string) {
      this.yAxisControlList = [
        {
          isSelected: '收入' === string,
          dataSourceId: 12,
          dataSourceName: '',
          dataFrameId: 45,
          dataFrameName: '',
          columnId: 689,
          dataType: '',
          columnName: '收入'
        },
        {
          isSelected: '成本' === string,
          dataSourceId: 12,
          dataSourceName: '',
          dataFrameId: 45,
          dataFrameName: '',
          columnId: 689,
          dataType: '',
          columnName: '成本'
        },
        {
          isSelected: '利潤' === string,
          dataSourceId: 12,
          dataSourceName: '',
          dataFrameId: 45,
          dataFrameName: '',
          columnId: 689,
          dataType: '',
          columnName: '利潤'
        }
      ]
    },
    getMiniAppInfo () {
      this.isLoading = true
      getMiniAppInfo(this.miniAppId)
        .then(miniAppInfo => {
          this.miniApp = miniAppInfo
          this.newAppEditModeName = this.appData.displayedName

          // 如果有 dashboard, focus 在第一個
          if (this.dashboardList.length > 0 && !this.currentDashboardId) {
            this.currentDashboardId = this.dashboardList[0].id
            this.newDashboardName = this.currentDashboard.name
          }

          this.initFilters()
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
        columnName: filterInfo.columnName
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
        // case 'DATETIME':
        //   subStraintType = 'range'
        //   subStraintProperties = {
        //     data_type: columnDataType.toLowerCase(),
        //     dc_id: selectColumn.id,
        //     display_name: selectColumn.name,
        //     end: null,
        //     start: null 
        //   }
        //   break
        case 'NUMERIC':
          filter = {
            ...filter,
            dataMax: filterInfo.dataMax || null,
            dataMin: filterInfo.dataMin || null,
            start: filterInfo.start || null,
            end: filterInfo.end || null
          }
          break
      }
      return filter
    },
    initFilters () {
      this.filterColumnValueInfoList = this.currentFilterList.map(filter => this.formatRestraint(filter))
      this.controlColumnValueInfoList = this.currentControlList.map(filter => this.formatRestraint(filter))
    },
    createDashboard (newDashBoardInfo) {
      const updatedMiniAppData = JSON.parse(JSON.stringify(this.miniApp))
      updatedMiniAppData.settings.editModeData.dashboards.push({
        ...newDashBoardInfo,
        components: [],
        filterList: [],
        controlList: []
      })
      this.currentDashboardId = newDashBoardInfo.id
      this.initFilters()
      this.isShowCreateDashboardDialog = false
      this.updateAppSetting(updatedMiniAppData)
        .then(() => { this.miniApp = updatedMiniAppData })
    },
    createComponent (newComponentInfo) {
      const updatedMiniAppData = JSON.parse(JSON.stringify(this.miniApp))
      updatedMiniAppData.settings.editModeData.dashboards.forEach(board => {
        if (board.id === this.currentDashboardId) {
          board.components.push(newComponentInfo)
        }
      })
      this.isShowCreateComponentDialog = false
      this.updateAppSetting(updatedMiniAppData)
        .then(() => { this.miniApp = updatedMiniAppData })
        .finally(() => this.isProcessing = false)
    },
    createComponentRelation (relatedDashboard) {
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))
      const component = editedMiniApp.settings.editModeData.dashboards[this.currentDashboardIndex].components.find(comp => comp.id === this.currentComponentId)
      component.relatedDashboard = relatedDashboard

      this.updateAppSetting(editedMiniApp)
        .then(() => {
          this.currentComponentId = null
          this.miniApp = editedMiniApp
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => this.isShowCreateComponentRelationDialog = false)
    },
    deleteComponentRelation (componentId) {
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))
      const component = editedMiniApp.settings.editModeData.dashboards[this.currentDashboardIndex].components.find(comp => comp.id === componentId)
      component.relatedDashboard = { id: null, name: null }

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
    publishMiniApp () {
      this.isProcessing = true
      const updatedMiniAppData = JSON.parse(JSON.stringify(this.miniApp))
      // 更新發佈狀態
      updatedMiniAppData.settings.editModeData.isPublishing = true
      // 更新發佈區資料
      updatedMiniAppData.settings.viewModeData = {
        dashboards: this.miniApp.settings.editModeData.dashboards,
        updateDate: new Date(),
        displayedName: this.miniApp.settings.editModeData.displayedName
      }
      this.updateAppSetting(updatedMiniAppData)
        .then(() => { this.miniApp = updatedMiniAppData })
        .finally(() => this.isProcessing = false)
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
        .then(() => { this.miniApp = updatedMiniAppData })
        .finally(() => this.isProcessing = false)
    },
    formatTimeStamp (timestampe) {
      return moment(timestampe).format('YYYY/M/D')
    },
    previewMiniApp () {
      const { name, params } = this.$route
      const routeData = this.$router.resolve({
        name, 
        params, 
        query: { mode: 'preview' } })
      window.open(routeData.href, '_blank')
    },
    showShareDialog () {
      this.isShowShare = true
      this.shareLink = `${window.location.origin}${this.$route.path}?mode=view`
    },
    closeShare () {
      this.isShowShare = false
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
    updateAppSetting (appInfo, miniAppId = this.miniAppId) {
      return updateAppSetting(miniAppId, { ...appInfo })
    },
    activeCertainDashboard (dashboardId) {
      this.isEditingDashboardName = false
      this.currentDashboardId = dashboardId
      this.initFilters()
      this.newDashboardName = this.currentDashboard.name
    },
    saveCreatedFilter (filterList) {
      this.isProcessing = true
      const dashboradIndex = this.dashboardList.findIndex(board => board.id === this.currentDashboardId)
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))

      // 決定要新增到控制項或篩選條件中
      if (this.isSingleChoiceFilter) {
        editedMiniApp.settings.editModeData.dashboards[dashboradIndex].controlList.push(...filterList)
      } else {
        editedMiniApp.settings.editModeData.dashboards[dashboradIndex].filterList.push(...filterList)
      }

      // 更新 app 資料
      this.updateAppSetting(editedMiniApp)
        .then(() => {
          this.isShowCreateFilterDialog = false
          this.getMiniAppInfo() 
        })
        .finally(() => this.isProcessing = false)
    },
    switchDialogName (eventName, id) {
      this[`isShow${eventName}Dialog`] = true
      if (eventName === 'DeleteComponent') this.currentComponentId = id
      if (eventName === 'CreateComponentRelation') this.currentComponentId = id
    },
    removeFilter (updatedFilterList, type) {
      this.isProcessing = true
      const dashboradIndex = this.dashboardList.findIndex(board => board.id === this.currentDashboardId)
      const editedMiniApp = JSON.parse(JSON.stringify(this.miniApp))

      // 決定要新增到控制項或篩選條件中
      if (type === 'single') {
        editedMiniApp.settings.editModeData.dashboards[dashboradIndex].controlList = updatedFilterList
      } else {
        editedMiniApp.settings.editModeData.dashboards[dashboradIndex].filterList = updatedFilterList
      }

      // 更新 app
      this.updateAppSetting(editedMiniApp)
        .then(() => {
          this.isShowCreateFilterDialog = false
          this.miniApp = editedMiniApp
        })
        .finally(() => this.isProcessing = false)
    },
    createMulitipleChoiceFilter () {
      this.isShowCreateFilterDialog = true
      this.isSingleChoiceFilter = false
      this.filterCreationDialogTitle = this.$t('miniApp.createFilterCondition')
    },
    createSingleChoiceFilter () {
      this.isShowCreateFilterDialog = true
      this.isSingleChoiceFilter = true
      this.filterCreationDialogTitle = this.$t('miniApp.createPanelControl')
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
    z-index: 4;
    flex: 0 0 56px;
    padding: 0 24px;
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
        margin-top: 20px;
      }
    }
  }
  &__dashboard-list {
    flex: 0 0 240px;
    display: flex;
    flex-direction: column;
    background-color: #000;
    border-right: 1px solid #232C2E;
    .title {
      padding-left: 26px;
      padding-right: 20px;
      color: $theme-color-primary;
      flex: 0 0 48px;
      line-height: 48px;
      display: flex;
      align-items: center;
      .label-name {
        padding-left: 6px;
        flex: 1;
      }
    }
    .item-wrapper {
      overflow: overlay;
      flex: 1;
      margin: 0;
      padding: 0;
      list-style: none;
      .item {
        min-height: 48px;
        padding: 12px 0;
        display: flex;
        align-items: center;
        cursor: pointer;
        color: #8B9B9C;
        &:hover {
          color: #FFF;
        }
        &-icon {
          visibility: hidden;
          height: 12px;
          margin: 0 16px 0 24px;
          transform: translate(-1px, -1px) rotate(-30deg);
          flex-shrink: 0;
        }
        &-name {}
        &.is-active {
          background-color: #42A5B3;
          color: #FFF;
          .item-icon {
            visibility: visible;
          }
        }
      }
    }
    .create-dashboard-icon-block {
      flex: 0 0 48px;
      cursor: pointer;
      text-align: right;
    }
  }
  &__dashbaord {
    flex: 1;
    padding: 20px 0 0 20px;
    display: flex;
    flex-direction: column;
    &-header {
      position: relative;
      z-index: 3;
      flex: 0 0 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-right: 20px;
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
      }
      .create-filter-btn {
        margin-left: 8px;
      }
      .cancel-btn {
        margin-left: 6px;
      }
    }

    &-filters {
      display: flex;
      justify-content: space-between;
      padding-right: 20px;
    }

    &-components {
      flex: 1;
      height: 0;
      overflow: overlay;
      padding-right: 20px;
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

  &__dashboard-filter {
    &--top {
      z-index: 2;
      margin-bottom: 12px;
    }
    &--bottom {
      z-index: 1;
      margin-bottom: 20px;
    }
  }
}

.dropdown-select {
  visibility: hidden;
}
</style>
