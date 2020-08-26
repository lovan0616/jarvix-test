<template>
  <header class="ss__nav">
    <img
      class="ss__logo"
      src="@/assets/images/logo.svg"
      alt="logo"
      @click="$router.push('/')"
    >
    <router-link :to="{name: 'CurrentSimulation'}">
      {{ $t('schedule.header.schedule') }}
    </router-link>
    <router-link :to="{name: 'Simulation'}">
      {{ $t('schedule.header.simulate') }}
    </router-link>
    <router-link :to="{name: 'ScheduleSetting'}">
      {{ $t('schedule.header.setting') }}
    </router-link>
  </header>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.ss {
  &__nav {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 56px;
    background: var(--color-black);
    color: var(--color-text-gray);
    line-height: 56px;
    padding: 0 24px;
    z-index: 999;
    border-bottom: 1px solid var(--color-border);
    a:not(:first-child) {
      margin-left: 30px;
    }
    .router-link-exact-active {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--color-theme);
      }
    }
  }
  &__logo {
    width: 110px;
    margin-right: 16px;
    cursor: pointer;
  }
}
</style>
