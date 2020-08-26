<template>
  <div class="schedule-layout">
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view />
    </transition>
  </div>
</template>
<script>
export default {
  name: 'ScheduleLayout'
}
</script>
<style lang="scss" scoped>
.schedule-layout {
  height: 100vh;
  padding-top: 56px;
  overflow: auto;
}
</style>
