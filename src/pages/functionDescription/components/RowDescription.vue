<template>
  <div class="row-description"
  :style="{
    top: `${top}px`,
    width: `${width}px`
  }">
    <div class="dot solid"></div>
    <div class="line"></div>
    <div class="dot outline"></div>
    <p class="text" v-html="text"></p>
  </div>
</template>
<script>
export default {
  name: 'RowDescription',
  props: {
    text: {
      type: String
    },
    width: {
      type: Number,
      default: 150
    },
    top: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.row-description {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  left: -150px;
  &[right] {
    left: unset;
    right: -150px;
    flex-direction: row;
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
    flex: 0 0 120px;
    margin: 0;
    text-align: right;
    line-height: 1.2;
    padding: 0 8px;
    word-break: break-all;
  }
}

</style>
