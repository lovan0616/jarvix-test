<template>
  <div class="sy-holy-grail" >
    <div class="wrapper">
      <app-header></app-header>
      <main class="main">
        <div class="center page-result">
          <div class="bg"></div>
          <transition name="fade" mode="out-in">
            <router-view ></router-view>
          </transition>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import AppHeader from './AppHeader'

export default {
  name: 'AppLayout',
  components: {
    AppHeader
  }
}
</script>
<style lang="scss" scoped>
@import '../../../src/styles/common/variables.scss';

.main {
  margin-top: $header-height;
}
</style>
