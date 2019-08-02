<template>
  <div class="app-layout">
    <ChatRoomBlock/>
    <chat-bot-btn class="chat-bot-btn"
      v-if="!isShowChatRoom"
      @click.native="showChatRoom"
    ></chat-bot-btn>
    <div class="wrapper"
      :class="{'is-open': isShowChatRoom}"
    >
      <app-header>
        <HeaderNav slot="nav" />
      </app-header>
      <main class="main">
        <div class="center">
          <transition name="fade" mode="out-in">
            <keep-alive include="PageResult">
              <router-view ></router-view>
            </keep-alive>
          </transition>
        </div>
      </main>
    </div>
  </div>
</template>
<script>
import AppHeader from './AppHeader'
import HeaderNav from './HeaderNav'
import ChatRoomBlock from '@/components/chatBot/ChatRoom'
import ChatBotBtn from '@/components/chatBot/ChatBotBtn'

export default {
  name: 'AppLayout',
  components: {
    AppHeader,
    HeaderNav,
    ChatRoomBlock,
    ChatBotBtn
  },
  methods: {
    showChatRoom () {
      this.$store.commit('updateChatRoomStatus', true)
    }
  },
  computed: {
    isShowChatRoom () {
      return this.$store.state.isShowChatRoom
    }
  }
}
</script>
<style lang="scss" scoped>
.app-layout {
  width: 100%;
  position: relative;

  .wrapper {
    width: 100%;
    position: absolute;
    top: $header-height;
    right: 0;
    transition: width 0.3s;

    &.is-open {
      width: calc(100% - #{$chat-room-width});
    }
  }

  .main {
    margin-top: 72px;
    margin-bottom: 64px;
    min-height: calc(100vh - 136px);
  }

  .chat-bot-btn {
    position: fixed;
    bottom: 16px;
    left: 20px;
    z-index: 999;
    cursor: pointer;
  }
}
</style>
