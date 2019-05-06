<template>
  <div class="file-upload-dialog">
    <div class="file-upload-container">
      <div class="file-upload-title">新增資料</div>
      <div class="upload-file-info-block">
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
      <div class="file-upload-region">
        <upload-block class="choose-upload-block"></upload-block>
        <div class="file-chosen-block">
          <div class="file-list-block">
            <div class="block-title-row">
              <div class="block-title">可以上傳</div>
              <a href="" class="choose-file">+ 選取檔案</a>
            </div>
            <div class="file-list">
              <div class="single-file-row">
                <div class="single-file-info">
                  <div class="file-name">AAAAAAA.CSV</div>
                  <div class="file-size">80MB</div>
                  <div class="single-file-progress"></div>
                </div>
                <div class="file-status">
                  <a href="javascript:void(0)" class="action-link">移除</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-button-block">
        <button class="btn btn-outline">取消</button>
        <button class="btn btn-default">確認上傳</button>
      </div>
    </div>
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import UploadBlock from './UploadBlock'

export default {
  name: 'FileUploadDialog',
  components: {
    SySelect,
    UploadBlock
  },
  data () {
    return {
      fileTypsList: [
        {
          name: 'CSV',
          id: 1
        }
      ],
      fileInfo: {
        fileType: null
      }
    }
  },
  methods: {
    fileTypsChange () {

    }
  }
}
</script>
<style lang="scss" scoped>
.file-upload-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FFFFFF;
  opacity: 0.95;
  box-shadow: 0px 4px 24px rgba(0, 0, 0, 0.2);
  padding-top: 80px;
  z-index: 999;
  overflow: auto;

  .file-upload-container {
    width: 680px;
    margin: 0 auto;
  }

  .file-upload-title {
    font-size: 24px;
    line-height: 40px;
    text-align: center;
    letter-spacing: 0.1em;
    color: #000000;
    margin-bottom: 40px;
  }

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

  .choose-upload-block {
    padding-top: 100px;
    height: 400px;
    margin-bottom: 20px;
  }
  .dialog-button-block {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 64px;

    .btn {
      &:not(:last-child) {
        margin-right: 20px;
      }
    }
  }

  .block-title-row {
    display: flex;
    justify-content: space-between;
  }
  .file-list {
    background: #FAFAFA;
    border-radius: 4px;
  }
  .single-file-row {
    display: flex;

    .single-file-info {
      position: relative;
      display: flex;
    }
    .single-file-progress {
      position: absolute;
    }
  }
}
</style>
