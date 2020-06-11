<template>
  <div 
    :style="{ top, width }" 
    class="row-description">
    <p 
      class="text" 
      v-html="text"/>
    <div class="dot outline"/>
    <div class="line"/>
    <div class="dot solid"/>
  </div>
</template>
<script>
export default {
  name: 'RowDescription',
  props: {
    text: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '180px'
    },
    top: {
      type: String,
      default: '0'
    }
  }
}
</script>

<style lang="scss" scoped>
.row-description {
  display: flex;
  align-items: center;
  position: absolute;
  left: -180px;
  &[right] {
    left: unset;
    right: -180px;
    flex-direction: row-reverse;
    .text {
      text-align: left;
    }
  }
  .line {
    flex: 1;
    height: 1px;
    background-color: $theme-color-warning;
    box-sizing: border-box;
  }
  .dot {
    flex: 0 0 8px;
    height: 8px;
    border-radius: 50%;
    &.outline {
      border: 1px solid $theme-color-warning;
    }
    &.solid {
      background-color: $theme-color-warning;
    }
  }
  .text {
    color: $theme-color-warning;
    flex: 0 0 150px;
    margin: 0;
    text-align: right;
    line-height: 1.2;
    padding: 0 8px;
    word-break: break-all;
  }
}

</style>
