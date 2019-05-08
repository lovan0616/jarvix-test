<template>
  <div class="app-layout">
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
.main {
  margin-top: 72px;
  margin-bottom: 64px;
  min-height: calc(100vh - 136px);
}
</style>
