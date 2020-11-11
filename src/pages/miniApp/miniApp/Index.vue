<template>
  <div class="wrapper wrapper--without-nav-header">
    <main class="mini-app__page">
      <nav class="mini-app__nav">
        <div class="nav--left">
          <img
            class="logo"
            src="@/assets/images/logo-green-x.svg"
            @click="$router.push({ path: '/' })"
          >
          {{ $t('miniApp.dashboard') }}
        </div>
        <div 
          class="nav--right" 
          @click="$router.push({ path: '/' })">
          {{ $t('miniApp.exit') }}
          <svg-icon icon-class="logout"/>
        </div>
      </nav>
      <div class="mini-app__sub-nav">
        <div class="sub-nav--left">
          <div class="dashboard-name">{{ miniApp.name }}</div>
        </div>
        <div class="sub-nav--right">
          <button 
            class="btn-m btn-secondary btn-has-icon" 
            @click="isShowCreateDialog = true">
            <svg-icon icon-class="plus"/>
            {{ $t('miniApp.createDashboard') }}
          </button>
        </div>
      </div>
      <div class="mini-app__content">
        <div 
          v-if="dashboardList.length === 0" 
          class="empty-block">
          {{ $t('miniApp.noneDashboard') }}
          <button 
            class="btn-m btn-default btn-has-icon create-btn" 
            @click="isShowCreateDialog = true">
            <svg-icon icon-class="plus"/>
            {{ $t('miniApp.createDashboard') }}
          </button>
        </div>
        <template v-else>
          <ul class="mini-app__dashboard-list">
            <div class="title">
              <svg-icon 
                icon-class="dashboard" 
                class="label-icon"/>
              <span class="label-name">{{ $t('miniApp.dashboardList') }}</span>
            </div>
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
          <main class="mini-app__dashbaord">
            當前 Dashboard {{ currentDashboardId }}
          </main>
        </template>
      </div>
    </main>
    <create-dashboard-dialog
      v-show="isShowCreateDialog"
      @closeDialog="isShowCreateDialog = false"
    />
  </div>
</template>

<script>
import CreateDashboardDialog from './CreateDashboardDialog.vue'
export default {
  name: 'MiniApp',
  components: {
    CreateDashboardDialog
  },
  data () {
    return {
      miniApp: {
        // MOCK DATA
        name: 'APP的名稱唷唷唷',
        dashboardList: [
          // { id: 1, name: '嘎嘎' },
          // { id: 2, name: '烏拉拉' },
          // { id: 3, name: '嘿丟' },
          // { id: 4, name: '我是誰我是誰我是誰我是誰我是誰我是誰我是誰我' },
          // { id: 5, name: '我在哪裡' },
        ],
      },
      currentDashboardId: 2,
      isShowCreateDialog: false
    }
  },
  computed: {
    dashboardList () {
      return this.miniApp.dashboardList
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-app {
  &__page {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  &__nav {
    height: 56px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(0, 0, 0, 0.55);
    .nav--left {
      display: flex;
      align-items: center;
      .logo {
        margin-right: 24px;
        cursor: pointer;
      }
    }
    .nav--right {
      cursor: pointer;
      color: $theme-color-primary;
    }
  }
  &__sub-nav {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    border-top: 1px solid #232C2E;
    border-bottom: 1px solid #232C2E;
    background: rgba(0, 0, 0, 0.55);
    .sub-nav--left {
      .dashboard-name {
        font-size: 18px;
        line-height: 50px;
        color: $theme-color-primary;
      }
    }
    .sub-nav--right {
      display: flex;
      align-items: center;
    }
  }
  &__content {
    flex: 1;
    display: flex;
    .empty-block {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .create-btn {
        margin-top: 20px;
      }
    }
  }
  &__dashboard-list {
    flex-basis: 240px;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    background-color: #000;
    border-right: 1px solid #232C2E;
    .title {
      padding-left: 26px;
      color: $theme-color-primary;
      line-height: 48px;
      .label-name {
        padding-left: 6px;
      }
    }
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
  &__dashbaord {

  }
}
</style>
