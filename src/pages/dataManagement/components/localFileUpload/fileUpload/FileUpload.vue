<template>
  <div class="file-upload">
    <div class="dialog-body">
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
        :drag-enter="dragEnter"
        class="empty-upload-block"
        @create="chooseFile"
        @drop.native.prevent="dropFiles($event)"
        @dragover.native.prevent
        @dragenter.native="toggleDragEnter(true)"
        @dragleave.native="toggleDragEnter(false)"
      >
        <div 
          slot="uploadLimit" 
          class="upload-remark">
          <div class="title">【{{ $t('editing.uploadLimitTitle') }}】</div>
          <div class="conten-container">
            <div class="content">1. {{ $t('editing.uploadLimitFileType') }}</div>
            <div class="content">2. {{ $t('editing.uploadLimitCount', {countLimit: fileCountLimit}) }}</div>
            <div class="content">3. {{ $t('editing.uploadLimitSize', {limitSize: license.maxUploadSize === -1 ? '&#8734;' : shortenDataCapacityNumber(license.maxUploadSize)}) }}</div>
          </div>
          <div class="content">4. {{ $t('editing.uploadLimitContent') }}</div>
        </div>
      </upload-block>
      <div 
        v-else
        class="file-list-container"
        @drop.prevent="dropFiles($event)"
        @dragover.prevent="toggleDragEnter(true)"
        @dragenter="toggleDragEnter(true)"
        @dragleave="toggleDragEnter(false)"
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
          @removeFile="removeUnableFile($event)"
        />
        <div 
          v-if="currntUploadStatus === uploadStatus.wait"
          class="file-chosen-info"
        >
          <span
            :class="{'is-warning': isExceedRemaingDataStorageSize}"
            class="file-chosen-remark">
            {{ fileChosenRemark }}
          </span>
          <button 
            class="btn-m btn-secondary btn-has-icon"
            @click="chooseFile"
          >
            <svg-icon 
              icon-class="file-plus" 
              class="icon"/>
            {{ fileCountLimit > 1 ? $t('editing.addFile') : $t('fileDataUpdate.reChoose') }}
          </button>
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
        <slot 
          v-if="currntUploadStatus === uploadStatus.wait" 
          name="additionalButton"/>
        <button 
          v-if="uploadFileList.length > 0 && currntUploadStatus === uploadStatus.wait"
          :disabled="isExceedRemaingDataStorageSize"
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
import UploadBlock from '@/components/UploadBlock'
import FileListBlock from './FileListBlock'
import UploadProcessBlock from './UploadProcessBlock'
import { uploadStatus } from '@/utils/general'
import { Message } from 'element-ui'
import { mapState } from 'vuex'

export default {
  name: 'FileUpload',
  components: {
    UploadBlock,
    FileListBlock,
    UploadProcessBlock
  },
  props: {
    fileCountLimit: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      uploadStatus,
      currntUploadStatus: uploadStatus.wait,
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
    ...mapState('userManagement', ['license']),
    currentGroupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
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
    },
    // 檢查當前上傳資料量是否大於剩餘總數據量
    isExceedRemaingDataStorageSize () {
      return this.totalTransmitDataAmount >= this.remainingDataStorageSize
    },
    remainingDataStorageSize () {
      const remaining = this.license.maxDataStorageSize - this.license.currentDataStorageSize
      return remaining > 0 ? remaining * 1024 * 1024 * 1024 : 0
    },
    fileChosenRemark () {
      return this.isExceedRemaingDataStorageSize
        ? this.$t('editing.uploadFilesExceedDataStorageMessage', {
          remaining: this.byteToMB(this.remainingDataStorageSize),
          totalFileSize: this.byteToMB(this.totalTransmitDataAmount)
        })
        : this.$t('editing.selectedTablesWaitingToUpload', { num: this.uploadFileList.length, size: this.byteToMB(this.totalTransmitDataAmount) })
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
  methods: {
    dropFiles (event) {
      if (!event.dataTransfer.files) return

      const files = Array.from(event.dataTransfer.files)
        .filter(item => {
          // 遇到有 MIME tpye 為空的情形，改為使用副檔名判斷
          var pattern = new RegExp('.csv$|.xls$|.xlsx$');
          if (item.name.match(pattern)) return true
          // 格式不支援者，最後一併跳提示訊息
          this.notSupportedFileType.add(this.getFileShortExtension(item.type))
        })

      if (this.notSupportedFileType.size > 0) {
        const notSupportedFileTypeString = [...this.notSupportedFileType].join(', ')
        // 避免若同時拖曳超過十個檔案時 $message 重疊
        setTimeout(() => {
          Message({
            message: this.$t('message.fileTypeNotSupported', {fileType: notSupportedFileTypeString}),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
        }, 0)
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
          return type
      }
    },
    toggleDragEnter (isDraggingOver) {
      this.dragEnter = isDraggingOver
    },
    chooseFile () {
      let uploadInput = this.$refs.fileUploadInput
      uploadInput.value = ''
      uploadInput.click()
    },
    fileImport (files) {
      // 有選到檔案才執行
      if (files) {
        // 資料更新一次只能選一個檔案
        if(this.fileCountLimit === 1) {
          this.$store.commit('dataManagement/updateUploadFileList', [])
        }
        // 判斷數量是否超過限制
        if (files.length + this.uploadFileList.length > this.fileCountLimit) {
          Message({
            message: this.$t('editing.reachUploadCountLimit', {countLimit: this.fileCountLimit}),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
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
        // file size 單位為 bytes, license 單位為 GB
        if (this.license.maxUploadSize !== -1 && file.size > 0.01 * 1024 * 1024 * 1024) {
          this.unableFileList.push({
            data: formData,
            status: uploadStatus.forbidden,
            id: new Date().getTime() + i,
            msg: this.$t('editing.reachUploadSizeLimit', {limitSize: this.license.maxUploadSize * 1024})
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
      if (this.isExceedRemaingDataStorageSize) return
      let fileList = this.uploadFileList.map(element => {
        element.status = uploadStatus.uploading
        return element
      })
      this.$store.commit('dataManagement/updateUploadFileList', fileList)
      this.currntUploadStatus = uploadStatus.uploading
      this.$emit('updateCurrntUploadStatus', this.currntUploadStatus)
    },
    cancelFileUpload () {
      this.$emit('close')
    },
    removeUnableFile (index) {
      this.unableFileList.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.file-upload {
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

  .file-chosen-info {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 12px;
    line-height: 17px;
    letter-spacing: 0.5px;

    .file-chosen-remark {
      margin-right: 16px;
      &.is-warning {
        color: $theme-color-danger;
      }
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
