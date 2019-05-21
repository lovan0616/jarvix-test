<template>
  <div class="local-file-upload">
    <div class="dialog-title">新增資料</div>
    <div class="dialog-body">
      <input type="file" class="hidden" name="fileUploadInput"
        ref="fileUploadInput"
        accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
          <a href="javascript:void(0)" class="choose-file"
            slot="fileListTitle"
            @click="chooseFile"
          >+ 選取檔案</a>
        </file-list-block>
        <!-- <file-list-block
          title="無法上傳"
        >
        </file-list-block> -->
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
          @click="fileUpload"
        >確認上傳</button>
      </div>
    </div>
  </div>
</template>
<script>
import { fileStatus } from '@/utils/general'
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
          formData.append('inputFile', uploadInput.files[i])
          fileList.push({
            data: formData,
            status: fileStatus.wait
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
    uploadFileList () {
      return this.$store.state.dataManagement.uploadFileList
    },
    totalTransmitDataAmount () {
      return this.uploadFileList.reduce((acc, cur) => {
        return acc + cur.data.get('inputFile').size
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

  .choose-file {
    font-size: 12px;
    line-height: 21px;
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
