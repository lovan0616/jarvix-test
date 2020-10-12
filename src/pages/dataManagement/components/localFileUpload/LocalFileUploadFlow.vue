<template>
  <div class="local-file-upload-flow">
    <transition 
      name="fade" 
      mode="out-in">
      <local-file-upload
        v-if="step === 0"
        :process-text="processText"
        @next="nextStep"
      />
      <local-file-upload-status
        v-if="step === 1"
        :process-text="processText"
        @next="nextStep"
        @prev="prevStep"
        @dataBuilt="step = 3"
      />
      <etl-setting
        v-if="step === 2"
        @next="nextStep"
        @prev="prevStep"
      />
      <confirm-page
        v-if="step === 3"
        :content="$t('editing.dataBuildingReminding')"
        @next="uploadFinish"
      />
    </transition>
  </div>
</template>
<script>
import LocalFileUpload from './LocalFileUpload'
import LocalFileUploadStatus from './LocalFileUploadStatus'
import EtlSetting from './EtlSetting'
import ConfirmPage from '../fileUpload/ConfirmPage'

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
      dataSourceId: parseInt(this.$route.params.id),
      processText: [
        this.$t('editing.processStep1'),
        this.$t('editing.processStep2'),
        this.$t('editing.processStep3')
      ]
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
