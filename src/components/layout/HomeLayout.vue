<template>
  <div class="home-layout">
    <transition 
      name="fade" 
      mode="out-in">
      <chat-room-block/>
    </transition>
    <transition name="fast-fade-in">
      <advance-data-frame-setting v-if="isShowSettingBox" />
    </transition>
    <div 
      :class="{ 'wrapper--has-basic-df-setting': isShowSettingBox }"
      class="wrapper wrapper--has-chat-room"
    >
      <ask-condition :key="`${dataSourceId}-${dataFrameId}`"/>
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
        :class="{ 'preview-datasource--has-basic-df-setting': isShowSettingBox }"
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
import AdvanceDataFrameSetting from '@/components/AdvanceDataFrameSetting'
import AskCondition from '@/components/AskCondition'
import store from '@/store'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'HomeLayout',
  components: {
    ChatRoomBlock,
    ChatBotBtn,
    PreviewDataSource,
    AdvanceDataFrameSetting,
    AskCondition,
  },
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox']),
    ...mapState('dataSource', ['dataSourceId', 'dataFrameId']),
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
  destroyed () {
    if (this.isShowPreviewDataSource) this.closePreviewDataSource()
    if (this.isShowSettingBox) this.toggleSettingBox(false)
  },
  methods: {
    ...mapMutations('dataFrameAdvanceSetting', ['toggleSettingBox']),
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
    padding: 32px 24px 64px 24px;
    height: calc(100% - 32px);
    overflow: auto;
  }

  .preview-datasource {
    width: 100%;
    height: calc(100vh - #{$header-height + $chat-room-height});
    position: absolute;
    top: $header-height + $chat-room-height;
    right: 0;
    background: rgba(0, 0, 0, 0.89);
    overflow: auto;
    padding: 40px;
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
      z-index: 5;
    }
  }
}
</style>
