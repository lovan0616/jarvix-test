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
  name: 'WarRoomIndex'
}
</script>

<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
}

.main {
  padding: 0;
  height: calc(100vh - #{$header-height});
}
</style>
