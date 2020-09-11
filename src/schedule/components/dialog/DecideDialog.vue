<template>
  <div
    class="dialog"
    @click="closeDialog"
  >
    <div
      class="dialog__inner-box"
      @click.stop
    >
      <div @click="closeDialog">
        <i class="el-icon-close dialog-close" />
      </div>
      <div
        :class="{'hasContent': content}"
        class="dialog__title"
      >
        {{ title }}
      </div>
      <div
        v-if="content"
        class="dialog__description"
      >
        {{ content }}
      </div>
      <div class="dialog__button-block">
        <default-button
          v-if="type === 'showCancel'"
          :disabled="isProcessing"
          type="outline"
          class="btn-cancel"
          @click="closeDialog"
        >
          {{ $t('schedule.button.cancel') }}
        </default-button>
        <default-button
          v-if="type === 'confirm' || type === 'showCancel'"
          :disabled="isProcessing"
          class="btn-confirm"
          @click="confirmBtn"
        >
          <i
            v-if="isProcessing"
            class="el-icon-loading"
          />
          {{ btnText }}
        </default-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DecideSelect',
  props: {
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    type: { type: String, default: '' },
    isProcessing: { type: Boolean, default: false },
    btnText: {
      type: String,
      default: function () {
        return this.$t('schedule.button.delete')
      }
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeDialog')
    },
    confirmBtn () {
      this.$emit('confirmBtn')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &__inner-box{
    text-align: left;
  }

  &__title {
    margin-bottom: 16px;
    font-size: 18px;
    line-height: 22px;
    text-align: left;
  }

  &__description {
    margin-bottom: 48px;
    font-size: 14px;
    line-height: 18px;
  }

  &__button-block {
    display: flex;
    justify-content: flex-end;

    .btn-cancel {
      margin-right: 12px;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

</style>
