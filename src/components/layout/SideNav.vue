<template>
  <nav class="nav-header">
    <div
      v-for="nav in navItems"
      :key="nav.title"
      class="nav-item">
      <router-link
        :to="nav.path ? nav.path : { name: nav.routeName }"
        class="nav-link main-nav-link"
      >
        <svg-icon 
          :icon-class="nav.icon" 
          class="icon"/>
        {{ nav.title }}
      </router-link>
      <template v-if="nav.subNav">
        <router-link
          v-for="subNav in nav.subNav"
          :key="subNav.title"
          :to="subNav.path || { name: subNav.routeName }"
          class="nav-link sub-nav-link"
        >
          <svg-icon 
            icon-class="triangle" 
            class="icon"/>
          {{ subNav.title }}
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
  background-color: var(--color-bg-1);
  height: 100%;

  .nav-link {
    line-height: 54px;
    display: flex;
    align-items: center;
    padding: 0 1rem 0 40px;
    letter-spacing: var(--theme-letter-spacing-wide);
    color: #a7a7a7;
    position: relative;

    &:hover {
      color: #fff;
      background-color: rgba(0, 0, 0, 1);
    }

    &.active {
      color: #fff;
    }
  }

  .main-nav-link {
    &.active {
      color: #2AD2E2;
    }
    .icon {
      font-size: 16px;
      margin-right: 8px;
      margin-top: 2px;
      fill: #2AD2E2;
    }
  }

  .sub-nav-link {
    background-color: var(--color-bg-2);
    &.active {
      background: linear-gradient(90deg, #42A5B3 0%, rgba(66, 165, 179, 0.415929) 18.75%, rgba(66, 165, 179, 0) 73.44%);
      .icon {
        visibility: visible;
      }
    }
    .icon {
      flex-basis: 24px;
      height: 12px;
      margin-right: 8px;
      transform: translate(-1px, -1px) rotate(-30deg);
      fill: #fff;
      visibility: hidden;
    }
  }
}
</style>
