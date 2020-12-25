<template>
  <div class="alert-condition-message-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        編輯示警訊息
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="$emit('close')"
        ><svg-icon icon-class="close"/></a>
      </div>
      <div class="setting-block">
        <alert-condition-message-editor
          :is-edit="true"
          :condition="condition"
          @done="$emit('done')"
          @close="$emit('close')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AlertConditionMessageEditor from './AlertConditionMessageEditor'

export default {
  name: 'AlertConditionMessageEditorDialog',
  components: {
    AlertConditionMessageEditor
  },
  props: {
    condition: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.alert-condition-message-dialog {
  &.full-page-dialog {
    .dialog-container {
      width: 40%;
      min-width: 652px;
    }
  }

  .setting-block {
    padding: 24px;
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    margin-bottom: 12px;
  }
}
</style>