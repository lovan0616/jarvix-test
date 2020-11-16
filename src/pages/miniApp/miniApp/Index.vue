<template>
  <div class="wrapper wrapper--without-nav-header mini-app">
    <main class="mini-app__page">
      <nav class="mini-app__nav">
        <div class="nav--left">
          <div
            class="icon-arrow"
            @click="$router.push({ name: 'MiniAppList' })">
            <svg-icon icon-class="arrow-left" />
          </div>
          <div class="dashboard-name">{{ appData.displayedName }}</div>
        </div>
        <div class="nav--right">
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
                @click="currentDashboardId = dashboard.id"
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
              <span class="name">{{ currentDashboard.name }}</span>
              <button 
                class="btn-m btn-outline btn-has-icon" 
                @click="isShowCreateComponentDialog = true">
                <svg-icon icon-class="plus"/>
                {{ $t('miniApp.createComponent') }}
              </button>
            </div>
            <div class="mini-app__dashbaord-components">
              <div 
                v-if="!currentDashboard.componentList || currentDashboard.componentList.length === 0" 
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
                  v-for="component in currentDashboard.componentList"
                  :key="component.id"
                  class="component-item">
                  <span class="item-title">
                    {{ component.title }}
                  </span>
                  <task
                    :component-id="component.id"
                    intend="key_result"
                  />
                </div>
              </template>
            </div>
          </main>
        </template>
      </div>
    </main>
    <create-dashboard-dialog
      v-if="isShowCreateDashboardDialog"
      @closeDialog="isShowCreateDashboardDialog = false"
      @create="createDashboard"
    />
    <create-component-dialog
      v-if="isShowCreateComponentDialog"
      @closeDialog="isShowCreateComponentDialog = false"
      @create="createComponent"
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
import CreateDashboardDialog from './CreateDashboardDialog.vue'
import CreateComponentDialog from './CreateComponentDialog.vue'
import CustomDropdownSelect from '@/components/select/CustomDropdownSelect'
import moment from 'moment'
import DecideDialog from '@/components/dialog/DecideDialog'
import WritingDialog from '@/components/dialog/WritingDialog'
import { Message } from 'element-ui'

export default {
  name: 'MiniApp',
  components: {
    CreateDashboardDialog,
    CreateComponentDialog,
    CustomDropdownSelect,
    WritingDialog,
    DecideDialog
  },
  data () {
    return {
      miniApp: {
        id: 0,
        name: '營運分析',
        settings: {
          editModeData: {
            dashboards: [
              {
                id: 0,
                name: 'Dashboard 1',
                components: [
                  {
                    id: 0,
                    keyResultId: 222,
                    resultId: 72781,
                    orderSequence: 1,
                    config: {
                      displayedName: 'Component1',
                      question: "利潤前十"
                    }
                  }
                ]
              }
            ],
            displayedName: 'App1',
            isPublishing: true
          },
          viewModeData: {
            dashboards: [],
            updateDate: null,
            isPublishing: true,
            displayedName: 'App1'
          }
        },
        description: '營運分析應用程式',
        icon: 'icon-name',
        group_id: 1,
        createDate: "2020-11-10T09:48:40.511+0000",
        updateDate: "2020-11-10T09:48:40.511+0000",
      },
      currentDashboardId: 0,
      isShowCreateDashboardDialog: false,
      isShowCreateComponentDialog: false,
      isLoading: false,
      isProcessing: false,
      isShowShare: false,
      shareLink: null,
      confirmDeleteText: this.$t('editing.confirmDelete'),
      isShowDelete: false
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
      if (this.dashboardList.length === 0) return {}
      return this.dashboardList.find(item => item.id === this.currentDashboardId)
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
    }                             
  },
  methods: {
    createDashboard (newDashBoardInfo) {
      this.miniApp.dashboardList.push({
        ...newDashBoardInfo,
        componentList: []
      })
      this.currentDashboardId = newDashBoardInfo.id
      this.isShowCreateDashboardDialog = false
    },
    createComponent (newComponentInfo) {
      this.dashboardList.forEach(board => {
        if (board.id === this.currentDashboardId) {
          board.componentList.push(newComponentInfo)
        }
      })
      this.isShowCreateComponentDialog = false
    },
    publishMiniApp () {
      this.miniApp.settings.viewModeData = {
        dashboards: this.miniApp.settings.editModeData.dashboards,
        updateDate: new Date(),
        isPublishing: true,
        displayedName: this.miniApp.settings.editModeData.displayedName
      }
      // TODO: connect to API
      this.miniApp.settings.editModeData.isPublishing = true
    },
    unpublishMiniApp () {
      this.miniApp.settings.viewModeData = {
        dashboards: [],
        updateDate: new Date(),
        isPublishing: false,
        displayedName: null
      }
      // TODO: connect to API
      this.miniApp.settings.editModeData.isPublishing = false
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
      // deleteMiniApp(this.tempEditInfo.id)
      //   .then(() => {
      //     Message({
      //       message: this.$t('message.deleteSuccess'),
      //       type: 'success',
      //       duration: 3 * 1000,
      //       showClose: true
      //     })
      //     this.isShowDelete = false
      //     this.fetchData()
      //   })
      //   .finally(() => { this.isProcessing = false })
    },
  }
}
</script>

<style lang="scss" scoped>
.mini-app {
  &__page {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
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
    padding: 20px;
    overflow: overlay;
    &-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .name {
        font-size: 20px;
        line-height: 28px;
      }
    }
    &-components {
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
        .item-title {
          color: #DDD;
        }
        .task {
          width: 100%;
        }
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
</style>
