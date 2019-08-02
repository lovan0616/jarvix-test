<template>
  <div class="dot-loader">
    <div class="dot dot1"></div>
    <div class="dot dot2"></div>
    <div class="dot dot3"></div>
  </div>
</template>
<script>
export default {
  name: 'ChatSpinner'
}
</script>
<style lang="scss" scoped>
.dot-loader {
  position: relative;
  width: 60px;
  height: 30px;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;

  .dot {
    width: 10px;
    height: 10px;
    background: $theme-color-primary;
    border-radius: 50%;
    position: absolute;
    top: calc(50% - 5px);
  }

  @keyframes dot-jump {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-15px);
    }
  }

  .dot1 {
    left: 0px;
    animation: dot-jump 0.5s linear alternate infinite;
  }

  .dot2 {
    left: 20px;
    animation: dot-jump 0.5s 0.2s linear alternate infinite;
  }

  .dot3 {
    left: 40px;
    animation: dot-jump 0.5s 0.4s linear alternate infinite;
  }
}
</style>
