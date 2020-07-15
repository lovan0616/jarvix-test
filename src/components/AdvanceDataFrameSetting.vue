<template>
  <div 
    :class="{ 'is-show': isShowSettingBox }"
    class="setting__wrapper">
    <div class="setting__body">
      <div class="setting__body__header">
        <div class="setting__body__header--title">SalesForCourseSalesForCourse</div>
        <div 
          class="setting__body__header--icon" 
          @click="closeAdvanceDataFrameSetting">
          <svg-icon icon-class="close" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'AdvanceDataFrameSetting',
  data () {
    return {}
  },
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['isShowSettingBox']),
  },
  methods: {
    ...mapMutations('dataFrameAdvanceSetting', ['toggleSettingBox']),
    closeAdvanceDataFrameSetting () {
      this.toggleSettingBox(false)
    },
  }
}
</script>

<style lang="scss" scoped>
.setting__wrapper {
  position: absolute;
  top: $header-height + $chat-room-height;
  left: 0;
  padding: 8px 16px 24px 24px;
  min-height: calc(100vh - #{$header-height + $chat-room-height});
  width: $basic-df-setting-width;
  display: flex;
  flex-direction: column;
  transform: translateX(-$basic-df-setting-width);
  overflow: hidden;

  &.is-show {
    transform: translateX(0);
  }
  
  .setting {
    &__body {
      background-color: #2D3033;
      border-radius: 5px;
      flex: 1;

      &__header {
        display: flex;
        align-items: center;
        padding: 16px 18px;
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