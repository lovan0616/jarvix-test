<template>
  <nav class="nav-header">
    <div
      class="nav-item"
      v-for="nav in navItems"
      :key="nav.title">
      <router-link
        class="nav-link main-nav-link"
        :to="nav.path ? nav.path : {name: nav.routeName}"
      >
        <svg-icon icon-class="account-management" class="icon"></svg-icon>
        {{nav.title}}
      </router-link>
      <template v-if="nav.subNav">
        <router-link
          class="nav-link sub-nav-link"
          v-for="subNav in nav.subNav"
          :key="subNav.title"
          :to="subNav.path || {name: subNav.routeName}"
        >
          <svg-icon icon-class="triangle" class="icon"></svg-icon>
          {{subNav.title}}
        </router-link>
      </template>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'SideNav',
  props: {
    navItems: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
.nav-header {
  background-color: rgba(0, 0, 0, .3);
  height: 100%;

  .nav-link {
    line-height: 54px;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    letter-spacing: 0.15em;
    color: #a7a7a7;
    position: relative;

    &:hover {
      color: #fff;
      background-color: rgba(0, 0, 0, 1);
    }

    &.active {
      color: #fff;
      font-weight: 800;
    }
  }

  .main-nav-link {
    &.active {
      color: #42A5B3;
    }
    .icon {
      font-size: 24px;
      margin-right: 8px;
      margin-top: 2px;
      fill: #42A5B3;
    }
  }

  .sub-nav-link {
    background-color: rgba(0, 0, 0, .3);
    &.active {
      background-color: #42A5B3;
      .icon {
        visibility: visible;
      }
    }
    .icon {
      flex-basis: 24px;
      height: 12px;
      margin-right: 8px;
      transform: rotate(-30deg);
      fill: #fff;
      visibility: hidden;
    }
  }
}
</style>
