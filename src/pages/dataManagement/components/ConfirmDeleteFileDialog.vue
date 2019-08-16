<template>
  <confirm-dialog class="confirm-delete-file-dialog"
    :title="title"
    name="confirm-delet-file"
    @close="cancel"
  >
    <div class="content" slot="dialogBody">
      <div class="main-content">您确认要删除以下 {{ fileList.length }} 个资料表吗？</div>
      <div class="sub-content">删除过程会进行资料处理，在此期间您依然可以浏览所有资料源内容，但无法进行新增、删除资料...等任何资料管理的操作。</div>
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
      >取消</button>
      <button type="button" class="btn btn-default"
        @click="confirm"
      >确认删除</button>
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
