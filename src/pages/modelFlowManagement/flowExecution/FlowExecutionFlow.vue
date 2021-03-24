<template>
  <div class="local-file-upload-flow">
    <transition 
      name="fade" 
      mode="out-in">
      <edit-flow-name
        v-if="step === 0"
        @next="nextStep"
      />
      <content-setting
        v-if="step === 1"
        @next="nextStep"
      />
    </transition>
  </div>
</template>
<script>
import ContentSetting from './ContentSetting.vue'
import EditFlowName from './EditFlowName'

export default {
  name: 'FlowExecutionFlow',
  components: {
    EditFlowName,
    ContentSetting
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
      this.$store.commit('modelFlowManagement/updateShowCreateFlowDialog', false)
    }
  }
}
</script>
