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
      <router-link to="/" class="chat-bot-link"><img src="@/assets/images/logo_white.svg" alt="sygps-logo" class="chat-bot-logo"></router-link>
      <bookmark-select class="bookmark-select"></bookmark-select>
    </div>
    <conversation-block></conversation-block>
    <ask-block></ask-block>
  </div>
</template>
<script>
import ConversationBlock from './ConversationBlock'
import AskBlock from './AskBlock'
import BookmarkSelect from '@/components/select/BookmarkSelect'

export default {
  name: 'ChatRoomBlock',
  components: {
    BookmarkSelect,
    ConversationBlock,
    AskBlock
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
      if (value !== 'PageIndex' || value !== 'PageResult') {
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
  padding: 24px 32px 32px;
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
    margin-bottom: 16px;

    .chat-bot-link {
      width: 120px;
    }

    .chat-bot-logo {
      width: 100%;
    }

    .bookmark-select {
      width: 150px;
    }
  }
}
</style>
