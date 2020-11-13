<template>
  <div class="wrapper wrapper--without-nav-header">
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
          <!-- TODO: API 缺 miniApp.name -->
          <div class="dashboard-name">{{ miniApp.name || 'App名字' }}</div>
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
                v-if="!currentDashboard.components || currentDashboard.components.length === 0" 
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
                  :key="component.keyResultId"
                  class="component-item">
                  <span class="item-title">
                    {{ component.config.diaplayedName }}
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
  </div>
</template>

<script>
import { getMiniAppInfo, updateAppSetting } from '@/API/MiniApp'
import CreateDashboardDialog from './dialog/CreateDashboardDialog.vue'
import CreateComponentDialog from './dialog/CreateComponentDialog.vue'

export default {
  name: 'MiniApp',
  components: {
    CreateDashboardDialog,
    CreateComponentDialog
  },
  data () {
    return {
      miniApp: {},
      isLoading: false,
      currentDashboardId: null,
      isShowCreateDashboardDialog: false,
      isShowCreateComponentDialog: false
    }
  },
  computed: {
    miniAppId() {
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
    }
  },
  created () {
    const miniAppId = this.$route.params.mini_app_id
    this.isLoading = true
    getMiniAppInfo(miniAppId)
      .then(miniAppInfo => {
        this.miniApp = miniAppInfo
        
        // 如果有 dashboard, focus 在第一個
        if (miniAppInfo.settings[this.mode].dashboards.length > 0) {
          this.currentDashboardId = miniAppInfo.settings.editModeData.dashboards[0].id
        }
      })
      .catch(() => {})
      .finally(() => this.isLoading = false )
    
  },
  methods: {
    createDashboard (newDashBoardInfo) {
      this.miniApp.settings.editModeData.dashboards.push({
        ...newDashBoardInfo,
        components: []
      })
      this.currentDashboardId = newDashBoardInfo.id
      this.isShowCreateDashboardDialog = false
      this.updateAppSetting(this.miniAppId, this.miniApp)
    },
    createComponent (newComponentInfo) {
      this.dashboardList.forEach(board => {
        if (board.id === this.currentDashboardId) {
          board.components.push(newComponentInfo)
        }
      })
      this.isShowCreateComponentDialog = false
      this.updateAppSetting(this.miniAppId, this.miniApp)
    },
    updateAppSetting (id, info) {
      updateAppSetting(id, {
        // TODO: API 缺這些資訊
        "description": "string",
        "icon": "string",
        "name": "string",
        "status": "Enable",
        ...info
      })
        .then(() => {})
        .catch(() => {})
    }
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
    padding: 20px 0 0 20px;
    display: flex;
    flex-direction: column;
    &-header {
      flex: 0 0 30px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding-right: 20px;
      .name {
        font-size: 20px;
        line-height: 28px;
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
        .item-title {
          color: #DDD;
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

.spinner-block {
  margin-top: 30vh;
}
</style>
