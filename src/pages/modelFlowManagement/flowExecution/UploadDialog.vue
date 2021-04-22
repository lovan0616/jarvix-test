<template>
  <div class="file-upload-dialog full-page-dialog">
    <div class="dialog-container">
      <transition 
        name="fade" 
        mode="out-in">
        <flow-execution-flow />
      </transition>
    </div>
  </div>
</template>
<script>
import FlowExecutionFlow from './FlowExecutionFlow'

export default {
  name: 'UploadDialog',
  components: {
    FlowExecutionFlow
  },
  destroyed () {
    this.$store.commit('modelFlowManagement/updateShowCreateFlowDialog')
    this.$store.commit('modelFlowManagement/updateCurrentUploadFlowInfo', {})
  }
}
</script>