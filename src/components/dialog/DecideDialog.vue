<template>
  <div @click="closeDialog" class="dialog-box">
    <div @click.stop class="dialog-inner-box">
      <div @click="closeDialog">
        <svg-icon icon-class="close" class="icon dialog-close"></svg-icon>
      </div>
      <div class="dialog-content-wrapper">
        <div class="title" :class="{'hasContent': content}">{{ title }}</div>
        <div v-if="content" class="content">{{ content }}</div>
      </div>
      <div class="dialog-button-block">
        <button
          :disabled="isProcessing"
          @click="closeDialog"
          class="btn dialog-decide-cancel">
          {{ $t('button.cancel') }}
        </button>
        <button
          v-if="type === 'confirm'"
          :disabled="isProcessing"
          @click="confirmBtn"
          class="btn btn-default dialog-decide-change-logout"
        >
          <svg-icon v-if="isProcessing" icon-class="spinner"></svg-icon>
          {{ btnText }}
        </button>
        <button
          v-else-if="type === 'delete'"
          :disabled="isProcessing"
          @click="confirmBtn"
          class="btn btn-default dialog-decide-change-delete"
        >
          <svg-icon v-if="isProcessing" icon-class="spinner"></svg-icon>
          {{ btnText }}
        </button>
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
        return this.$t('button.delete')
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
.dialog-content-wrapper {
  padding: 28px 0px;
  font-size: 18px;

  .title.hasContent {
    margin-bottom: .5rem;
  }

  .content {
    font-size: 18px;
    color: #4DE2F0;
  }
}

.dialog-button-block {
  display: flex;
  justify-content: center;

  .dialog-decide-cancel {
    margin-right: 15px;
    border: 1px solid #FFFFFF;
    line-height: 36px;
    cursor: pointer;
  }

  .dialog-decide-cancel:hover {
    opacity: 0.8;
  }

  .dialog-decide-change-logout {
    background-color: #2AD2E2;
    line-height: 36px;
    cursor: pointer;
  }

  .dialog-decide-change-delete {
    background-color: rgba(255, 255, 255, 0.16);
    color: #2AD2E2;
    line-height: 36px;
    cursor: pointer;
  }
}
</style>
