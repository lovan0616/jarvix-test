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
            class="icon-arrow"
            @click="$router.push({ name: 'MiniAppList' })">
            <svg-icon icon-class="arrow-left" />
          </div>
          <div class="app-name">
            <template v-if="isEditingAppName">
              <input-verify
                v-validate="`required|max:${max}`"
                key="appNameInput"
                v-model="newAppName"
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
              {{ miniApp.name }}
              <div
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
        <div class="nav--right">
          <!-- TODO -->
        </div>
      </nav>
      <div class="mini-app__content">
        <div 
          v-if="dashboardList.length === 0" 
          class="empty-block">
          {{ $t('miniApp.noneDashboard') }}
          <button 
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
                <div @click="isEditingDashboardName = true">
                  <svg-icon 
                    icon-class="edit" 
                    class="icon-edit"/>
                </div>
              </template>
              <button 
                class="btn-m btn-outline btn-has-icon create-component-btn" 
                @click="isShowCreateComponentDialog = true">
                <svg-icon icon-class="plus"/>
                {{ $t('miniApp.createComponent') }}
              </button>
              <div class="dashboard-setting-box">
                <svg-icon 
                  icon-class="more"
                  class="more-icon" />
                <dropdown-select
                  :bar-data="dashboardSettingOptions"
                  @switchDialogName="switchDialogName($event)"
                />
              </div>
            </div>
            <div class="mini-app__dashbaord-components">
              <div 
                v-if="currentDashboard.components.length === 0" 
                class="empty-block">
                {{ $t('miniApp.noneComponent') }}
                <button 
                  class="btn-m btn-default btn-has-icon create-btn" 
                  @click="isShowCreateComponentDialog = true">
                  <svg-icon icon-class="plus"/>
                  {{ $t('miniApp.createComponent') }}
                </button>
              </div>
              <template v-else>
                <div 
                  v-for="component in currentDashboard.components"
                  :key="component.id"
                  class="component-item">
                  <span class="item-header">
                    <span class="item-title">{{ component.config.diaplayedName }}</span>
                    <div class="component-setting-box">
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
      @close="isShowCreateDashboardDialog = false"
      @create="createDashboard"
    />
    <create-component-dialog
      v-if="isShowCreateComponentDialog"
      @close="isShowCreateComponentDialog = false"
      @create="createComponent"
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
  </div>
</template>

<script>
import { getMiniAppInfo, updateAppSetting, updateAppName } from '@/API/MiniApp'
import CreateDashboardDialog from './dialog/CreateDashboardDialog.vue'
import CreateComponentDialog from './dialog/CreateComponentDialog.vue'
import DeleteDashboardDialog from './dialog/DeleteDashboardDialog.vue'
import DeleteComponentDialog from './dialog/DeleteComponentDialog.vue'
import InputVerify from '@/components/InputVerify'
import DropdownSelect from '@/components/select/DropdownSelect'
import { Message } from 'element-ui'

export default {
  inject: ['$validator'],
  name: 'MiniApp',
  components: {
    CreateDashboardDialog,
    CreateComponentDialog,
    DeleteDashboardDialog,
    DeleteComponentDialog,
    InputVerify,
    DropdownSelect
  },
  data () {
    return {
      miniApp: {},
      isLoading: false,
      isProcessing: false,
      currentDashboardId: null,
      currentComponentId: null,
      isShowCreateDashboardDialog: false,
      isShowCreateComponentDialog: false,
      isShowDeleteDashboardDialog: false,
      isShowDeleteComponentDialog: false,
      newAppName: '',
      isEditingAppName: false,
      newDashboardName: '',
      isEditingDashboardName: false
    }
  },
  computed: {
    miniAppId () {
      return this.$route.params.mini_app_id
    },
    dashboardList () {
      return this.miniApp && this.miniApp.settings[this.mode].dashboards
    },
    currentDashboard () {
      return this.dashboardList.length > 0 ? this.dashboardList.find(item => item.id === this.currentDashboardId) : null
    },
    mode () {
      return `${this.$route.query.mode}ModeData`
    },
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    dashboardSettingOptions () {
      return [
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
          this.newAppName = miniAppInfo.name

          // 如果有 dashboard, focus 在第一個
          if (miniAppInfo.settings[this.mode].dashboards.length > 0) {
            this.currentDashboardId = miniAppInfo.settings.editModeData.dashboards[0].id
            this.newDashboardName = this.currentDashboard.name
          }
        })
        .catch(() => {})
        .finally(() => this.isLoading = false )
    },
    createDashboard (newDashBoardInfo) {
      this.miniApp.settings.editModeData.dashboards.push({
        ...newDashBoardInfo,
        components: []
      })
      this.currentDashboardId = newDashBoardInfo.id
      this.isShowCreateDashboardDialog = false
      this.updateAppSetting()
    },
    createComponent (newComponentInfo) {
      this.miniApp.settings.editModeData.dashboards.forEach(board => {
        if (board.id === this.currentDashboardId) {
          board.components.push(newComponentInfo)
        }
      })
      this.isShowCreateComponentDialog = false
      this.updateAppSetting()
    },
    updateAppName () {
      this.$validator.validate('appNameInput')
        .then(valid => {
          if (!valid) return
          
          this.isProcessing = true
          updateAppName(this.miniAppId, { name: this.newAppName })
            .then(() => {
              Message({
                message: this.$t('message.saveSuccess'),
                type: 'success',
                duration: 3 * 1000,
                showClose: true
              })
            })
            .catch(() => {})
            .finally(() => {
              this.miniApp.name = this.newAppName
              this.isEditingAppName = false
              this.isProcessing = false
            } )
        })
    },
    updateDashboardName () {
      this.$validator.validate('dashboardNameInput').then(valid => {
        if (!valid) return

        this.isProcessing = true
        this.miniApp.settings.editModeData.dashboards.forEach(board => {
          if (board.id === this.currentDashboardId) board.name = this.newDashboardName
        })
        
        this.updateAppSetting(this.miniApp)
          .then(() => { this.isEditingDashboardName = false })
          .catch(() => {})
          .finally(() => { this.isProcessing = false })
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
    updateAppSetting (appInfo = this.miniApp, miniAppId = this.miniAppId) {
      return updateAppSetting(miniAppId, { ...appInfo })
        .catch(() => {})
    },
    activeCertainDashboard (dashboardId) {
      this.isEditingDashboardName = false
      this.currentDashboardId = dashboardId
      this.newDashboardName = this.currentDashboard.name
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
    .nav--left {
      display: flex;
      align-items: center;
      .app-name {
        display: flex;
        align-self: center;
        font-size: 20px;
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
      .name {
        font-size: 20px;
        line-height: 28px;
      }
      .icon-edit {
        color: $theme-color-primary;
        margin-left: 12px;
        cursor: pointer;
      }
      .create-component-btn {
        margin-left: auto;
      }
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
      .cancel-btn {
        margin-left: 6px;
      }
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
}

.dropdown-select {
  visibility: hidden;
}
</style>
