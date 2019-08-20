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
            <router-view ></router-view>
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
  mounted () {
    this.setBookmarkInfo()
  },
  methods: {
    showChatRoom () {
      this.$store.commit('updateChatRoomStatus', true)
    },
    setBookmarkInfo () {
      let bookmarkId = parseInt(this.$route.query.bookmarkId)
      if (bookmarkId) {
        this.$store.commit('bookmark/setBookmarkId', bookmarkId)
      }
      this.$store.dispatch('bookmark/init')
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
    height: calc(100vh - #{$header-height});
    position: absolute;
    top: $header-height;
    right: 0;
    transition: width 0.3s;

    &.is-open {
      width: calc(100% - #{$chat-room-width});
    }
  }

  .main {
    padding-top: 32px;
    padding-bottom: 64px;
    min-height: calc(100vh - 136px);
    min-height: calc(100vh - #{$header-height});
  }

  .chat-bot-btn {
    position: fixed;
    bottom: 16px;
    left: 20px;
    z-index: 999;
    cursor: pointer;
    width: 80px;
    height: 80px;

     &:after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      content: "";
      display: block;
      width: 70px;
      height: 70px;
      box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.5);
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      z-index: -1;
    }
  }
}
</style>
