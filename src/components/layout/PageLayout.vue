<template>
  <div class="app-layout page-layout">
    <div class="wrapper">
      <AppHeader/>
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
  .main {
    margin-top: $header-height;
    justify-content: center;
    text-align: center;
  }
}
</style>
