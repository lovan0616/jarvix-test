<template>
  <div class="home-layout">
    <chat-room-block/>
    <basic-data-frame-setting/>
    <div 
      :class="{'wrapper--has-basic-df-setting': isShowBasicDataFrameSetting}"
      class="wrapper wrapper--has-chat-room"
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
        :class="{'preview-datasource--has-basic-df-setting': isShowBasicDataFrameSetting}"
        class="preview-datasource">
        <preview-data-source 
          :key="dataSourceId" 
          :is-previewing="true"
          mode="popup"
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
import BasicDataFrameSetting from '@/components/BasicDataFrameSetting'
import store from '@/store'

export default {
  name: 'HomeLayout',
  components: {
    ChatRoomBlock,
    ChatBotBtn,
    PreviewDataSource,
    BasicDataFrameSetting
  },
  computed: {
    dataSourceId () {
      return this.$store.state.dataSource.dataSourceId
    },
    isShowBasicDataFrameSetting () {
      return this.$store.state.isShowBasicDataFrameSetting
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
  methods: {
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

  .main {
    padding-top: 32px;
    padding-bottom: 64px;
    min-height: calc(100vh - #{$header-height + $chat-room-height});
  }

  .preview-datasource {
    width: 100%;
    height: calc(100vh - #{$header-height + $chat-room-height});
    position: absolute;
    top: $header-height + $chat-room-height;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    overflow: auto;
    padding: 32px 40px 0 40px;
    z-index: 3;

    &--has-basic-df-setting {
      width: calc(100% - #{$basic-df-setting-width});
    }

    &__close-btn {
      position: absolute;
      top: 32px;
      right: 40px;
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
