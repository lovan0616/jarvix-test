<template>
  <div class="file-upload-dialog full-page-dialog">
    <div class="dialog-container">
      <choose-file-type
        v-if="!fileTypeChosen"
      ></choose-file-type>
      <local-file-upload
        v-else-if="!fileLoaded"
      ></local-file-upload>
      <file-upload-finished
        v-else
      ></file-upload-finished>
    </div>
  </div>
</template>
<script>
import ChooseFileType from './ChooseFileType'
import LocalFileUpload from './LocalFileUpload'
import FileUploadFinished from './FileUploadFinished'

export default {
  name: 'FileUploadDialog',
  components: {
    ChooseFileType,
    LocalFileUpload,
    FileUploadFinished
  },
  data () {
    return {
    }
  },
  destroyed () {
    this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    this.$store.commit('dataManagement/updateUploadFileList', [])
  },
  methods: {
  },
  computed: {
    fileTypeChosen () {
      return this.$store.state.dataManagement.fileTypeChosen
    },
    fileLoaded () {
      return this.$store.state.dataManagement.fileLoaded
    }
  }
}
</script>
<style lang="scss" scoped>
.file-upload-dialog {
}
</style>
