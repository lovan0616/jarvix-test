<template>
  <div class="result-board-body">
    <slot name="ResultBoardBodyLeft"></slot>
    <slot name="ResultBoardBodyright"></slot>
    <slot name="InsightBasicInfo"></slot>
    <slot name="InsightRootCause"></slot>
  </div>
</template>
<script>
export default {
  name: 'ResultBoardBody'
}
</script>
<style lang="scss" scoped>
.result-board-body {
  padding: 40px 30px 30px;
}
</style>
