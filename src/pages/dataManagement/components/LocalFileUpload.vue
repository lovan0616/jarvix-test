<template>
  <div class="local-file-upload">
    <div class="dialog-title">新增資料</div>
    <div class="dialog-body">
      <div class="data-source-name"
      >資料源名稱：{{ currentUploadInfo.name }}</div>
      <input type="file" class="hidden" name="fileUploadInput"
        ref="fileUploadInput"
        accept=".csv"
        multiple="multiple"
        @change="fileImport"
      >
      <upload-block class="empty-upload-block"
        top-message="點擊此選擇資料表檔案"
        v-if="uploadFileList.length === 0"
        @create="chooseFile"
      >
      </upload-block>
      <div
        v-else
      >
        <file-list-block
          title="可以上傳"
          :file-list="uploadFileList"
        >
        </file-list-block>
        <div class="choose-file-block">
          <a href="javascript:void(0)" class="choose-file"
            @click="chooseFile"
          >+ 選取檔案</a>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="file-chosen-info"
        v-if="uploadFileList.length > 0"
      >已選取 {{ uploadFileList.length }} 項資料表，總和 {{ byteToMB(totalTransmitDataAmount) | formatComma }} MB，可進行上傳 </div>
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          @click="cancelFileUpload"
        >取消</button>
        <button class="btn btn-default"
          :disabled="uploadFileList.length === 0"
          @click="fileUpload"
        >確認上傳</button>
      </div>
    </div>
  </div>
</template>
<script>
import { fileStatus } from '@/utils/general'
import { mapState } from 'vuex'
import UploadBlock from '@/components/UploadBlock'
import FileListBlock from './FileListBlock'

export default {
  name: 'LocalFileUpload',
  components: {
    UploadBlock,
    FileListBlock
  },
  data () {
    return {
      uploadStatus: false
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
            status: fileStatus.wait,
            id: new Date().getTime() + i
          })
        }
        this.$store.commit('dataManagement/updateUploadFileList', this.uploadFileList.concat(fileList))
      }
    },
    fileUpload () {
      let fileList = this.uploadFileList.map(element => {
        element.status = fileStatus.uploading
        return element
      })
      this.$store.commit('dataManagement/updateUploadFileList', fileList)
    },
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    }
  },
  computed: {
    ...mapState('dataManagement', ['currentUploadInfo']),
    uploadFileList () {
      return this.$store.state.dataManagement.uploadFileList
    },
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
    position: absolute;
    top: 0;
    right: 0;
    line-height: 20px;
    letter-spacing: 0.5px;
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
