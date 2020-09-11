<template>
  <div class="file-upload-finished">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="3"
    />
    <div class="dialog-body">
      <file-list-block
        v-if="successList.length > 0"
        :title="$t('editing.uploaded')"
        :file-list="successList"
      >
        <div 
          slot="fileListTitle" 
          class="uploaded-data-info">
          {{ $t('editing.dataSourceInfo', {type: currentUploadInfo.type, dataSourceName: currentUploadInfo.name}) }}
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
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button 
          :disabled="isProcessing" 
          class="btn btn-outline"
          type="button"
          @click="prev"
        >{{ $t('button.chooseFileUpload') }}</button>
        <button 
          :disabled="successList.length === 0 || isProcessing"
          class="btn btn-default"
          @click="next"
        >
          <span v-if="isProcessing">
            <svg-icon 
              v-if="isProcessing" 
              icon-class="spinner"/>
            {{ $t('button.processing') }}
          </span>
          <span v-else>{{ $t('button.nextStep') }}：{{ $t('editing.processStep3') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { analysisFile } from '@/API/File'
import { uploadStatus } from '@/utils/general'
import { mapState } from 'vuex'
import FileListBlock from './FileListBlock'
import UploadProcessBlock from './UploadProcessBlock'

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
            file.dataSourceId = this.dataSourceId
            this.$store.commit('dataManagement/updateEtlTableList', file)
          })
          this.$emit('next')
        })
        .catch(() => {})
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
