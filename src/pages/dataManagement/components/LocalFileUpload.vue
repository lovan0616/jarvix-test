<template>
  <div class="local-file-upload">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="currntUploadStatus === uploadStatus.uploading ? 3 : 2"
    ></upload-process-block>
    <div class="dialog-body">
      <div class="data-source-name">{{ $t('editing.dataSourceName') }}：{{ currentUploadInfo.name }}</div>
      <input type="file" class="hidden" name="fileUploadInput"
        ref="fileUploadInput"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="fileImport"
      >
      <upload-block class="empty-upload-block"
        :bottom-message="$t('editing.clickToSelectFiles')"
        v-if="uploadFileList.length === 0 && unableFileList.length === 0"
        @create="chooseFile"
      >
        <div class="upload-remark" slot="uploadLimit">
          <div class="title">【{{ $t('editing.uploadLimitTitle') }}】</div>
          <div class="content">{{ $t('editing.uploadLimitFileType') }}</div>
          <div class="content">{{ $t('editing.uploadLimitCount', {countLimit: fileCountLimit}) }}</div>
          <div class="content">{{ $t('editing.uploadLimitSize', {limitSize: uploadFileSizeLimit}) }}</div>
          <div class="content">{{ $t('editing.uploadLimitContent') }}</div>
        </div>
      </upload-block>
      <div class="file-list-container"
        v-else
      >
        <file-list-block
          v-if="uploadFileList.length > 0"
          :title="$t('editing.canUpload')"
          :file-list="uploadFileList"
        >
        </file-list-block>
        <file-list-block
          v-if="unableFileList.length > 0"
          :title="$t('editing.unableUpload')"
          :file-list="unableFileList"
        >
        </file-list-block>
        <div class="choose-file-block">
          <a href="javascript:void(0)" class="choose-file"
            v-show="currntUploadStatus === uploadStatus.wait && uploadFileList.length === 0"
            @click="chooseFile"
          >{{ $t('editing.addFile') }}</a>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="file-chosen-info">
        <span v-if="uploadFileList.length > 0 && currntUploadStatus === uploadStatus.wait">
          {{ $t('editing.selectedTablesWaitingToUpload', {num: uploadFileList.length, size: byteToMB(totalTransmitDataAmount)}) }}
        </span>
        <span v-if="currntUploadStatus !== uploadStatus.wait">{{ $t('editing.uploading') }}</span>
      </div>
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          v-if="currntUploadStatus === uploadStatus.wait"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
        <button class="btn btn-default"
          v-if="currntUploadStatus !== uploadStatus.finish"
          :disabled="uploadFileList.length === 0 || currntUploadStatus !== uploadStatus.wait"
          @click="fileUpload"
        >
          <span v-show="currntUploadStatus === uploadStatus.wait">{{ $t('button.confirmUpload') }}</span>
          <span v-show="currntUploadStatus === uploadStatus.uploading"><svg-icon icon-class="spinner"></svg-icon>{{ $t('button.uploading') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { uploadStatus } from '@/utils/general'
import { Message } from 'element-ui'
import { mapState } from 'vuex'
import UploadBlock from '@/components/UploadBlock'
import FileListBlock from './FileListBlock'
import UploadProcessBlock from './UploadProcessBlock'
import { createDataSource } from '@/API/DataSource'

export default {
  name: 'LocalFileUpload',
  components: {
    UploadBlock,
    FileListBlock,
    UploadProcessBlock
  },
  data () {
    return {
      uploadStatus,
      currntUploadStatus: uploadStatus.wait,
      uploadFileSizeLimit: 100,
      unableFileList: []
    }
  },
  watch: {
    uploadFileStatusList (value) {
      if (this.currntUploadStatus !== uploadStatus.uploading) return
      // 所有的檔案都已經上傳完畢
      if (value.findIndex(element => { return element === uploadStatus.wait || element === uploadStatus.uploading }) === -1) {
        this.$store.commit('dataManagement/updateFileLoaded', true)
      }
    }
  },
  methods: {
    chooseFile () {
      let uploadInput = this.$refs.fileUploadInput
      uploadInput.value = ''
      uploadInput.click()
    },
    fileImport (event) {
      let uploadInput = event.target

      // 有選到檔案才執行
      if (uploadInput.files) {
        // 判斷數量是否超過限制
        if (uploadInput.files.length + this.currentUploadInfo.fileCount + this.uploadFileList.length > this.fileCountLimit) {
          Message({
            message: this.$t('editing.reachUploadCountLimit', {countLimit: this.fileCountLimit}),
            type: 'warning',
            duration: 3 * 1000
          })

          return false
        }

        // 如果沒有 dataSourceId 就先去建一個
        if (this.currentUploadInfo.dataSourceId) {
          this.updateFileList(uploadInput.files)
        } else {
          createDataSource(this.currentUploadInfo.name).then(res => {
            this.$store.commit('dataManagement/updateCurrentUploadDataSourceId', res.dataSourceId)
            this.updateFileList(uploadInput.files)
          })
        }
      }
    },
    // 將 input 內的檔案塞進 formData，並存到 store 中
    updateFileList (inputFileList) {
      let fileList = []
      for (let i = 0; i < inputFileList.length; i++) {
        let formData = new FormData()
        let file = inputFileList[i]
        formData.append('file', file)
        formData.append('dataSourceId', this.currentUploadInfo.dataSourceId)
        formData.append('fileFullName', file.name)

        // 判斷是否有檔案超過大小限制
        if (file.size > this.uploadFileSizeLimit * 1024 * 1024) {
          this.unableFileList.push({
            data: formData,
            status: uploadStatus.forbidden,
            id: new Date().getTime() + i,
            msg: this.$t('editing.reachUploadSizeLimit', {limitSize: this.uploadFileSizeLimit})
          })
        } else {
          fileList.push({
            data: formData,
            status: uploadStatus.wait,
            id: new Date().getTime() + i
          })
        }
      }
      this.$store.commit('dataManagement/updateUploadFileList', this.uploadFileList.concat(fileList))
    },
    fileUpload () {
      let fileList = this.uploadFileList.map(element => {
        element.status = uploadStatus.uploading
        return element
      })
      this.$store.commit('dataManagement/updateUploadFileList', fileList)
      this.currntUploadStatus = uploadStatus.uploading
    },
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    }
  },
  computed: {
    ...mapState('dataManagement', ['currentUploadInfo', 'uploadFileList']),
    fileCountLimit () {
      return this.$store.state.dataManagement.fileCountLimit
    },
    uploadFileStatusList () {
      return this.uploadFileList.map(element => {
        return element.status
      })
    },
    // 總資料傳輸量
    totalTransmitDataAmount () {
      return this.uploadFileList.reduce((acc, cur) => {
        return acc + cur.data.get('file').size
      }, 0)
    }
  }
}
</script>
<style lang="scss" scoped>
.local-file-upload {
  .empty-upload-block {
    display: flex;
    height: 400px;
    justify-content: center;
    align-items: center;
  }

  .upload-remark {
    color: $theme-color-warning;
    line-height: 20px;
    font-size: 14px;
    margin-top: 12px;

    .title {
      margin-bottom: 4px;
    }
  }

  .data-source-name {
    text-align: right;
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
  }

  // 為了讓右上角的資料源名稱共用
  .file-list-container {
    margin-top: -28px;
  }

  .choose-file-block {
    display: flex;
    justify-content: flex-end;
  }

  .choose-file {
    font-size: 16px;
    line-height: 1;
    letter-spacing: 0.5px;
    color: $theme-color-primary;
  }

  .file-chosen-info {
    font-size: 12px;
    line-height: 17px;
    letter-spacing: 0.5px;
  }
}
</style>
