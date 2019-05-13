<template>
  <div class="file-upload-dialog full-page-dialog">
    <div class="dialog-container">
      <!-- <div class="dialog-title">新增資料</div>
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
      <div class="dialog-body">
        <upload-block class="empty-upload-block"></upload-block>
        <div>
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
                    <div class="single-file-progress">
                      <div class="progress-bar"
                        :style="{width: '20%'}"
                      ></div>
                    </div>
                  </div>
                  <div class="file-status">
                    <a href="javascript:void(0)" class="action-link">移除</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="file-chosen-block">
            <div class="file-list-block">
              <div class="block-title-row">
                <div class="block-title">無法上傳</div>
              </div>
              <div class="file-list">
                <div class="single-file-row">
                  <div class="single-file-info">
                    <div class="file-name">AAAAAAA.CSV</div>
                    <div class="file-size">80MB</div>
                  </div>
                  <div class="file-status warning">
                    檔案過大
                    <tool-tip
                      class="warning-tool-tip"
                      content="單一檔案大小不超過 100MB"
                    ></tool-tip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <div class="file-chosen-info">已選取 5 項資料表，總和 300 MB，可進行上傳 </div>
        <div class="dialog-button-block">
          <button class="btn btn-outline">取消</button>
          <button class="btn btn-default">確認上傳</button>
        </div>
      </div> -->
      <local-file-upload></local-file-upload>
      <!-- <file-upload-finished
      ></file-upload-finished> -->
    </div>
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import UploadBlock from './UploadBlock'
import ToolTip from './ToolTip'
import LocalFileUpload from './LocalFileUpload'
import FileUploadFinished from './FileUploadFinished'

export default {
  name: 'FileUploadDialog',
  components: {
    SySelect,
    UploadBlock,
    ToolTip,
    LocalFileUpload,
    FileUploadFinished
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
      },
      // 待上傳清單
      uploadFileList: [],
      // 禁止上傳清單
      forbiddenFileList: []
    }
  },
  destroyed () {
    this.$store.commit('dataManagement/updateUploadFileList', [])
  },
  methods: {
    fileTypsChange () {

    }
  }
}
</script>
<style lang="scss" scoped>
.file-upload-dialog {

  .file-chosen-info {
    font-size: 12px;
    line-height: 17px;
    letter-spacing: 0.5px;
  }

  .block-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .block-title {
      line-height: 21px;
      letter-spacing: 0.5px;
    }
  }
}
</style>
