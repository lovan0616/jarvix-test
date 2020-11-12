<template>
  <div class="wrapper wrapper--without-nav-header">
    <main class="mini-app__page">
      <nav class="mini-app__nav">
        <div class="nav--left">
          <div
            class="icon-arrow"
            @click="$router.push({ name: 'MiniAppList' })">
            <svg-icon icon-class="arrow-left" />
          </div>
          <div class="dashboard-name">{{ miniApp.name }}</div>
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
  </div>
</template>

<script>
import CreateDashboardDialog from './CreateDashboardDialog.vue'
import CreateComponentDialog from './CreateComponentDialog.vue'

export default {
  name: 'MiniApp',
  components: {
    CreateDashboardDialog,
    CreateComponentDialog
  },
  data () {
    return {
      miniApp: {
        // MOCK DATA
        name: 'APP的名稱唷唷唷',
        dashboardList: [
          // { id: 2,
          //   name: '嘎嘎',
          //   componentList: [
          //     // { id: 363600, title: '哈哈哈哈哈哈' },
          //     // { id: 363603, title: 'ㄏ呵呵呵呵呵ㄏ呵呵呵呵呵' },
          //     // { id: 363623, title: '嘿嘿嘿嘿' }
          //   ]
          // },
        ],
      },
      currentDashboardId: 2,
      isShowCreateDashboardDialog: false,
      isShowCreateComponentDialog: false
    }
  },
  computed: {
    dashboardList () {
      return this.miniApp.dashboardList
    },
    currentDashboard () {
      return this.dashboardList.find(item => item.id === this.currentDashboardId)
    }
  },
  methods: {
    createDashboard (newDashBoardInfo) {
      this.miniApp.dashboardList.push({
        ...newDashBoardInfo,
        componentList: []
      })
      this.isShowCreateDashboardDialog = false
    },
    createComponent (newComponentInfo) {
      this.dashboardList.forEach(board => {
        if (board.id === this.currentDashboardId) {
          board.componentList.push(newComponentInfo)
        }
      })
      this.isShowCreateComponentDialog = false
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
      color: $theme-color-primary;
      flex: 0 0 48px;
      line-height: 48px;
      .label-name {
        padding-left: 6px;
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
}
</style>
