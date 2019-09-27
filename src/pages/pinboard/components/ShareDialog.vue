<template>
  <div class="tooltip-dialog">
    <div class="input-block">
      <input type="text" class="input" ref="shareInput"
        :value="shareUrl"
        @click="selectText"
        readonly
      >
    </div>
    <button class="btn btn-copy"
      @click="copyInput"
    >{{ $t('button.copy') }}</button>
  </div>
</template>
<script>
import { Message } from 'element-ui'

export default {
  name: 'ShareDialog',
  props: {
    shareUrl: {
      type: String
    }
  },
  mounted () {
    document.addEventListener('click', this.autoHide, false)
    this.selectText()
  },
  destroyed () {
    document.removeEventListener('click', this.autoHide, false)
  },
  methods: {
    autoHide (evt) {
      if (!this.$el.contains(evt.target)) {
        this.$emit('cancel')
      }
    },
    selectText () {
      this.$refs.shareInput.select()
    },
    copyInput () {
      let input = this.$refs.shareInput
      input.select()
      /* For mobile devices */
      input.setSelectionRange(0, 99999)
      document.execCommand('copy')

      Message({
        message: this.$t('message.copiedToBoard'),
        type: 'success',
        duration: 3 * 1000
      })
      this.$nextTick(() => {
        this.$emit('cancel')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tooltip-dialog {
  position: absolute;
  width: 330px;
  top: 32px;
  right: 7px;
  z-index: 990;
  background-color: rgba(29, 39, 39, 0.95);
  padding: 20px 22px;
  box-shadow: 0px 4px 24px rgba(26, 56, 62, 0.5);
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;

  &:before {
    display: block;
    content: '';
    position: absolute;
    top: -5px;
    right: 15px;
    width: 20px;
    height: 20px;
    background: rgba(29, 39, 39, 0.95);
    transform: rotate(45deg);
  }

  .input-block {
    flex: 1;
    margin-right: 12px;
  }

  .btn-copy {
    background-color: rgba(255, 255, 255, 0.16);
    color: #4DE2F0;
    border: none;
  }
}
</style>
