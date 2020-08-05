<template>
  <div class="chat-room">
    <div class="chat-room__header select-group">
      <data-frame-menu class="select-group__select"/>
    </div>
    <ask-block/>
  </div>
</template>
<script>
import AskBlock from './AskBlock'
import DataFrameMenu from '@/components/select/DataFrameMenu'

export default {
  name: 'ChatRoomBlock',
  components: {
    AskBlock,
    DataFrameMenu
  }
}
</script>
<style lang="scss" scoped>
.chat-room {
  position: fixed;
  top: $header-height;
  left: $app-side-nav-closed-width;
  display: flex;
  width: calc(100% - #{$app-side-nav-closed-width});
  height: $chat-room-height;
  overflow: auto;
  padding: 16px 34px 16px 24px;
  z-index: 4;
  background: rgba(0, 0, 0, 0.55);
  overflow: visible;

  .select-group {
    width: $basic-df-setting-width;
    
    &__select {
      width: calc(100% - 24px);
      height: 40px;
      display: flex;
      
      >>> .el-input .el-input__inner {
        height: 40px;
        line-height: 40px;
      }
      &:not(:last-of-type) {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
