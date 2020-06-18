<template>
  <div 
    :class="{'is-show': isShowChatRoom}"
    class="chat-room"
  >
    <a 
      href="javascript:void(0)" 
      class="chat-room__close-btn"
      @click="closeChatRoom"
    >
      <svg-icon 
        icon-class="double-arrow-left" 
        class="arrow-icon"/>
    </a>
    <div class="chat-room__header select-group">
      <data-source-select class="select-group__select"/>
      <data-frame-select class="select-group__select"/>
    </div>
    <conversation-block/>
    <ask-block/>
  </div>
</template>
<script>
import ConversationBlock from './ConversationBlock'
import AskBlock from './AskBlock'
import DataSourceSelect from '@/components/select/DataSourceSelect'
import DataFrameSelect from '@/components/select/DataFrameSelect'

export default {
  name: 'ChatRoomBlock',
  components: {
    DataSourceSelect,
    ConversationBlock,
    AskBlock,
    DataFrameSelect
  },
  computed: {
    isShowChatRoom () {
      return this.$store.state.isShowChatRoom
    },
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    dataFrameId () {
      return this.$store.state.dataSource.dataFrameId
    }
  },
  methods: {
    closeChatRoom () {
      this.$store.commit('updateChatRoomStatus', false)
      this.closePreviewDataSource()
    },
    closePreviewDataSource () {
      this.$store.commit('previewDataSource/togglePreviewDataSource', false)
    }
  },
}
</script>
<style lang="scss" scoped>
.chat-room {
  position: fixed;
  top: $header-height;
  display: flex;
  flex-direction: column;
  width: $chat-room-width;
  height: calc(100vh - #{$header-height});
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
  transform: translateX(-$chat-room-width);
  z-index: 1;
  // transition: transform 0.1s;

  &.is-show {
    transform: translateX(0);
  }

  &__header {
    padding: 32px 32px 0;
    margin-bottom: 24px;
  }

  &__close-btn {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: block;
    width: 50px;
    height: 50px;
    z-index: 999;

    .arrow-icon {
      font-size: 48px;
    }
  }

  .select-group {
    &__select {
      width: 100%;
      height: 36px;
      display: flex;
      
      &:not(:last-of-type) {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
