<template>
  <div class="app-layout">
    <header class="header">
      <div
        class="header__container"
        @dblclick="hasEmergency = true"
      >
        <div class="header__root">
          <a class="header__logo" >
            <img 
              class="img-logo" 
              src="@/assets/images/sygps_logo.png">
          </a>
          <nav class="nav-header">
            <!-- Surgery Scheduling -->
            <section
              v-if="isOTSchedule"
              class="nav-left"
            >
              <router-link 
                :to="{ name: 'DemoCurrentOTSimulation'}"
                :class="{ 'active': $route.name === 'DemoCurrentOTSimulation' }"
                class="nav-item"
              >
                Surgery Schedule
              </router-link>
              <router-link 
                :to="{ name: 'DemoOTSimulationSetting'}"
                :class="{ 'active': $route.name === 'DemoOTSimulationSetting' }"
                class="nav-item"
              >
                <el-badge
                  :hidden="!hasEmergency"
                  class="menu-badge" 
                  value="2">
                  <span>Surgery Simulation</span>
                </el-badge>
              </router-link>
            </section>
            <!-- Bedroom Scheduling -->
            <section
              v-else
              class="nav-left"
            >
              <router-link 
                :to="{ name: 'DemoCurrentBedSimulation', query: { planned: true } }"
                class="nav-item"
              >
                Bed Schedule
              </router-link>
              <span class="nav-item">
                Bed Simulation
              </span>
            </section>
          </nav>
        </div>
      </div>
    </header>
    <main class="main">
      <aside>
        <div 
          v-if="isMenuOpen" 
          class="surgery-menu">
          <ul class="surgery-menu__list">
            <li
              v-for="(item, index) in menuItem"
              :key="index"
              class="item"
            >
              <div
                :class="['item-label', activeIMenuItem === item.label ? 'is-active' : '']"
                @click="clickMenuItem(item.label)"
              >
                <svg-icon icon-class="triangle"/>
                {{ item.label }}
              </div>
              <ul
                v-if="item.children && item.isOpen"
                class="sub-menu"
              >
                <li
                  v-for="(childItem, index) in item.children"
                  :key="index"
                  class="sub-item"
                  @click.stop="clickSubmenu(childItem.label)"
                >{{ childItem.label }}</li>
              </ul>
            </li>
          </ul>
          <div class="copyright-block">
            <img 
              class="logo" 
              src="@/assets/images/logo-green-x.svg">
            <div class="copyright-slogan">Powered by JarviX Scheduling Engine TM</div>
          </div>
        </div>
        <ul
          v-else
          class="fake-icon-menu"
          @click="isMenuOpen = true"
        >
          <li><svg-icon icon-class="home" /></li>
          <li><svg-icon icon-class="pin" /></li>
          <li><svg-icon icon-class="user" /></li>
        </ul>
      </aside>
      <div class="main-content">
        <transition
          name="fade" 
          mode="out-in">
          <router-view 
            :is-ot="isOTSchedule"
            :has-emergency="hasEmergency"
            :key="isOTSchedule"
            @insert="hasEmergency = false" />
        </transition>
      </div>
    </main>
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'PatientScheduleIndex',
  components: {
    AppHeader
  },
  data: () => {
    return {
      menuItem: [
        {
          label: 'Overview',
          isOpen: false,
          children: [
            { label: 'Cardiac' },
            { label: 'Thoratic' },
            { label: 'Netural' },
            { label: 'Orthopedics' },
            { label: 'Plastic' },
            { label: 'General' },
          ]
        },
        { label: 'Pre-op Assessment' },
        {
          label: 'Scheduling',
          isOpen: false,
          children: [
            { label: 'OT Room Scheduling' },
            { label: 'Bedroom Scheduling' }
          ]
        },
        { label: 'Patient / Asset Monitoring' },
        { label: 'Covid-19 Tracking' }
      ],
      isAppLoading: false,
      isMenuOpen: false,
      hasEmergency: false,
      activeIMenuItem: 'Scheduling'
    }
  },
  computed: {
    ...mapState(['isShowFullSideNav']),
    isOTSchedule () {
      return this.$route.name.includes('OT')
    }
  },
  methods: {
    ...mapMutations(['updateSideNavStatus']),
    toggleSideNav() {
      this.updateSideNavStatus(!this.isShowFullSideNav)
    },
    clickMenuItem (menuName) {
      this.activeIMenuItem = menuName
      const openabelMenuItem = this.menuItem.find(item => item.children && (item.label === menuName))
      if (openabelMenuItem) {
        openabelMenuItem.isOpen = !openabelMenuItem.isOpen
      }
    },
    clickSubmenu (menuName) {
      switch (menuName) {
        case 'OT Room Scheduling':
          this.$router.push({ name: 'DemoCurrentOTSimulation' })
          this.isMenuOpen = false
          return
        case 'Bedroom Scheduling':
          this.$router.push({ name: 'DemoCurrentBedSimulation', query: { planned: true } })
          this.isMenuOpen = false
          return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-layout {
  padding-top: 56px;
}
.main {
  position: relative;
  padding-left: 64px;
  height: calc(100vh - #{$header-height});
  background-color: rgba(0, 0, 0, .55);
  .main-content {
    height: 100%;
    overflow: auto;
  }
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; 
  height: auto;
  height: $header-height;
  z-index: $header-z-index;
  box-shadow: $header-shadow;
  background-color: rgba(0, 0, 0, 0.55);
  border-bottom: 1px solid #04262B;

  &__container {
    width: 100%;
    height: 100%;
    margin: 0 0 0 auto;
    padding: 0 34px 0 24px;
  }

  &__root {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    height: 32px;
    cursor: pointer;
    .img-logo {
      height: 100%;
      filter: grayscale(100%) brightness(3);
    }
  }
}
.nav-header {
  margin-left: 24px;
  display: flex;
  flex: 1;

  .nav-left,
  .nav-right {
    display: flex;
    align-items: center;
  }

  .nav-right {
    margin: 0 0 0 auto;
  }

  .nav-item {
    position: relative;
    line-height: $header-height;
    text-align: center;
    letter-spacing: 0.5px;
    color: #a7a7a7;

    &:not(:last-child) {
      margin-right: 30px;
    }

    &:hover {
      color: var(--color-text-hover);
    }

    &.active {
      color: var(--color-text-hover);

      &::before {
        position: absolute;
        content: '';
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: #2AD2E2;
      }
    }

    .icon-description {
      font-size: 22px;
      vertical-align: middle;
    }
  }

  .group-list {
    .switch {
      display: flex;
      align-items: center;
      background: rgba(50, 75, 78, 0.6);
      line-height: initial;
      border-radius: 16px;
      padding: 5px 15px;
      color: #2AD2E2;

      &__icon {
        margin-left: 6px;
        width: 8px;
      }

      &__text {
        max-width: 105px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      }
    }
  }

  .btn-create-group {
    margin-right: 16px;
    border-radius: 16px;
    background: rgba(50, 75, 78, 0.6);
    color: $theme-color-primary;
  }

  .nav-item-dropdown {
    position: relative;
    cursor: pointer;

    .nav-set-flex {
      display: flex;
      align-items: center;
    }
    .nav-dropdown-icon {
      margin-left: 6px;
      width: 8px;
      text-align: center;
      transition: all 0.3s;

      &:hover {
        color: #fff;
      }
    }

    & >>> .dropdown-select {
      .icon {
        fill: #2AD2E2;
      }
    }
  }
  .nav-set {
    &:hover {
      .nav-set-dropdown {
        visibility: visible;
      }

      .is-rotate {
        transform: rotate(180deg);
      }
    }

    &-dropdown {
      visibility: hidden;
    }

    /deep/ .dropdown-select-box {
      right: 0;
      left: unset;
    }
  }

  .nav-function {
    position: relative;
  }

  /deep/ .dropdown {
    &__list-container {
      left: 0;
      top: calc(100% + 10px);
      text-align: left;
      z-index: 1;

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
        left: 15%;
        border-bottom: 12px solid #2B3839;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
      }
    }

    &__list {
      max-height: 200px;
      overflow-y: auto;

      &::-webkit-scrollbar-track {
        border-radius: 5px;
      }
    }
  }
}

.surgery-menu {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border: 0;
  z-index: 1000;
  margin: 0;
  padding: 0;
  background-color: rgb(0, 0, 0);
  box-shadow: 0px 0px 20px rgba(12, 209, 222, .1);
  color: #8B9B9C;
  
  &__list {
    flex: 1;
    min-height: 0;
    overflow: auto;
    margin: 0 0 12px 0;
    padding: 0;
    .sub-menu {
      margin: 0;
      padding: 0;
    }
    .item {
      position: relative;
      text-indent: 48px;
      .svg-icon {
        position: absolute;
        left: 24px;
        top: 19px;
        font-size: 10px;
        transform: rotate(90deg);
        color: #fff;
      }
    }
    .item-label, .sub-item {
      display: block;
      line-height: 48px;
      list-style: none;
      padding: 0 24px 0 0;
      cursor: pointer;
      border-bottom: 1px solid #232C2E;
      &:hover {
        background: rgba(66, 165, 179, 0.5);
      }
      &.is-active {
        color: #fff;
        background: #42A5B3;
        .svg-icon {
          display: block;
        }
      }
    }
    .sub-item {
      text-indent: 64px;
    }
    .svg-icon {
      display: none;
    }
  }
  .copyright-block {
    width: 100%;
    text-align: center;
    .logo {
      width: 120px;
      margin-bottom: 8px;
    }
    .copyright-slogan {
      font-size: 10px;
      color: #999;
      text-align: center;
    }
  }
}

.fake-icon-menu {
  width: 56px;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border: 0;
  z-index: 1000;
  margin: 0;
  padding: 24px 0 0 0;
  background-color: rgb(0, 0, 0);
  box-shadow: 0px 0px 20px rgba(12, 209, 222, .1);
  color: #8B9B9C;
  text-align: center;
  font-weight: normal;
  .svg-icon {
    font-size: 24px;
    margin-bottom: 24px;
  }
}

/deep/ .el-badge.menu-badge {
  user-select: none;
  .el-badge__content {
    top: 16px;
  }
}

* {
  user-select: none;
}
</style>