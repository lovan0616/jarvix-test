<template>
  <div 
    class="dialog-box" 
    @click="closeDialog">
    <div 
      class="dialog-inner-box" 
      @click.stop>
      <div @click="closeDialog">
        <svg-icon 
          icon-class="close" 
          class="icon dialog-close"/>
      </div>
      <div class="dialog-content-wrapper">
        <div 
          :class="{'hasContent': content}" 
          class="title">{{ title }}</div>
        <div 
          v-if="content" 
          class="content">{{ content }}</div>
      </div>
      <div class="dialog-button-block">
        <button
          :disabled="isProcessing"
          class="btn dialog-decide-cancel"
          @click="closeDialog">
          {{ $t('button.cancel') }}
        </button>
        <button
          v-if="type === 'confirm'"
          :disabled="isProcessing"
          class="btn btn-default dialog-decide-change-logout"
          @click="confirmBtn"
        >
          <svg-icon 
            v-if="isProcessing" 
            icon-class="spinner"/>
          {{ btnText }}
        </button>
        <button
          v-else-if="type === 'delete'"
          :disabled="isProcessing"
          class="btn btn-default dialog-decide-change-delete"
          @click="confirmBtn"
        >
          <svg-icon 
            v-if="isProcessing" 
            icon-class="spinner"/>
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
    background: transparent;
    color: #FFF;
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

    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
