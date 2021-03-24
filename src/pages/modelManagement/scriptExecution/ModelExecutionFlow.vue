<template>
  <div class="local-file-upload-flow">
    <transition 
      name="fade" 
      mode="out-in">
      <edit-model-name
        v-if="step === 0"
        @next="nextStep"
      />
      <model-file-upload
        v-if="step === 1"
        @next="nextStep"
      />
      <input-setting
        v-if="step === 2"
        @next="nextStep"
        @prev="prevStep"
      />
      <output-setting
        v-if="step === 3"
        @next="nextStep"
        @prev="prevStep"
      />
    </transition>
  </div>
</template>
<script>
import EditModelName from './EditModelName'
import ModelFileUpload from './ModelFileUpload'
import InputSetting from './InputSetting'
import OutputSetting from './OutputSetting'

export default {
  name: 'ModelExecutionFlow',
  components: {
    EditModelName,
    ModelFileUpload,
    InputSetting,
    OutputSetting
  },
  data () {
    return {
      step: 0
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
      // close fileUploadDialog
      this.$store.commit('modelManagement/updateShowCreateModelDialog', false)
    }
  }
}
</script>
