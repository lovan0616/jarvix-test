<template>
  <div
    class="tooltip-dialog"
    @click.stop
  >
    <div class="tooltip__message">{{ msg }}</div>
    <div class="tooltip__buttons">
      <a 
        href="javascript:void(0)" 
        class="link tooltip__link"
        @click.stop="cancel"
      >{{ $t('button.cancel') }}</a>
      <a 
        href="javascript:void(0)" 
        class="link tooltip__link"
        @click.stop="confirm"
      >{{ $t('button.confirm') }}</a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TooltipDialog',
  props: {
    msg: { 
      type: String,
      default: ''}
  },
  methods: {
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
  z-index: 1;
  padding: 10px 12px;
  background: #323A3A;
  border: 1px solid #2AD2E2;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(34, 117, 125, 0.5);

  .tooltip {
    &__message {
      font-size: 14px;
      margin-bottom: 16px;
    }

    &__buttons {
      display: flex;
      justify-content: flex-end;
    }

    &__link {
      &:not(:last-child) {
        color: #FFFFFF;
        margin-right: 12px;
      }
    }
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
