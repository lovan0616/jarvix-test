<template>
  <transition 
    name="fade" 
    mode="out-in">
    <router-view />
  </transition>
</template>
<script>
export default {
  name: 'MiniAppIndex'
}
</script>

<style lang="scss" scoped>
</style>