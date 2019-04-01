<template>
  <div class="sy-holy-grail">
    <div class="wrapper">
      <app-header>
        <HeaderNav slot="nav" />
      </app-header>
      <main class="main">
        <div class="center">
          <div class="bg"></div>
          <transition name="fade" mode="out-in">
            <keep-alive include="PageResult">
              <router-view ></router-view>
            </keep-alive>
          </transition>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import AppHeader from './AppHeader'
import HeaderNav from './HeaderNav'

export default {
  name: 'AppLayout',
  components: {
    AppHeader,
    HeaderNav
  }
}
</script>
<style lang="scss" scoped>
@import '../../../src/styles/common/variables.scss';

.main {
  margin-top: $header-height;
}
</style>
