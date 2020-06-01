<template>
  <div 
    :class="{'is-show': isShowChatRoom}"
    class="chat-room-block"
  >
    <a 
      href="javascript:void(0)" 
      class="close-btn"
      @click="closeChatRoom"
    >
      <svg-icon 
        icon-class="double-arrow-left" 
        class="arrow-icon"/>
    </a>
    <div class="chat-room-header">
      <chat-bot-btn class="chat-bot-link"/>
      <data-source-select class="data-source-select"/>
    </div>
    <conversation-block/>
    <ask-block/>
  </div>
</template>
<script>
import ConversationBlock from './ConversationBlock'
import AskBlock from './AskBlock'
import ChatBotBtn from './ChatBotBtn'
import DataSourceSelect from '@/components/select/DataSourceSelect'

export default {
  name: 'ChatRoomBlock',
  components: {
    DataSourceSelect,
    ConversationBlock,
    AskBlock,
    ChatBotBtn
  },
  computed: {
    isShowChatRoom () {
      return this.$store.state.isShowChatRoom
    }
  },
  methods: {
    closeChatRoom () {
      this.$store.commit('updateChatRoomStatus', false)
    }
  },
}
</script>
<style lang="scss" scoped>
.chat-room-block {
  position: fixed;
  top: $header-height;
  display: flex;
  flex-direction: column;
  width: $chat-room-width;
  height: calc(100vh - #{$header-height});
  background-color: rgba(0, 0, 0, 0.5);
  overflow: auto;
  transform: translateX(-$chat-room-width);
  // transition: transform 0.1s;

  &.is-show {
    transform: translateX(0);
  }

  .close-btn {
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

  .chat-room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 32px 0;
    margin-bottom: 16px;

    .chat-bot-link {
      width: 70px;
      height: 70px;
      margin: initial;
    }

    .data-source-select {
      width: 150px;
      height: 36px;
    }
  }
}
</style>
