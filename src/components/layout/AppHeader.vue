<template>
  <header class="header">
    <div 
      :class="{ 'header__sidenav-toggle-container--expand': isShowFullSideNav }"
      class="header__sidenav-toggle-container"
    >
      <a 
        href="javascript:void(0);" 
        class="toggle"
        @click="toggleSideNav"
      >
        <svg-icon 
          icon-class="side-nav" 
          class="toggle__icon"
        />
        <span class="toggle__text">
          {{ $t('sideNav.functionList') }}
        </span>
      </a>
    </div>
    <div class="header__container">
      <div class="header__root">
        <a
          :class="logoType === 'ASE' ? 'ase_logo' : ''"
          class="header__logo" 
          @click="directToHomePage"
        >
          <img 
            v-if="logoType === 'ASE'" 
            src="@/assets/images/ase-logo.png">
          <img 
            v-else-if="logoType === 'SyGPS'" 
            src="@/assets/images/logo_white.svg">
          <img 
            v-else 
            src="@/assets/images/logo.svg">
        </a>
        <slot name="nav"/>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['isShowFullSideNav']),
    ...mapState('userManagement', ['groupList']),
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId']),
    ...mapState('dataSource', ['dataSourceId', 'dataFrameId']),
    logoType () {
      return localStorage.getItem('currentLogo')
    }
  },
  methods: {
    ...mapMutations(['updateSideNavStatus']),
    toggleSideNav() {
      this.updateSideNavStatus(!this.isShowFullSideNav)
    },
    directToHomePage() {
      const groupLessPage = { name: 'PageGrouplessGuidance', params: { 'account_id': this.getCurrentAccountId } }
      const accountHomePage = {
        name: 'PageIndex', 
        params: { 
          'account_id': this.getCurrentAccountId, 
          'group_id': this.getCurrentGroupId
        },
        ...(this.dataSourceId && { 
          query: {
            'dataSourceId': this.dataSourceId,
            'dataFrameId': this.dataFrameId
          }
        })
      }
      
      // catch error when trying to navigate to same location as the current one
      // to avoid displaying a warning in the console
      this.$router.push(this.groupList.length === 0 ? groupLessPage : accountHomePage).catch(err => {})
    }
  }
}
</script>
<style lang="scss" scoped>
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

    &.ase_logo {
      height: 45px;
    }

    img {
      height: 100%;
    }
  }

  
}
</style>
