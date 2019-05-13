<template>
  <div class="confirm-dialog" tabindex="-1" role="dialog">
    <transition name="slide-down">
      <div v-if="showDialog" class="dialog-container" role="document">
        <div class="dialog-title-block">
          <div class="dialog-title">{{ title }}</div>
          <a href="javascript:void(0)" class="dialog-close-btn"
            @click="close"
          >
            <svg-icon icon-class="close" class="close-icon"></svg-icon>
          </a>
        </div>
        <div class="dialog-body-block">
          <div class="dialog-content-block">
            <slot name="dialogBody"></slot>
          </div>
          <div class="dialog-btn-block" slot="dialogFooter">
            <slot name="dialogFooter"></slot>
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
  z-index: 999;
  overflow: auto;

  &:before {
    position: fixed;
    display: block;
    content: '';
    background-color: rgba(0, 0, 0, 0.58);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .dialog-container {
    position: relative;
    width: 800px;
    top: 194px;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    position: relative;
    background-color: #fff;
    text-align: center;
    box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.2);
    border-radius: 8px;

    @include response('sm') {
      width: 90%;
    }
  }

  .dialog-title-block {
    position: relative;
    padding: 16px 30px;
    text-align: center;
    border-bottom: 1px solid #D8D8D8;

    .dialog-title {
      font-size: 18px;
      line-height: 26px;
      letter-spacing: 0.1em;
      color: #000000;
    }
  }

  .dialog-close-btn {
    position: absolute;
    top: 16px;
    right: 20px;
    color: #828282;
  }

  .dialog-body-block {
    width: 52.5%;
    margin: 0 auto;
    padding-bottom: 35px;
  }

  .dialog-content-block {
    padding: 60px 0;
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
