<template>
  <div class="file-upload-finished">
    <div class="dialog-title">
      {{ $t('fileDataUpdate.updateData') }}
    </div>
    <upload-process-block
      :step="step"
      :process-text="processText"
    />
    <div class="dialog-body">
      <file-list-block
        v-if="successList.length > 0"
        :title="$t('editing.uploaded')"
        :file-list="successList"
      >
        <div
          slot="fileListTitle"
          class="uploaded-data-info"
        >
          {{ $t('editing.dataFrame') }}: {{ dataFrameInfo.primaryAlias }}
        </div>
      </file-list-block>
      <file-list-block
        v-if="failList.length > 0"
        :title="$t('editing.unuploaded')"
        :file-list="failList"
        type="fail"
      />
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button
          :disabled="isProcessing"
          class="btn btn-outline"
          @click="cancelFileUpdate"
        >
          {{ $t('button.cancel') }}
        </button>
        <button
          :disabled="isProcessing"
          class="btn btn-outline"
          type="button"
          @click="chooseFileUpload"
        >
          {{ $t('button.chooseFileUpload') }}
        </button>
        <button
          :disabled="successList.length === 0 || isProcessing"
          class="btn btn-default"
          @click="build"
        >
          <span v-if="isProcessing">
            <svg-icon
              v-if="isProcessing"
              icon-class="spinner"
            />
            {{ $t('button.processing') }}
          </span>
          <span v-else>{{ $t('fileDataUpdate.build') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { appendFile, reimportFile } from '@/API/File'
import { uploadStatus } from '@/utils/general'
import { mapState } from 'vuex'
import FileListBlock from '../fileUpload/FileListBlock'
import UploadProcessBlock from '../fileUpload/UploadProcessBlock'

export default {
  name: 'DataUpdateFileUploadStatus',
  components: {
    FileListBlock,
    UploadProcessBlock
  },
  props: {
    dataFrameInfo: {
      type: Object,
      default: null
    },
    step: {
      type: Number,
      default: 3
    },
    processText: {
      type: Array,
      required: true
    },
    updateMode: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isProcessing: false
    }
  },
  computed: {
    ...mapState('dataManagement', ['uploadFileList']),
    successList () {
      return this.uploadFileList.filter(element => {
        return element.status === uploadStatus.success
      })
    },
    failList () {
      return this.uploadFileList.filter(element => {
        return element.status === uploadStatus.fail
      })
    }
  },
  methods: {
    chooseFileUpload () {
      this.$store.commit('dataManagement/updateUploadFileList', [])
      this.$emit('prev')
    },
    cancelFileUpdate () {
      this.$emit('close')
    },
    build () {
      this.isProcessing = true
      // 更新一定只有一筆資料，所以才可以直接取 index 0
      let uploadFile = this.successList[0]
      let uploadFileInfo = {
        fileId: uploadFile.fileId,
        dataFrameId: this.dataFrameInfo.id,
        ...(uploadFile.tabDetail ? { tabDetail: uploadFile.tabDetail } : {})
      }
      let promise
      switch (this.updateMode) {
        case 'append':
          promise = appendFile(uploadFileInfo)
          break
        case 'reimport':
          promise = reimportFile(uploadFileInfo)
          break
      }
      promise.then(() => {
        this.$store.commit('dataSource/setProcessingDataFrameList', {
          dataSourceId: this.$route.params.id,
          dataFrameId: this.dataFrameInfo.id,
          primaryAlias: this.dataFrameInfo.primaryAlias
        })
        this.$emit('next')
      })
        .catch(() => {})
        .finally(() => {
          this.isProcessing = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.file-upload-finished {
  .dialog-title {
    margin-bottom: 32px;
  }

  .uploaded-data-info {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
  }
}
</style>
