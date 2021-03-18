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
        v-if="uploadModelList.length === 0"
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
          <div
            v-for="(msg, index) in $t('model.upload.modelLimit')"
            :key="index"
          >{{ Number(index) + 1 }}. {{ $t(`model.upload.modelLimit.${index}`, {mainScriptName}) }}</div>
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
          v-if="uploadModelList.length > 0"
          :drag-enter="dragEnter"
          :title="$t('editing.canUpload')"
          :file-list="uploadModelList"
          :progress="progress"
          :currnt-upload-status="currntUploadStatus"
        />
        <div 
          v-if="uploadModelList.length > 0 && currntUploadStatus === uploadStatus.wait"
          class="file-chosen-info"
        >
          <span class="file-chosen-remark">
            {{ $t('editing.selectedTablesWaitingToUpload', {num: uploadModelList.length, size: byteToMB(totalTransmitDataAmount)}) }}
          </span>
          <button 
            class="btn-m btn-secondary btn-has-icon"
            @click="chooseFile"
          >
            <svg-icon 
              icon-class="file-plus" 
              class="icon"/>
            {{ $t('editing.addFile') }}
          </button>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <span 
          v-if="currntUploadStatus === uploadStatus.uploading" 
          class="uploading-reminding">{{ $t('editing.uploading') }}</span>
        <button 
          v-if="currntUploadStatus === uploadStatus.wait || currntUploadStatus === uploadStatus.fail"
          class="btn btn-outline btn-cancel"
          @click="cancelFileUpload"
        >{{ $t('button.cancel') }}</button>
        <slot 
          v-if="currntUploadStatus === uploadStatus.wait" 
          name="additionalButton"/>
        <button 
          v-if="uploadModelList.length > 0 && currntUploadStatus === uploadStatus.wait"
          class="btn btn-default"
          @click="isReUpload ? fileReUpload() : fileUpload()"
        >
          <span v-show="currntUploadStatus === uploadStatus.wait">{{ $t('button.confirmUpload') }}</span>
          <span v-show="currntUploadStatus === uploadStatus.uploading"><svg-icon icon-class="spinner"/>{{ $t('button.uploading') }}</span>
        </button>
        <button
          v-if="currntUploadStatus === uploadStatus.fail || currntUploadStatus === uploadStatus.success"
          class="btn btn-outline"
          type="button"
          @click="prev"
        >{{ $t('button.chooseFileUpload') }}</button>
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
import { mapState, mapMutations } from 'vuex'
import { uploadModel, reUploadModel } from '@/API/Model'

export default {
  name: 'FileUpload',
  components: {
    UploadBlock,
    FileListBlock,
    UploadProcessBlock
  },
  props: {
    isReUpload: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      uploadStatus,
      currntUploadStatus: uploadStatus.wait,
      formDataList: [],
      acceptFileTypes: [
        '*'
      ],
      dragEnter: false,
      progress: 0,
      mainScriptName: 'main.py'
    }
  },
  computed: {
    ...mapState('userManagement', ['userId']),
    ...mapState('modelManagement', ['currentUploadModelName', 'uploadModelList']),
    currentGroupId () {
      return this.$store.getters['userManagement/getCurrentGroupId']
    },
    currentModelId () {
      return this.$route.params['model_id']
    },
    // 總資料傳輸量
    totalTransmitDataAmount () {
      return this.uploadModelList.reduce((acc, cur) => acc + cur.size, 0)
    }
  },
  destroyed () {
    this.updateUploadModelList([])
  },
  methods: {
    ...mapMutations('modelManagement', ['updateUploadModelList', 'updateCurrentUploadModelInfo']),
    dropFiles (event) {
      if (!event.dataTransfer.files) return
      const files = Array.from(event.dataTransfer.files)
      this.fileImport(files)

      // 還原狀態
      this.dragEnter = false
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
        this.updateFileList(files)
      }
    },
    // 將 input 內的檔案塞進 formData，並存到 store 中
    updateFileList (inputFileList) {
      for (let i = 0; i < inputFileList.length; i++) {
        let formData = new FormData()
        formData.append('model', inputFileList[i])
        if (!this.isReUpload) {
          formData.append('groupId', this.currentGroupId)
          formData.append('userId', this.userId)
        }
        this.formDataList.push({
          data: formData,
          size: inputFileList[i].size,
          groupId: this.currentGroupId,
          fileFullName: inputFileList[i].name,
          status: uploadStatus.wait,
          id: new Date().getTime() + i
        })
      }
      
      this.updateUploadModelList(this.formDataList)
    },
    hasMainPy () {
      const hasMainPy = this.formDataList.findIndex(element => {
        return element.fileFullName === this.mainScriptName
      })

      if (hasMainPy === -1) {
        Message({
          message: this.$t('model.upload.lackOfMainScript', {mainScriptName: this.mainScriptName}),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
        return false
      }
      return true
    },
    async fileUpload () {
      // 先檢查上傳檔案內是否包含 main.py
      if (!this.hasMainPy()) return

      // 更新狀態
      this.currntUploadStatus = uploadStatus.uploading
      try {
        // 先上傳第一筆檔案，換取 script id
        const waitingFileList = [...this.formDataList]
        const firstFormData = waitingFileList.shift().data
        const modelName = this.currentUploadModelName
      /**
       * 注意！
       * 目前後端只會拿第一筆的 id, name 去更新
       */
        if (modelName !== null) {
          firstFormData.append('name', modelName)
        }
        // 上傳檔案
        const { modelId } = await uploadModel(firstFormData)
        this.progress = 50
        // 上傳剩餘檔案
        if (waitingFileList.length > 0) {
          const data = Array.from(waitingFileList, formData => {
            formData.data.append('id', modelId)
            formData.data.append('name', modelName)
            return uploadModel(formData.data)
          })
          await Promise.all(data)
          this.progress = 100
        }
        // 存取 script id，於設定 input / output 時附上
        this.updateCurrentUploadModelInfo({ modelId: modelId })
        this.$nextTick(() => this.$emit('next'))
      } catch (e) {
        this.progress = 0
        this.currntUploadStatus = uploadStatus.fail
      }
    },
    async fileReUpload () {
      // 先檢查上傳檔案內是否包含 main.py
      if (!this.hasMainPy()) return
      
      // 更新狀態
      this.currntUploadStatus = uploadStatus.uploading
      try {
        const waitingFileList = [...this.formDataList]
        this.progress = 50
        if (waitingFileList.length > 0) {
          const data = Array.from(waitingFileList, formData => {
            return reUploadModel(this.currentModelId, formData.data)
          })
          await Promise.all(data)
          this.progress = 100
          this.currntUploadStatus = uploadStatus.success
          this.formDataList.forEach(form => form.status = uploadStatus.success)
        }
      } catch (e) {
        this.progress = 0
        this.currntUploadStatus = uploadStatus.fail
      }
    },
    prev () {
      // 清空上傳檔案
      this.updateUploadModelList([])
      this.formDataList = []
      this.progress = 0
      this.currntUploadStatus = uploadStatus.wait
      this.$emit('prev')
    },
    cancelFileUpload () {
      this.$emit('close')
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
