<template>
  <div class="local-file-upload">
    <div class="dialog-title">新增资料</div>
    <upload-process-block
      :step="currntUploadStatus === uploadStatus.uploading ? 3 : 2"
    ></upload-process-block>
    <div class="dialog-body">
      <div class="data-source-name">资料源名称：{{ currentUploadInfo.name }}</div>
      <input type="file" class="hidden" name="fileUploadInput"
        ref="fileUploadInput"
        accept=".csv"
        multiple="multiple"
        @change="fileImport"
      >
      <upload-block class="empty-upload-block"
        top-message="点击此选择资料表档案"
        v-if="uploadFileList.length === 0"
        @create="chooseFile"
      >
      </upload-block>
      <div class="file-list-container"
        v-else
      >
        <file-list-block
          title="可以上传"
          :file-list="uploadFileList"
        >
        </file-list-block>
        <div class="choose-file-block">
          <a href="javascript:void(0)" class="choose-file"
            v-show="currntUploadStatus === uploadStatus.wait"
            @click="chooseFile"
          >+ 选取档案</a>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="file-chosen-info">
        <span v-if="uploadFileList.length > 0 && currntUploadStatus === uploadStatus.wait">已选取 {{ uploadFileList.length }} 项资料表，总和 {{ byteToMB(totalTransmitDataAmount) | formatComma }} MB，可进行上传</span>
        <span v-if="currntUploadStatus !== uploadStatus.wait">上传过程中请勿关闭浏览器视窗，以免上传作业失败</span>
      </div>
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          v-if="currntUploadStatus === uploadStatus.wait"
          @click="cancelFileUpload"
        >取消</button>
        <button class="btn btn-default"
          v-if="currntUploadStatus !== uploadStatus.finish"
          :disabled="uploadFileList.length === 0 || currntUploadStatus !== uploadStatus.wait"
          @click="fileUpload"
        >
          <span v-show="currntUploadStatus === uploadStatus.wait">确认上传</span>
          <span v-show="currntUploadStatus === uploadStatus.uploading"><svg-icon icon-class="spinner"></svg-icon>上传中...</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { uploadStatus } from '@/utils/general'
import { mapState } from 'vuex'
import UploadBlock from '@/components/UploadBlock'
import FileListBlock from './FileListBlock'
import UploadProcessBlock from './UploadProcessBlock'

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
      currntUploadStatus: uploadStatus.wait
    }
  },
  watch: {
    uploadFileStatusList (value) {
      if (this.currntUploadStatus !== uploadStatus.uploading) return
      // 所有的檔案都已經上傳完畢
      if (value.findIndex(element => { return element === uploadStatus.wait || element === uploadStatus.uploading }) === -1) {
        this.buildBookmark()
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
      let fileList = []

      // 有選到檔案才執行
      if (uploadInput.files) {
        for (let i = 0; i < uploadInput.files.length; i++) {
          let formData = new FormData()
          formData.append('file', uploadInput.files[i])
          fileList.push({
            data: formData,
            status: uploadStatus.wait,
            id: new Date().getTime() + i
          })
        }
        this.$store.commit('dataManagement/updateUploadFileList', this.uploadFileList.concat(fileList))
      }
    },
    fileUpload () {
      let fileList = this.uploadFileList.map(element => {
        element.status = uploadStatus.uploading
        return element
      })
      this.$store.commit('dataManagement/updateUploadFileList', fileList)
      this.currntUploadStatus = uploadStatus.uploading
    },
    buildBookmark () {
      this.$store.dispatch('dataManagement/buildStorage', false)
        .then(response => {
          this.$store.commit('dataManagement/updateFileLoaded', true)
        })
        .catch(() => {
          this.cancelFileUpload()
        })
    },
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    }
  },
  computed: {
    ...mapState('dataManagement', ['currentUploadInfo', 'uploadFileList']),
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
    padding-top: 100px;
    height: 400px;
  }

  .data-source-name {
    text-align: right;
    margin-bottom: 8px;
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
    font-size: 12px;
    line-height: 17px;
    letter-spacing: 0.5px;
    color: #43BAC3;
  }

  .file-chosen-info {
    font-size: 12px;
    line-height: 17px;
    letter-spacing: 0.5px;
  }
}
</style>
