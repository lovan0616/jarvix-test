<template>
  <div class="tooltip-dialog">
    <div class="text-block">{{ $t('editing.confirmDeleteForeign') }}</div>
    <div class="button-block">
      <a href="javascript:void(0)" class="link"
        @click="cancel"
      >{{ $t('button.cancel') }}</a>
      <a href="javascript:void(0)" class="link"
        @click="confirm"
      >{{ $t('button.delete') }}</a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TooltipDialog',
  mounted () {
    document.addEventListener('click', this.autoHide, false)
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
    cancel () {
      this.$emit('cancel')
    },
    confirm () {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss" scoped>
.tooltip-dialog {
  position: absolute;
  top: 30px;
  z-index: 990;
  background-color: #000;
  padding: 24px 32px;
  box-shadow: 0px 4px 24px rgba(26, 56, 62, 0.5);
  border-radius: 5px;

  &:before {
    display: block;
    content: '';
    position: absolute;
    top: -5px;
    right: 15px;
    width: 20px;
    height: 20px;
    background: #000;
    transform: rotate(45deg);
    border-radius: 3px;
  }

  .text-block {
    margin-bottom: 16px;
  }

  .button-block {
    text-align: center;

    .link {
      &:not(:last-child) {
        margin-right: 16px;
      }
    }
  }
}
</style>
