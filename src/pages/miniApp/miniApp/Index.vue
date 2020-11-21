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
        <template v-if="!isEditMode && !miniApp.settings.editModeData.isPublishing">
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
                    v-if="isEditMode"
                    class="btn-m btn-outline btn-has-icon create-component-btn" 
                    @click="isShowCreateComponentDialog = true">
                    <svg-icon icon-class="plus"/>
                    {{ $t('miniApp.createComponent') }}
                  </button>
                  <button 
                    class="btn-m btn-outline btn-has-icon create-filter-btn" 
                    @click="isShowCreateFilterDialog = true">
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
              <div class="mini-app__dashbaord-components">
                <template v-if="currentDashboard.components.length > 0">
                  <div 
                    v-for="component in currentDashboard.components"
                    :key="component.id"
                    class="component-item">
                    <span class="item-header">
                      <span class="item-title">{{ component.config.diaplayedName }}</span>
                      <div 
                        v-if="isEditMode" 
                        class="component-setting-box">
                        <svg-icon 
                          icon-class="more"
                          class="more-icon" />
                        <dropdown-select
                          :bar-data="componentSettingOptions"
                          @switchDialogName="switchDialogName($event, component.id)"
                        />
                      </div>
                    </span>
                    <task
                      :component-id="component.keyResultId"
                      intend="key_result"
                    />
                  </div>
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
      @closeDialog="isShowCreateFilterDialog = false"
      @create="createFilters"
      @filterCreated="filterCreated"
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
  updateAppName,
  deleteMiniApp
} from '@/API/MiniApp'
import CreateDashboardDialog from './dialog/CreateDashboardDialog.vue'
import CreateComponentDialog from './dialog/CreateComponentDialog.vue'
import CreateFilterDialog from './dialog/CreateFilterDialog.vue'
import DeleteDashboardDialog from './dialog/DeleteDashboardDialog.vue'
import DeleteComponentDialog from './dialog/DeleteComponentDialog.vue'
import UpdateDashboardNameDialog from './dialog/UpdateDashboardNameDialog.vue'
import InputVerify from '@/components/InputVerify'
import DropdownSelect from '@/components/select/DropdownSelect'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'MiniApp',
  components: {
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
    DecideDialog
  },
  data () {
    return {
      miniApp: {},
      currentDashboardId: null,
      currentComponentId: null,
      isShowCreateDashboardDialog: false,
      isShowCreateComponentDialog: false,
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
      isShowCreateFilterDialog: false
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
      return this.isEditMode ? editModeData : viewModeData
    },
    dashboardList () {
      if (!this.appData) return []
      return this.appData.dashboards
    },
    currentDashboard () {
      return this.dashboardList.length > 0 ? this.dashboardList.find(item => item.id === this.currentDashboardId) : {}
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
        // TODO 重新設定元件的功能
        // {
        //   title: 'button.setting',
        //   icon: 'filter-setting',
        //   dialogName: 'DeleteComponent'
        // },
        {
          title: 'button.delete',
          icon: 'delete',
          dialogName: 'DeleteComponent'
        }
      ]
    },
    miniAppId () {
      return this.$route.params.mini_app_id
    }                        
  },
  created () {
    this.getMiniAppInfo()  
  },
  methods: {
    getMiniAppInfo () {
      this.isLoading = true
      getMiniAppInfo(this.miniAppId)
        .then(miniAppInfo => {
          this.miniApp = miniAppInfo
          this.newAppEditModeName = this.appData.displayedName

          // 如果有 dashboard, focus 在第一個
          if (this.dashboardList.length > 0) {
            this.currentDashboardId = this.dashboardList[0].id
            this.newDashboardName = this.currentDashboard.name
          }
        })
        .catch(() => {})
        .finally(() => this.isLoading = false )
    },
    createDashboard (newDashBoardInfo) {
      const updatedMiniAppData = JSON.parse(JSON.stringify(this.miniApp))
      updatedMiniAppData.settings.editModeData.dashboards.push({
        ...newDashBoardInfo,
        components: []
      })
      this.currentDashboardId = newDashBoardInfo.id
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
        .catch(() => {})
    },
    activeCertainDashboard (dashboardId) {
      this.isEditingDashboardName = false
      this.currentDashboardId = dashboardId
      this.newDashboardName = this.currentDashboard.name
    },
    createFilters () {
      // TODO: connect to api
      this.isShowCreateFilterDialog = false
    },
    filterCreated (filterList) {
      const currentDashboardIndex = this.miniApp.settings.editModeData.dashboards.findIndex(dashboard => dashboard.id === this.currentDashboardId)
      this.miniApp.settings.editModeData.dashboards[currentDashboardIndex].filterList = filterList
      this.updateAppSetting()
      this.isShowCreateFilterDialog = false
      // TODO: 加狀態
    },
    switchDialogName (eventName, id) {
      this[`isShow${eventName}Dialog`] = true
      if (eventName === 'DeleteComponent') this.currentComponentId = id
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
            z-index: 1;
            /deep/ .dropdown-select-box {
              box-shadow: 0px 2px 5px rgba(34, 117, 125, 0.5);
              top: calc(50% + 17px);
              right: -3px;
              left: unset;
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
      .component-item {
        width: calc(50% - 8px);
        float: left;
        padding: 16px;
        background-color: #192323;
        border-radius: 5px;
        margin-bottom: 16px;
        &:nth-child(odd) {
          margin-right: 16px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .item-title {
            color: #DDD;
            @include text-hidden;
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
              z-index: 1;
              /deep/ .dropdown-select-box {
                box-shadow: 0px 2px 5px rgba(34, 117, 125, 0.5);
                top: 31px;
                left: -29px;
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
        .task {
          width: 100%;
        }
      }
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
}

.dropdown-select {
  visibility: hidden;
}
</style>
