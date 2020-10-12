<template>
  <div class="file-upload-finished">
    <file-list-block
      v-if="failList.length > 0"
      :title="$t('editing.unuploaded')"
      :file-list="failList"
      type="fail"
    />
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
  computed: {
    ...mapState('dataManagement', ['uploadFileList']),
    failList () {
      return this.uploadFileList.filter(element => {
        return element.status === uploadStatus.fail
      })
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
