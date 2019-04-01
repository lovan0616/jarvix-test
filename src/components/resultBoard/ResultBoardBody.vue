<template>
  <div class="result-board-body">
    <div class="board-body">
      <div class="section-left">
        <slot name="ResultBoardBodyLeft"></slot>
      </div>
      <div class="section-right">
        <slot name="ResultBoardBodyright"></slot>
      </div>
    </div>
    <slot name="ResultBoardFooter"></slot>
  </div>
</template>
<script>
export default {
  name: 'ResultBoardBody'
}
</script>
<style lang="scss" scoped>
.result-board-body {
  .board-body {
    padding: 40px 30px 30px;
    display: flex;
    justify-content: space-between;

    .section-left {
      width: 25%;
    }

    .section-right {
      width: 69.44%;
    }
  }
}
</style>
