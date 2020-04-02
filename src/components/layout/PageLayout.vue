<template>
  <div class="app-layout page-layout">
    <div class="wrapper">
      <img src="@/assets/images/logo-text.svg" alt="logo" class="page-logo-img">
      <main class="main">
        <div class="bg"></div>
        <slot></slot>
      </main>
    </div>
  </div>
</template>
<script>
import AppHeader from './AppHeader'

export default {
  name: 'PageLayout',
  components: {
    AppHeader
  }
}
</script>
<style lang="scss" scoped>
.page-layout {
  .page-logo-img {
    width: 200px;
    margin: 60px 0 55px;
  }
  .wrapper {
    text-align: center;
  }
  .main {
    text-align: center;
  }
}
</style>
