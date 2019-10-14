<template>
  <div class="chat-room-block"
    :class="{'is-show': isShowChatRoom}"
  >
    <a href="javascript:void(0)" class="close-btn"
      @click="closeChatRoom"
    >
      <svg-icon icon-class="double-arrow-left" class="arrow-icon"></svg-icon>
    </a>
    <div class="chat-room-header">
      <chat-bot-btn class="chat-bot-link"></chat-bot-btn>
      <bookmark-select class="bookmark-select"></bookmark-select>
    </div>
    <conversation-block></conversation-block>
    <ask-block></ask-block>
  </div>
</template>
<script>
import ConversationBlock from './ConversationBlock'
import AskBlock from './AskBlock'
import ChatBotBtn from './ChatBotBtn'
import BookmarkSelect from '@/components/select/BookmarkSelect'

export default {
  name: 'ChatRoomBlock',
  components: {
    BookmarkSelect,
    ConversationBlock,
    AskBlock,
    ChatBotBtn
  },
  methods: {
    closeChatRoom () {
      this.$store.commit('updateChatRoomStatus', false)
    }
  },
  computed: {
    isShowChatRoom () {
      return this.$store.state.isShowChatRoom
    }
  },
  watch: {
    // 判斷關閉時機
    '$route.name' (value) {
      if (value !== 'PageIndex' && value !== 'PageResult') {
        this.$store.commit('updateChatRoomStatus', false)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.chat-room-block {
  position: relative;
  display: flex;
  flex-direction: column;
  width: $chat-room-width;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  text-align: center;
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

    .bookmark-select {
      width: 150px;
      height: 36px;
    }
  }
}
</style>
