<template>
  <div class="tool-tip">{{ content }}</div>
</template>
<script>
export default {
  name: 'ToolTip',
  props: {
    content: {
      type: String,
      default: null
    }
  }
}
</script>
<style lang="scss" scoped>
  .tool-tip {
    position: absolute;
    top: -15px;
    left: 0px;
    font-size: 13px;
    line-height: 20px;
    background: #48666A;
    color: #fff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
    border-radius: 2px;
    padding: 5px 8px;
  }
</style>
