<template>
  <div class="local-file-upload-flow">
    <transition name="fade" mode="out-in">
      <local-file-upload
        v-if="!fileLoaded"
      ></local-file-upload>
      <first-time-set-table-join
        v-else-if="showSetTableJoin"
      ></first-time-set-table-join>
      <local-file-upload-finished
        v-else
      ></local-file-upload-finished>
    </transition>
  </div>
</template>
<script>
import DataSourceName from './DataSourceName'
import LocalFileUpload from './LocalFileUpload'
import LocalFileUploadFinished from './LocalFileUploadFinished'
import FirstTimeSetTableJoin from '../tableJoin/FirstTimeSetTableJoin'

export default {
  name: 'LocalFileUploadFlow',
  components: {
    DataSourceName,
    LocalFileUpload,
    LocalFileUploadFinished,
    FirstTimeSetTableJoin
  },
  computed: {
    fileLoaded () {
      return this.$store.state.dataManagement.fileLoaded
    },
    showSetTableJoin () {
      return this.$store.state.dataManagement.showSetTableJoin
    }
  }
}
</script>
