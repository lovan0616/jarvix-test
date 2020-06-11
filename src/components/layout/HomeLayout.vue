<template>
  <div class="home-layout">
    <transition 
      name="fade" 
      mode="out-in">
      <ChatRoomBlock/>
    </transition>
    <chat-bot-btn 
      v-if="!isShowChatRoom"
      class="chat-bot-btn"
      @click.native="toggleChatRoom"
    />
    <div 
      :class="{'is-open': isShowChatRoom}"
      class="wrapper"
    >
      <main class="main">
        <div class="center">
          <transition 
            name="fade" 
            mode="out-in">
            <router-view />
          </transition>
        </div>
      </main>
    </div>
    <transition name="fast-fade-in">
      <section 
        v-if="isShowPreviewDataSource"
        class="preview-datasource">
        <preview-data-source 
          :key="dataSourceId" 
          :is-previewing="true"
        />
        <a 
          href="javascript:void(0)" 
          class="preview-datasource__close-btn"
          @click="closePreviewDataSource"
        ><svg-icon icon-class="close"/></a>
      </section>
    </transition>
  </div>
</template>
<script>
import ChatRoomBlock from '@/components/chatBot/ChatRoom'
import ChatBotBtn from '@/components/chatBot/ChatBotBtn'
import PreviewDataSource from '@/components/PreviewDataSource'
import store from '@/store'

export default {
  name: 'HomeLayout',
  components: {
    ChatRoomBlock,
    ChatBotBtn,
    PreviewDataSource
  },
  computed: {
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    isShowChatRoom () {
      return this.$store.state.isShowChatRoom
    },
    isShowPreviewDataSource () {
      return this.$store.state.previewDataSource.isShowPreviewDataSource
    }
  },
  beforeRouteEnter (to, from, next) {
    const currentAccount = store.getters['userManagement/getCurrentAccountId']
    const currentGroup = store.getters['userManagement/getCurrentGroupId']
    currentAccount && !currentGroup ? next({ name: 'PageGrouplessGuidance' }) : next()
  },
  beforeRouteUpdate(to, from, next) {
    if (this.isShowPreviewDataSource) this.closePreviewDataSource()
    next()
  },
  mounted () {
    this.toggleChatRoom(true)
  },
  destroyed () {
    this.toggleChatRoom(false)
  },
  methods: {
    toggleChatRoom (isOpened = true) {
      this.$store.commit('updateChatRoomStatus', isOpened)
      if (!isOpened) this.closePreviewDataSource()
    },
    closePreviewDataSource () {
      this.$store.commit('previewDataSource/togglePreviewDataSource', false)
    }
  },
}
</script>
<style lang="scss" scoped>
.home-layout {
  width: 100%;
  position: relative;

  .wrapper {
    width: 100%;
    height: calc(100vh - #{$header-height});
    position: absolute;
    top: $header-height;
    right: 0;
    // transition: width 0.1s;

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

  .preview-datasource {
    width: calc(100% - #{$chat-room-width});
    height: calc(100vh - #{$header-height});
    position: absolute;
    top: $header-height;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    overflow: auto;
    padding: 32px 40px 0 40px;
    z-index: 3;

    &__close-btn {
      position: absolute;
      top: 32px;
      right: 40px;
      color: #fff;
      font-size: 14px;
    }
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
