<template>
  <header class="header">
    <a 
      href="javascript:void(0);" 
      class="header__sidenav-toggle"
      @click="toggleSideNav"
    >
      <svg-icon 
        icon-class="side-nav" 
        class="side-nav-icon"
      />
    </a>
    <div class="header__container">
      <div class="header__root">
        <router-link 
          class="header__logo" 
          to="/">
          <img src="@/assets/images/logo.svg">
        </router-link>
        <slot name="nav"/>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'AppHeader',
  computed: {
    ...mapState(['isShowFullSideNav']),
    isShowChatRoom () {
      return this.$store.state.isShowChatRoom
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
.header {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: auto;
  height: $header-height;
  z-index: $header-z-index;
  box-shadow: $header-shadow;
  background-color: #0e2b2f;
  border-bottom: 1px solid #04262B;
  // transition: all 0.1s;

  &__container {
    width: calc(100% - 64px - 80px);
    margin: 0 auto;
  }

  &__sidenav-toggle {
    width: 64px;
    height: 64px;
    display: inline-block;
    background: #1F3B3F;
    display: flex;
    align-items: center;
    justify-content: center;

    .side-nav-icon {
      color: #2AD2E2;
      font-size: 20px;
    }
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
</style>
