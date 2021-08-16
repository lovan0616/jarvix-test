<template>
  <div class="home-layout">
    <transition
      name="fade"
      mode="out-in"
    >
      <chat-room-block class="with-side-nav" />
    </transition>
    <transition name="fast-fade-in">
      <advance-data-frame-setting v-if="isShowSettingBox" />
    </transition>
    <div
      :class="{ 'wrapper--has-basic-df-setting': isShowSettingBox }"
      class="wrapper wrapper--has-chat-room"
    >
      <ask-condition :key="`${dataSourceId}-${dataFrameId}`" />
      <main class="main">
        <div class="center">
          <transition
            name="fade"
            mode="out-in"
          >
            <router-view />
          </transition>
        </div>
      </main>
    </div>
    <transition name="fast-fade-in">
      <section
        v-if="isShowPreviewDataSource"
        :class="{ 'preview-datasource--has-basic-df-setting': isShowSettingBox }"
        class="preview-datasource"
      >
        <preview-data-source
          :key="dataSourceId"
          :is-previewing="true"
          mode="popup"
        />
        <a
          href="javascript:void(0)"
          class="preview-datasource__close-btn"
          @click="closePreviewDataSource"
        ><svg-icon icon-class="close" /></a>
      </section>
    </transition>
  </div>
</template>
<script>
import store from '@/store'
import { mapState, mapMutations } from 'vuex'
import dataFrameAdvanceSetting from '@/store/modules/dataFrameAdvanceSetting'

export default {
  name: 'HomeLayout',
  components: {
    ChatRoomBlock: () => import('@/components/chatBot/ChatRoom'),
    PreviewDataSource: () => import('@/components/PreviewDataSource'),
    AdvanceDataFrameSetting: () => import('@/components/AdvanceDataFrameSetting'),
    AskCondition: () => import('@/components/AskCondition')
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
  beforeRouteUpdate (to, from, next) {
    if (this.isShowPreviewDataSource) this.closePreviewDataSource()
    next()
  },
  mounted () {
    if (this.$store.hasModule('dataFrameAdvanceSetting')) {
      this.$store.unregisterModule('dataFrameAdvanceSetting', dataFrameAdvanceSetting)
    }
    this.$store.registerModule('dataFrameAdvanceSetting', dataFrameAdvanceSetting)
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
  }
}
</script>
<style lang="scss" scoped>
.home-layout {
  position: relative;
  width: 100%;

  .main {
    height: calc(100% - 32px);
    overflow: auto;
    padding: 32px 24px 64px;
  }

  .preview-datasource {
    background: rgba(0, 0, 0, 0.89);
    height: calc(100vh - #{$header-height + $chat-room-height});
    overflow: auto;
    padding: 40px;
    position: absolute;
    right: 0;
    top: $header-height + $chat-room-height;
    width: 100%;
    z-index: 3;

    &--has-basic-df-setting {
      width: calc(100% - #{$basic-df-setting-width});
    }

    &__close-btn {
      color: #fff;
      font-size: 14px;
      position: absolute;
      right: 40px;
      top: 32px;
      z-index: 5;
    }
  }
}
</style>
