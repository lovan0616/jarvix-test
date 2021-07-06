<template>
  <div class="wrapper">
    <main class="main">
      <transition 
        name="fade" 
        mode="out-in">
        <router-view />
      </transition>
    </main>

    <el-backtop target=".wrapper">
      <div class="backtop-content">
        <svg-icon icon-class="chevron-up-solid"/>
    </div>
    </el-backtop>
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

.backtop-content {
  color: #2AD2E2;
}
</style>
