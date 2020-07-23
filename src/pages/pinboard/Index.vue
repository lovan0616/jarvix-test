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
  padding: 32px 24px 64px 24px;
  min-height: calc(100vh - #{$header-height});
}
</style>
