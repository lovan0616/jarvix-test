<template>
  <div class="local-file-upload">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="currntUploadStatus === uploadStatus.uploading ? 2 : 1"
    />
    <div class="dialog-body">
      <div class="data-source-name">{{ $t('editing.dataSourceName') }}：{{ currentUploadInfo.name }}</div>
      <input 
        ref="fileUploadInput" 
        :accept="acceptFileTypes.join(',').toString()" 
        type="file"
        class="hidden"
        name="fileUploadInput"
        multiple
        @change="fileImport($event.target.files)"
      >
      <upload-block
        v-if="uploadFileList.length === 0 && unableFileList.length === 0"
        :bottom-message="$t('editing.clickToSelectFiles')"
        :accept-file-types="acceptFileTypes"
        :drag-enter="dragEnter"
        class="empty-upload-block"
        @create="chooseFile"
        @drop.native.prevent="dropFiles($event)"
        @dragover.native.prevent
        @dragenter.native="dragEnter = true"
        @dragleave.native="dragEnter = false"
      >
        <div 
          slot="uploadLimit" 
          class="upload-remark">
          <div class="title">【{{ $t('editing.uploadLimitTitle') }}】</div>
          <div class="conten-container">
            <div class="content">1. {{ $t('editing.uploadLimitFileType') }}</div>
            <div class="content">2. {{ $t('editing.uploadLimitCount', {countLimit: fileCountLimit}) }}</div>
            <div class="content">3. {{ $t('editing.uploadLimitSize', {limitSize: uploadFileSizeLimit}) }}</div>
          </div>
          <div class="content">4. {{ $t('editing.uploadLimitContent') }}</div>
        </div>
      </upload-block>
      <div 
        v-else
        class="file-list-container"
        @drop.prevent="dropFiles($event)"
        @dragover.prevent
        @dragenter="dragEnter = true"
        @dragleave="dragEnter = false"
      >
        <file-list-block
          v-if="uploadFileList.length > 0"
          :drag-enter="dragEnter"
          :title="$t('editing.canUpload')"
          :file-list="uploadFileList"
        />
        <file-list-block
          v-if="unableFileList.length > 0"
          :title="$t('editing.unableUpload')"
          :file-list="unableFileList"
        />
        <div 
          v-if="uploadFileList.length > 0 && currntUploadStatus === uploadStatus.wait"
          class="file-chosen-info"
        >
          <span class="file-chosen-remark">
            {{ $t('editing.selectedTablesWaitingToUpload', {num: uploadFileList.length, size: byteToMB(totalTransmitDataAmount)}) }}
          </span>
          <button 
            class="btn-m btn-secondary btn-has-icon"
            @click="chooseFile"
          ><svg-icon 
            icon-class="file-plus" 
            class="icon"/>{{ $t('editing.addFile') }}</button>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <span 
          v-if="currntUploadStatus !== uploadStatus.wait" 
          class="uploading-reminding">{{ $t('editing.uploading') }}</span>
        <button 
          v-if="currntUploadStatus === uploadStatus.wait"
          class="btn btn-outline"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
        <button 
          v-if="uploadFileList.length > 0 && currntUploadStatus === uploadStatus.wait"
          class="btn btn-default"
          @click="fileUpload"
        >
          <span v-show="currntUploadStatus === uploadStatus.wait">{{ $t('button.confirmUpload') }}</span>
          <span v-show="currntUploadStatus === uploadStatus.uploading"><svg-icon icon-class="spinner"/>{{ $t('button.uploading') }}</span>
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
import { getAccountInfo } from '@/API/Account'

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
      uploadFileSizeLimit: null,
      unableFileList: [],
      acceptFileTypes: [
        '.csv',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ],
      dragEnter: false,
      notSupportedFileType: new Set()
    }
  },
  computed: {
    ...mapState('dataManagement', ['currentUploadInfo', 'uploadFileList']),
    currentGroupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    },
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
  },
  watch: {
    uploadFileStatusList (value) {
      if (this.currntUploadStatus !== uploadStatus.uploading) return
      // 所有的檔案都已經上傳完畢
      if (value.findIndex(element => { return element === uploadStatus.wait || element === uploadStatus.uploading }) === -1) {
        this.$emit('next')
      }
    }
  },
  mounted () {
    if (localStorage.getItem('uploadLimit')) {
      this.uploadFileSizeLimit = parseInt(localStorage.getItem('uploadLimit'), 10)
    } else {
      getAccountInfo()
        .then(accountInfo => {
          const licenseMaxSize = accountInfo.license.maxDataStorageSize * 1024
          this.uploadFileSizeLimit = licenseMaxSize ? licenseMaxSize : 3000
        })
        .catch(() => {
          this.uploadFileSizeLimit = 3000
        })
    }
  },
  methods: {
    dropFiles (event) {
      if (!event.dataTransfer.items) return

      const files = Array.from(event.dataTransfer.items)
        .filter(item => {
          if (this.acceptFileTypes.includes(item.type)) return true
          // 格式不支援者，最後一併跳提示訊息
          this.notSupportedFileType.add(this.getFileShortExtension(item.type))
        })
        .map(item => item.getAsFile())

      if (this.notSupportedFileType.size > 0) {
        Message({
          message: this.$t('message.fileTypeNotSupported', {fileType: [...this.notSupportedFileType].join(', ')}),
          type: 'warning',
          duration: 3 * 1000
        })
      }
      this.fileImport(files)

      // 還原狀態
      this.dragEnter = false
      this.notSupportedFileType = new Set()
    },
    getFileShortExtension (type) {
      switch (type) {
        case 'application/pdf':
          return 'PDF'
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          return 'PPT'
        case 'image/png':
        case 'image/jpeg':
          return 'IMAGE'
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return 'WORD'
        default:
          return '此'
      }
    },
    chooseFile () {
      let uploadInput = this.$refs.fileUploadInput
      uploadInput.value = ''
      uploadInput.click()
    },
    fileImport (files) {
      // 有選到檔案才執行
      if (files) {
        // 判斷數量是否超過限制
        if (files.length + this.uploadFileList.length > this.fileCountLimit) {
          Message({
            message: this.$t('editing.reachUploadCountLimit', {countLimit: this.fileCountLimit}),
            type: 'warning',
            duration: 3 * 1000
          })

          return false
        }
        this.updateFileList(files)
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
        formData.append('groupId', this.currentGroupId)
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

    .conten-container {
      display: flex;

      .content:not(:last-child) {
        &:after {
          content: '/';
          padding: 0 8px;
          color: #6c8281;
        }
      }
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
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 12px;
    line-height: 17px;
    letter-spacing: 0.5px;
    pointer-events: none;

    .file-chosen-remark {
      margin-right: 16px;
    }
  }

  .uploading-reminding {
    font-size: 12px;
    line-height: 17px;
    letter-spacing: 0.5px;
    color: $theme-color-warning;
  }
}
</style>
