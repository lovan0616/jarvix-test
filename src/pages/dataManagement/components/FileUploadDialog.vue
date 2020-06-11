<template>
  <div class="file-upload-dialog full-page-dialog">
    <div class="dialog-container">
      <transition 
        name="fade" 
        mode="out-in">
        <choose-file-type
          v-if="currentUploadInfo.type === null"
        />
        <local-file-upload-flow
          v-else-if="currentUploadInfo.type === importType.LOCAL" 
          head
        />
        <remote-connection-flow
          v-else
        />
      </transition>
    </div>
  </div>
</template>
<script>
import { importType } from '@/utils/general'
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
  data () {
    return {
      importType
    } 
  },
  computed: {
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    }
  },
  destroyed () {
    this.$store.dispatch('dataSource/getDataSourceList', {})
    // 還原狀態
    this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    if (this.currentUploadInfo.type === importType.LOCAL) {
      this.$store.commit('dataManagement/updateUploadFileList', [])
    }

    this.$store.commit('dataManagement/clearCurrentUploadInfo')
    this.$store.commit('dataManagement/clearImportedTableList')
    this.$store.commit('dataManagement/clearEtlTableList')
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped>

</style>
