<template>
  <div class="choose-file-type">
    <div class="dialog-title">新增資料</div>
    <div class="dialog-body">
      <div class="file-type-select-block">
        <label for="" class="upload-input-label">選擇資料類型</label>
        <sy-select
          :selected="fileInfo.fileType"
          :items="fileTypsList"
          placeholder="選擇資料類型"
          @update:selected="fileTypsChange"
        ></sy-select>
        <div class="error-text">請先選擇資料類型</div>
      </div>
      <div class="file-source-input-block">
        <label for="" class="upload-input-label">輸入資料源名稱</label>
        <input type="text" class="input file-source-input"
          placeholder="輸入資料源名稱"
        >
        <div class="error-text">請先選擇資料類型</div>
      </div>
    </div>
    <div class="dialog-footer">
      <button class="btn btn-outline">取消</button>
      <button class="btn btn-default">下一步</button>
    </div>
  </div>  
</template>
<script>
export default {
  name: 'ChooseFileType'
}
</script>
<style lang="scss" scoped>
.choose-file-type {
  .upload-file-info-block {
    display: flex;
    margin-bottom: 35px;
  }

  .file-type-select-block {
    position: relative;
    margin-right: 30px;
  }

  .file-source-input-block {
    position: relative;
    flex: 1;

    .file-source-input {
      height: 40px;
    }
  }

  .upload-input-label {
    position: absolute;
    top: -21px;
    font-size: 14px;
    line-height: normal;
    letter-spacing: 0.5px;
    color: #979797;
  }
  .error-text {
    position: absolute;
    bottom: -26px;
  }
}
</style>
