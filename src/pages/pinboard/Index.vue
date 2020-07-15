<template>
  <div class="wrapper">
    <main class="main">
      <transition 
        name="fade" 
        mode="out-in">
        <router-view />
      </transition>
    </main>
  </div>
</template>
<script>
export default {
  name: 'Pinboard'
}
</script>

<style lang="scss" scoped>

.main {
  padding-top: 32px;
  padding-bottom: 64px;
  min-height: calc(100vh - 136px);
  min-height: calc(100vh - #{$header-height});
}
</style>
