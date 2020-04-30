<template>
  <div class="file-upload-dialog full-page-dialog">
    <div class="dialog-container">
      <transition name="fade" mode="out-in">
        <choose-file-type
          v-if="currentUploadInfo.type === null"
        ></choose-file-type>
        <local-file-upload-flow
          v-else-if="currentUploadInfo.type === 'local'"
        ></local-file-upload-flow>
        <remote-connection-flow
          v-else
        ></remote-connection-flow>
      </transition>
    </div>
  </div>
</template>
<script>
import ChooseFileType from './ChooseFileType'
import LocalFileUploadFlow from './localFileUpload/LocalFileUploadFlow'
import RemoteConnectionFlow from './remoteConnection/RemoteConnectionFlow'

export default {
  name: 'FileUploadDialog',
  components: {
    ChooseFileType,
    LocalFileUploadFlow,
    RemoteConnectionFlow
  },
  destroyed () {
    this.$store.dispatch('dataSource/getDataSourceList')
    // 還原狀態
    this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    if (this.currentUploadInfo.type === 'local') {
      this.$store.commit('dataManagement/updateUploadFileList', [])
    }

    this.$store.commit('dataManagement/clearCurrentUploadInfo')
    this.$store.commit('dataManagement/clearEtlTableList')
  },
  methods: {
  },
  computed: {
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    }
  }
}
</script>
<style lang="scss" scoped>
.file-upload-dialog {
}
</style>
