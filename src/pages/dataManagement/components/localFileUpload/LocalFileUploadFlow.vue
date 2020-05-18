<template>
  <div class="local-file-upload-flow">
    <transition name="fade" mode="out-in">
      <local-file-upload
        v-if="step === 0"
        @next="nextStep"
      ></local-file-upload>
      <local-file-upload-status
        v-if="step === 1"
        @next="nextStep"
        @prev="prevStep"
        @dataBuilded="step = 3"
      ></local-file-upload-status>
      <etl-setting
        v-if="step === 2"
        @next="nextStep"
        @prev="prevStep"
      ></etl-setting>
      <confirm-page
        v-if="step === 3"
        @next="uploadFinish"
      ></confirm-page>
    </transition>
  </div>
</template>
<script>
import LocalFileUpload from './LocalFileUpload'
import LocalFileUploadStatus from './LocalFileUploadStatus'
import EtlSetting from './EtlSetting'
import ConfirmPage from './ConfirmPage'

export default {
  name: 'LocalFileUploadFlow',
  components: {
    LocalFileUpload,
    LocalFileUploadStatus,
    EtlSetting,
    ConfirmPage
  },
  data () {
    return {
      step: 0,
      dataSourceId: parseInt(this.$route.params.id)
    }
  },
  methods: {
    nextStep () {
      this.step += 1
    },
    prevStep () {
      this.step -= 1
    },
    uploadFinish () {
      this.$store.commit('dataManagement/updateFileUploadSuccess', true)
      // close fileUploadDialog
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    }
  }
}
</script>
