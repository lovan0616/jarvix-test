<template>
  <div class="file-upload-finished">
    <div class="dialog-title">上傳完成</div>
    <div class="finished-img-block">
      <img src="../../../assets/images/upload-done.svg" alt="上傳成功" class="finished-img">
      <div class="finished-file-info">總共 5 項資料表，4 項上傳成功， 1 項未上傳</div>
    </div>
    <div class="dialog-body">
      <file-list-block
        title="已上傳"
      >
        <div class="uploaded-data-info" slot="fileListTitle">資料類型：CSV 資料源名稱：XXXXX 資料11</div>
      </file-list-block>
      <file-list-block
        title="未上傳"
      ></file-list-block>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-default"
          @click="cancelFileUpload"
        >我知道了</button>
      </div>
    </div>
  </div>
</template>
<script>
import FileListBlock from './FileListBlock'

export default {
  name: 'FileUploadFinished',
  components: {
    FileListBlock
  },
  methods: {
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.file-upload-finished {
  .dialog-title {
    margin-bottom: 18px;
  }
  .finished-img-block {
    text-align: center;
    margin-bottom: 44px;
  }
  .finished-img {
    width: 152px;
    margin-bottom: 24px;
  }
  .finished-file-info {
    line-height: 20px;
  }
  .uploaded-data-info {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
  }
}
</style>
