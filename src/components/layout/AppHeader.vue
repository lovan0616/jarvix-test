<template>
  <header class="app-header">
    <div class="container">
      <div class="header-root">
        <router-link class="header-logo" to="/">
          <img src="@/assets/images/logo.svg">
        </router-link>
        <slot name="nav"></slot>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  name: 'AppHeader',
  computed: {
    isShowChatRoom () {
      return this.$store.state.isShowChatRoom
    }
  }
}
</script>
<style lang="scss" scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  height: $header-height;
  z-index: $header-z-index;
  box-shadow: $header-shadow;
  background-color: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid #04262B;
  // transition: all 0.1s;

  &::before {
    position: absolute;
    top: 0;
    content: '';
    width: 100%;
    height: 3px;
    background: linear-gradient(1.58deg, #2AD2E2 0%, rgba(42, 210, 226, 0.3) 92.98%);
  }

  .header-root {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-logo {
      height: 32px;
      cursor: pointer;
      img {
        height: 100%;
      }
    }
  }
}
</style>
