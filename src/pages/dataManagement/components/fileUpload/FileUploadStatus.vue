<template>
  <div class="file-upload-finished">
    <div class="dialog-title">
      {{ title }}
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
          class="uploaded-data-info">
          {{ getDataInfo }}
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
        <slot 
          :success-list="successList" 
          name="button"/>
      </div>
    </div>
  </div>
</template>
<script>
import { uploadStatus } from '@/utils/general'
import { mapState } from 'vuex'
import FileListBlock from './FileListBlock'
import UploadProcessBlock from './UploadProcessBlock'

export default {
  name: 'FileUploadStatus',
  components: {
    FileListBlock,
    UploadProcessBlock
  },
  props: {
    dataFrameName: {
      type: String,
      default: null
    },
    step: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    processText: {
      type: Array,
      required: true
    }
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
    getDataInfo () {
      return this.dataFrameName 
        ? this.$t('editing.dataFrame') + ':' + this.dataFrameName
        : this.$t('editing.dataSourceInfo', {type: this.currentUploadInfo.type, dataSourceName: this.currentUploadInfo.name})
    },
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
