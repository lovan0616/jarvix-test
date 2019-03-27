<template>
  <header class="app-header">
    <div class="container">
      <div class="header-root">
        <router-link class="header-logo" to="/">
          <img src="@/assets/images/synergies_logo_white.svg">
        </router-link>
        <slot name="nav"></slot>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  name: 'AppHeader'
}
</script>
<style lang="scss" scoped>
@import '../../../src/styles/common/variables.scss';

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  height: $header-height;
  z-index: $header-z-index; /* make sure content will uper than asign left and right */
  background: $header-bg;
  box-shadow: $header-shadow;

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
