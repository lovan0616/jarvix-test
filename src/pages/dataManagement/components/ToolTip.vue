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
    font-size: 13px;
    line-height: 20px;
    letter-spacing: 0.5px;
    background: #48666A;
    color: #fff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
    border-radius: 2px;
    padding: 5px 10px;
  }
</style>
