<template>
  <div class="file-upload-finished">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="3"
    ></upload-process-block>
    <div class="dialog-body">
      <spinner class="spinner-container"
        v-if="isProcessing"
        :title="$t('editing.dataBuilding')"
        size="50"
      ></spinner>
      <div
        v-else
      >
        <file-list-block
          v-if="successList.length > 0"
          :title="$t('editing.uploaded')"
          :file-list="successList"
        >
          <div class="uploaded-data-info" slot="fileListTitle">
            {{ $t('editing.dataSourceInfo', {type: currentUploadInfo.type, dataSourceName: currentUploadInfo.name}) }}
          </div>
        </file-list-block>
        <file-list-block
          v-if="failList.length > 0"
          :title="$t('editing.unuploaded')"
          type="fail"
          :file-list="failList"
        ></file-list-block>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          :disabled="isProcessing"
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button class="btn btn-outline" type="button"
          :disabled="isProcessing"
          @click="prev"
        >{{ $t('button.chooseFileUpload') }}</button>
        <!-- <button class="btn btn-default"
          :disabled="successList.length === 0 || isProcessing"
          @click="buildData"
        >{{ $t('editing.buildImmediately') }}</button> -->
        <button class="btn btn-default"
          :disabled="successList.length === 0 || isProcessing"
          @click="next"
        >{{ $t('button.nextStep') }}：{{ $t('editing.processStep3') }}</button>
      </div>
    </div>
  </div>
</template>
<script>
import { dataSourcePreprocessor } from '@/API/DataSource'
import { analysisFile } from '@/API/File'
import { uploadStatus } from '@/utils/general'
import { mapState } from 'vuex'
import FileListBlock from './FileListBlock'
import UploadProcessBlock from './UploadProcessBlock'
import { Message } from 'element-ui'

export default {
  name: 'LocalFileUploadStatus',
  components: {
    FileListBlock,
    UploadProcessBlock
  },
  data () {
    return {
      uploadStatus,
      dataSourceId: parseInt(this.$route.params.id),
      isProcessing: false
    }
  },
  mounted () {
  },
  methods: {
    cancel () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    next () {
      this.isProcessing = true
      let promiseList = []
      this.importedFileList.forEach((element, index) => {
        promiseList.push(analysisFile(element.id, this.dataSourceId))
      })

      Promise.all(promiseList)
        .then((response) => {
          response.forEach(file => {
            this.$store.commit('dataManagement/updateEtlTableList', file)
          })
          this.$emit('next')
        })
        .catch(() => {
          Message({
            message: this.$t('message.analysisFailed'),
            type: 'error',
            duration: 3 * 1000
          })
        })
        .finally(() => {
          this.isProcessing = false
        })
    },
    prev () {
      // 清空上傳檔案
      this.$store.commit('dataManagement/updateUploadFileList', [])
      // 清空 imported table list
      this.$store.commit('dataManagement/clearImportedTableList')
      this.$emit('prev')
    },
    buildData () {
      let promiseList = []
      this.etlTableList.forEach((element, index) => {
        promiseList.push(dataSourcePreprocessor(element))
      })

      Promise.all(promiseList)
        .then(() => {
          // 全部資料表都設置成功才進入 ConfirmPage 結束導入流程
          this.$emit('dataBuilt')
        })
        .catch(() => {
          Message({
            message: this.$t('message.analysisFailed'),
            type: 'error',
            duration: 3 * 1000
          })
        })
        .finally(() => {
          this.isProcessing = false
        })
    }
  },
  computed: {
    ...mapState('dataManagement', ['currentUploadInfo', 'uploadFileList']),
    successList () {
      return this.uploadFileList.filter(element => {
        return element.status === uploadStatus.success
      })
    },
    failList () {
      return this.uploadFileList.filter(element => {
        return element.status === uploadStatus.fail
      })
    },
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
    },
    importedFileList () {
      return this.$store.state.dataManagement.importedFileList
    }
  }
}
</script>
<style lang="scss" scoped>
.file-upload-finished {
  .dialog-title {
    margin-bottom: 16px;
  }

  .spinner-container {
    height: 60vh;
    background: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
  }

  .uploaded-data-info {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
  }
}
</style>
