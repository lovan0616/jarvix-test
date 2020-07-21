<template>
  <div class="chat-room">
    <div class="chat-room__header select-group">
      <data-frame-menu class="select-group__select"/>
    </div>
    <ask-block/>
  </div>
</template>
<script>
import ConversationBlock from './ConversationBlock'
import AskBlock from './AskBlock'
import DataSourceSelect from '@/components/select/DataSourceSelect'
import DataFrameSelect from '@/components/select/DataFrameSelect'
import DataFrameMenu from '@/components/select/DataFrameMenu'

export default {
  name: 'ChatRoomBlock',
  components: {
    DataSourceSelect,
    ConversationBlock,
    AskBlock,
    DataFrameSelect,
    DataFrameMenu
  },
  computed: {
    isShowBasicDataFrameSetting () {
      return this.$store.state.isShowBasicDataFrameSetting
    },
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    dataFrameId () {
      return this.$store.state.dataSource.dataFrameId
    }
  },
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
  padding: 16px 34px 8px 0;
  z-index: 3;
  background-color: #1E2122;
  overflow: visible;

  .select-group {
    width: $basic-df-setting-width;
    padding: 0 16px 0 24px;
    
    &__select {
      width: 100%;
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
