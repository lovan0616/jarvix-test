<template>
  <div class="local-file-upload-flow">
    <transition name="fade" mode="out-in">
      <data-source-name
        v-if="step === 0"
        @next="nextStep"
      ></data-source-name>
      <local-file-upload
        v-if="step === 1"
        @next="nextStep"
      ></local-file-upload>
      <local-file-upload-status
        v-if="step === 2"
        @next="nextStep"
      ></local-file-upload-status>
      <choose-column
        v-if="step === 3"
      ></choose-column>
      <local-column-setting
        v-if="step === 4"
      ></local-column-setting>
      <local-file-upload-finished
        v-if="step === 5"
      ></local-file-upload-finished>
    </transition>
  </div>
</template>
<script>
import DataSourceName from './DataSourceName'
import LocalFileUpload from './LocalFileUpload'
import LocalFileUploadStatus from './LocalFileUploadStatus'
import ChooseColumn from './ChooseColumn'
import LocalColumnSetting from './LocalColumnSetting'
import LocalFileUploadFinished from './LocalFileUploadFinished'

export default {
  name: 'LocalFileUploadFlow',
  components: {
    DataSourceName,
    LocalFileUpload,
    LocalFileUploadStatus,
    ChooseColumn,
    LocalColumnSetting,
    LocalFileUploadFinished
  },
  data () {
    return {
      step: 0,
      dataSourceId: this.$route.params ? parseInt(this.$route.params.id) : null
    }
  },
  created () {
    this.step = this.dataSourceId ? 1 : 0
  },
  methods: {
    nextStep () {
      this.step += 1
    }
  }
}
</script>
