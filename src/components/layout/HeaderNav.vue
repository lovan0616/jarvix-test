<template>
  <nav class="nav-header">
    <router-link class="nav-item" to="/" exact>首页</router-link>
    <router-link class="nav-item" to="/pinboard">个人钉板</router-link>
    <router-link class="nav-item" to="/data-management">资料管理</router-link>
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
  flex: 1;
  justify-content: flex-end;

  .nav-item {
    line-height: 54px;
    text-align: center;
    letter-spacing: 0.5px;
    color: #a7a7a7;

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
