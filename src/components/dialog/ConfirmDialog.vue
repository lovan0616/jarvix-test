<template>
  <div 
    :class="name" 
    class="confirm-dialog" 
    tabindex="-1"
    role="dialog"
  >
    <transition name="slide-down">
      <div 
        v-if="showDialog" 
        class="dialog-container" 
        role="document">
        <a 
          href="javascript:void(0)" 
          class="dialog-close-btn"
          @click="close"
        >
          <svg-icon 
            icon-class="close" 
            class="close-icon"/>
        </a>
        <div class="dialog-title-block">
          <div class="dialog-title">{{ title }}</div>
        </div>
        <div class="dialog-body-block">
          <div class="dialog-content-block">
            <slot name="dialogBody"/>
          </div>
          <div 
            slot="dialogFooter" 
            class="dialog-btn-block">
            <slot name="dialogFooter"/>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'ConfirmDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 為了 transition
      showDialog: false
    }
  },
  mounted () {
    document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    this.showDialog = true
  },
  destroyed () {
    document.getElementsByTagName('body')[0].removeAttribute('style')
    this.showDialog = false
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.confirm-dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1020;
  overflow: auto;

  // 確認刪除資料表彈出視窗
  &.confirm-delet-file {
    .dialog-body-block {
      width: 84%;
    }

    .dialog-content-block {
      text-align: left;
      padding: 36px 0 40px;
    }
  }

  &:before {
    position: fixed;
    display: block;
    content: '';
    background-color: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .dialog-container {
    position: relative;
    width: 800px;
    top: 160px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    position: relative;
    background-color: rgba(60, 60, 60, 0.85);
    text-align: center;
    box-shadow: 0px 4px 24px rgba(26, 56, 62, 0.5);
    border-radius: 5px;
    padding: 24px 32px;

    @include response('sm') {
      width: 520px;
    }
  }

  .dialog-title-block {
    position: relative;
    text-align: center;
    margin-bottom: 32px;

    .dialog-title {
      font-size: 24px;
      line-height: 33px;
      letter-spacing: 0.1em;
      color: $theme-text-color;
    }
  }

  .dialog-content-block {
    margin-bottom: 24px;
  }

  .dialog-close-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    color: $theme-text-color;
  }

  .dialog-body-block {
    margin: 0 auto;
  }
}
</style>
<style lang="scss">
.confirm-dialog {
  .dialog-btn-block {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .btn:not(:last-child) {
      margin-right: 20px;
    }
  }
}
</style>
