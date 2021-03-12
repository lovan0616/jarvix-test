<template>
  <div class="local-file-upload">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="2"
      :process-text="processText"
    />
    <file-upload
      :file-count-limit="fileCountLimit"
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
  name: 'ScriptFileUpload',
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
      uploadStatus
    }
  },
  computed: {
    fileCountLimit () {
      return this.$store.state.dataManagement.fileCountLimit
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
