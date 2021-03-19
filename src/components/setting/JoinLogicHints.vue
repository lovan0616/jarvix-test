<template>
  <el-popover
    :content="hint"
    popper-class="el-popover--join-logic-hints"
    placement="bottom-start"
    title="Title"
    width="200"
    trigger="hover">
    <svg-icon
      slot="reference"
      :icon-class="iconClass"
      class="join-logic-hints__icon"
    />
  </el-popover>
</template>

<script>
export default {
  name: 'JoinLogicHints',
  props: {
    iconClass: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.join-logic-hints__icon {
  fill: #333;
  cursor: pointer;
}
</style>