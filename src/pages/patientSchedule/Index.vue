<template>
  <div class="app-layout">
    <header class="header">
      <div class="header__sidenav-toggle-container">
        <a 
          href="javascript:void(0);" 
          class="toggle"
          @click="isCollapse = !isCollapse"
        >
          <svg-icon 
            icon-class="side-nav" 
            class="toggle__icon"
          />
        </a>
      </div>
      <div class="header__container">
        <div class="header__root">
          <a
            class="header__logo" 
          >
            <img src="@/assets/images/sygps_logo.png">
          </a>
          <nav class="nav-header">
            <!-- OT Scheduling -->
            <section
              v-if="isOTSchedule"
              class="nav-left"
            >
              <router-link 
                :to="{ name: 'DemoCurrentOTSimulation'}"
                class="nav-item"
              >
                Current Result
              </router-link>
              <router-link 
                :to="{ name: 'DemoCurrentOTSimulation'}"
                class="nav-item"
              >
                Simulation
              </router-link>
            </section>
            <!-- Beedroom Scheduling -->
            <section
              v-else
              class="nav-left"
            >
              <router-link 
                :to="{ name: 'DemoCurrentBedSimulation', query: { planned: true } }"
                class="nav-item"
              >
                Current Result
              </router-link>
              <span class="nav-item">
                Simulation
              </span>
            </section>
          </nav>
        </div>
      </div>
    </header>
    <main class="main">
      <aside>
        <el-menu 
          :collapse="isCollapse" 
          default-active="2" 
          class="el-menu-vertical-demo"
          background-color="#191919"
          text-color="#fff"
          active-text-color="#4DE2F0"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-setting"/>
              <span slot="title">Overview</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">Cardiac</el-menu-item>
              <el-menu-item index="1-2">Thoratic</el-menu-item>
              <el-menu-item index="1-3">Netural</el-menu-item>
              <el-menu-item index="1-4">Orthopedics</el-menu-item>
              <el-menu-item index="1-5">Plastic</el-menu-item>
              <el-menu-item index="1-6">General</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-setting"/>
            <span slot="title">Pre-op Assessment</span>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"/>
              <span slot="title">Scheduling</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                index="3-1"
                @click="$router.push({ name: 'DemoCurrentOTSimulation' })"
              >OT Room Scheduling</el-menu-item>
              <el-menu-item index="3-2">Bedroom Scheduling</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="4">
            <i class="el-icon-setting"/>
            <span slot="title">Patient/Asset Monitoring</span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-setting"/>
            <span slot="title">Covid-19 Tracking</span>
          </el-menu-item>
        </el-menu>
      </aside>
      <div class="main-content">
        <transition
          name="fade" 
          mode="out-in">
          <router-view :is-ot="isOTSchedule" />
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
      isAppLoading: false,
      isCollapse: true
    }
  },
  computed: {
    ...mapState(['isShowFullSideNav']),
    isOTSchedule () {
      return this.$route.name === 'DemoCurrentOTSimulation'
    }
  },
  methods: {
    ...mapMutations(['updateSideNavStatus']),
    toggleSideNav() {
      this.updateSideNavStatus(!this.isShowFullSideNav)
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
  .main-content {
    height: 100%;
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
  background-color: #171717;
  border-bottom: 1px solid #04262B;
  // transition: all 0.1s;

  &__sidenav-toggle-container {
    position: fixed;
    white-space: nowrap;
    border-right: 1px solid var(--color-border);
    width: $app-side-nav-closed-width;
    background: var(--color-bg-3);
    z-index: 1000;

    .toggle {
      padding: ($app-side-nav-closed-width - 20px) / 2;
      display: flex;
      align-items: center;
      &__icon {
        flex: 0 0 20px;
        color: #2AD2E2;
        font-size: 20px;
        margin-right: 0;
      }

      &__text {
        flex: 1 1 0;
        font-weight: bold;
        color: #2AD2E2;
        overflow: hidden;
        white-space: nowrap;
        opacity: 0;
        transition: opacity .1s linear .1s;
      }
    }

    &--expand {
      width: $app-side-nav-opened-width;
      .toggle {
        &__icon {
          margin-right: 13px;
        }

        &__text {
          opacity: 1;
        }
      }
    }
  }

  &__container {
    width: calc(100% - #{$app-side-nav-closed-width});
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
    img {
      height: 100%;
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

.el-menu-vertical-demo {
  position: absolute;
  top: 0;
  left: 0;
  min-height: 400px;
  height: 100%;
  border: 0;
  z-index: 1000;
  box-shadow: 0px 0px 20px rgba(12, 209, 222, .1);
  &.el-menu--collapse {
    width: 56px;
  }
}
</style>