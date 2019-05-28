<template>
  <div class="file-upload-dialog full-page-dialog">
    <div class="dialog-container">
      <transition name="fade" mode="out-in">
        <choose-file-type
          v-if="!fileTypeChosen"
        ></choose-file-type>
        <local-file-upload
          v-else-if="!fileLoaded"
        ></local-file-upload>
        <file-upload-finished
          v-else
        ></file-upload-finished>
      </transition>
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
  destroyed () {
    // 還原狀態
    this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    this.$store.commit('dataManagement/updateUploadFileList', [])
    this.$store.commit('dataManagement/updateFileTypeChosen', false)
    this.$store.commit('dataManagement/updateFileLoaded', false)
    this.$store.commit('dataManagement/clearCurrentUploadInfo')
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
