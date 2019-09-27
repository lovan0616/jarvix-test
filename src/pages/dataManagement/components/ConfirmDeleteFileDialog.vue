<template>
  <confirm-dialog class="confirm-delete-file-dialog"
    :title="title"
    name="confirm-delet-file"
    @close="cancel"
  >
    <div class="content" slot="dialogBody">
      <div class="main-content">{{ $t('editing.confirmDeleteNTables', { max: fileList.length }) }}</div>
      <div class="sub-content">{{ $t('editing.describeDeleteNTables') }}</div>
      <div class="file-list">
        <div class="single-file"
          v-for="file in fileList"
          :key="file.id"
        >{{ file.filename }}</div>
      </div>
    </div>
    <template class="dialog-btn-block" slot="dialogFooter">
      <button type="button" class="btn btn-secondary"
        @click="cancel"
      >{{ $t('button.cancel') }}</button>
      <button type="button" class="btn btn-default"
        @click="confirm"
      >{{ $t('button.confirmDelete') }}</button>
    </template>
  </confirm-dialog>
</template>
<script>
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
export default {
  name: 'ConfirmDeleteFileDialog',
  components: {
    ConfirmDialog
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    fileList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
.confirm-delete-file-dialog {
  .content {
    color: $theme-text-color;
    line-height: 28px;
  }
  .main-content {
    margin-bottom: 32px;
  }
  .sub-content {
    margin-bottom: 32px;
  }
  .single-file {
    line-height: 1;
    letter-spacing: 2px;
    color: $theme-color-primary;

    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
}
</style>
