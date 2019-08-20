<template>
  <div class="file-upload-dialog full-page-dialog">
    <div class="dialog-container">
      <transition name="fade" mode="out-in">
        <choose-file-type
          v-if="!currentUploadInfo.type"
        ></choose-file-type>
        <local-file-upload-flow
          v-if="currentUploadInfo.type === 'CSV'"
        ></local-file-upload-flow>
        <remote-connection-flow
          v-if="currentUploadInfo.type === 'mysql'"
        ></remote-connection-flow>
      </transition>
    </div>
  </div>
</template>
<script>
import ChooseFileType from './ChooseFileType'
import LocalFileUploadFlow from './LocalFileUploadFlow'
import RemoteConnectionFlow from './RemoteConnectionFlow'

export default {
  name: 'FileUploadDialog',
  components: {
    ChooseFileType,
    LocalFileUploadFlow,
    RemoteConnectionFlow
  },
  destroyed () {
    // 還原狀態
    this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    this.$store.commit('dataManagement/updateUploadFileList', [])
    this.$store.commit('dataManagement/updateFileLoaded', false)
    this.$store.commit('dataManagement/updateConnectionStatus', null)
    this.$store.commit('dataManagement/clearCurrentUploadInfo')
    this.$store.commit('dataManagement/clearConnectionInfo')
    this.$store.commit('dataManagement/updateShowSetTableJoin', false)
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
