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
      <other-setting
        v-if="step === 2"
      />
    </transition>
  </div>
</template>
<script>
import EditFlowName from './EditFlowName'
import ContentSetting from './ContentSetting'
import OtherSetting from './OtherSetting'

export default {
  name: 'FlowExecutionFlow',
  components: {
    EditFlowName,
    ContentSetting,
    OtherSetting
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
    }
  }
}
</script>
