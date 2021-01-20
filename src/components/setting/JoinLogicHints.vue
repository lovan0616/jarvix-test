<template>
  <el-popover
    :content="hint"
    popper-class="el-popover--join-logic-hints"
    placement="top-start"
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
