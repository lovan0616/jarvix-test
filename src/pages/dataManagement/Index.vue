<template>
   <router-view></router-view>
</template>
<script>
export default {
  name: 'DataManagement'
}
</script>

<style lang="scss" scoped>
.data-management-wrapper {
  width: 100%;
  height: calc(100vh - #{$header-height});
  position: absolute;
  top: $header-height;
  right: 0;
}

.main {
  padding-top: 32px;
  padding-bottom: 64px;
  min-height: calc(100vh - 136px);
  min-height: calc(100vh - #{$header-height});
}
</style>
