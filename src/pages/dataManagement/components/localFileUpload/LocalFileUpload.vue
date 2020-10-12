<template>
  <div class="local-file-upload">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="currntUploadStatus === uploadStatus.uploading ? 2 : 1"
      :process-text="processText"
    />
    <div class="data-source-name">{{ $t('editing.dataSourceName') }}：{{ currentUploadInfo.name }}</div>
    <file-upload
      :file-count-limit="fileCountLimit"
      @updateCurrntUploadStatus="updateCurrntUploadStatus"
      @next="$emit('next')"
      @close="cancelFileUpload"/>
  </div>
</template>
<script>
import { uploadStatus } from '@/utils/general'
import { mapState } from 'vuex'
import FileUpload from '../fileUpload/FileUpload'
import UploadProcessBlock from '../fileUpload/UploadProcessBlock'

export default {
  name: 'LocalFileUpload',
  components: {
    FileUpload,
    UploadProcessBlock
  },
  props: {
    processText: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      uploadStatus,
      currntUploadStatus: uploadStatus.wait
    }
  },
  computed: {
    ...mapState('dataManagement', ['currentUploadInfo']),
    fileCountLimit () {
      return this.$store.state.dataManagement.fileCountLimit
    }
  },
  methods: {
    updateCurrntUploadStatus (newUploadStatus) {
      this.currntUploadStatus = newUploadStatus
    },
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.local-file-upload {
  .data-source-name {
    text-align: right;
    margin-bottom: 8px;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
  }
}
</style>
