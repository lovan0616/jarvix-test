<template>
  <div class="local-file-upload">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="2"
    />
    <file-upload
      class="file-upload-block"
      @next="$emit('next')"
      @close="cancelFileUpload"
    />
  </div>
</template>
<script>
import { uploadStatus } from '@/utils/general'
import FileUpload from './fileUpload/FileUpload'
import UploadProcessBlock from './fileUpload/UploadProcessBlock'

export default {
  name: 'ModelFileUpload',
  components: {
    FileUpload,
    UploadProcessBlock
  },
  data () {
    return {
      uploadStatus
    }
  },
  methods: {
    cancelFileUpload () {
      this.$store.commit('modelManagement/updateShowCreateModelDialog', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.local-file-upload {
  .file-upload-block >>> .file-list-container {
    margin-top: 0px;
  }
}
</style>
