<template>
  <div 
    :class="{'is-show': isShowBasicDataFrameSetting}"
    class="setting__wrapper">
    <div class="setting__body">
      <div class="setting__body__header">
        <div class="setting__body__header--title">SalesForCourseSalesForCourse</div>
        <div 
          class="setting__body__header--icon" 
          @click="closeBasicDataFrameSetting">
          <svg-icon icon-class="close" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BasicDataFrameSetting',
  data () {
    return {}
  },
  computed: {
    isShowBasicDataFrameSetting () {
      return this.$store.state.isShowBasicDataFrameSetting
    }
  },
  methods: {
    closeBasicDataFrameSetting () {
      this.$store.commit('updateBasicDataFrameSettingStatus', false)
    },
  }
}
</script>

<style lang="scss" scoped>
.setting__wrapper {
  position: absolute;
  top: $header-height + $chat-room-height;
  left: 0;
  padding: 8px 16px 0 0;
  min-height: calc(100vh - #{$header-height + $chat-room-height});
  width: $basic-df-setting-width;
  display: flex;
  flex-direction: column;
  transform: translateX(-$basic-df-setting-width);
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.55);

  &.is-show {
    transform: translateX(0);
  }
  
  .setting {
    &__body {
      flex: 1;
      border: 0.5px solid #232C2E;
      padding: 0 0 24px 0;

      &__header {
        display: flex;
        align-items: center;
        padding: 16px 24px;
        color: $theme-color-primary;

        &--title {
          flex: 1;
          margin-right: 8px;
          @include text-hidden;
        }
        
        &--icon {
          cursor: pointer;
        }
      }
    }
  }
}
</style>