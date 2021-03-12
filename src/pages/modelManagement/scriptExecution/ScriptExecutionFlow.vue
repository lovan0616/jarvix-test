<template>
  <div class="local-file-upload-flow">
    <transition 
      name="fade" 
      mode="out-in">
      <edit-script-name
        v-if="step === 0"
        @next="nextStep"
      />
      <script-file-upload
        v-if="step === 1"
        :process-text="processText"
        @next="nextStep"
      />
      <input-setting
        v-if="step === 2"
        :process-text="processText"
        @next="nextStep"
        @prev="prevStep"
      />
      <output-setting
        v-if="step === 3"
        :process-text="processText"
        @next="nextStep"
        @prev="prevStep"
      />
    </transition>
  </div>
</template>
<script>
import EditScriptName from './EditScriptName'
import ScriptFileUpload from './ScriptFileUpload'
import InputSetting from './InputSetting'
import OutputSetting from './OutputSetting'

export default {
  name: 'ScriptExecutionFlow',
  components: {
    EditScriptName,
    ScriptFileUpload,
    InputSetting,
    OutputSetting
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
      this.$store.commit('modelManagement/updateShowCreateModelDialog', false)
    }
  }
}
</script>
