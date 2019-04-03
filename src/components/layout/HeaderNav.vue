<template>
  <nav class="nav-header">
    <router-link class="nav-item" v-show="$route.name !== 'PageIndex'" to="/result">搜寻</router-link>
    <router-link class="nav-item" to="/pinboard">个人钉板</router-link>
  </nav>
</template>
<script>
export default {
  name: 'HeaderNav'
}
</script>
<style lang="scss" scoped>
.nav-header {
  display: flex;

  .nav-item {
    line-height: 54px;
    text-align: center;
    letter-spacing: 0.5px;
    color: #D8D8D8;

    &:not(:last-child) {
      margin-right: 30px;
    }

    &:hover {
      color: #fff;
    }

    &.active {
      color: #fff;
      border-bottom: 2px solid #fff;
    }
  }
}
</style>
