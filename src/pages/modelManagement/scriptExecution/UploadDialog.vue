<template>
  <div class="file-upload-dialog full-page-dialog">
    <div class="dialog-container">
      <transition 
        name="fade" 
        mode="out-in">
        <script-execution-flow
          head
        />
      </transition>
    </div>
  </div>
</template>
<script>
import ScriptExecutionFlow from './ScriptExecutionFlow'

export default {
  name: 'UploadDialog',
  components: {
    ScriptExecutionFlow
  },
  data () {
    return {
    } 
  },
  destroyed () {
    this.$store.commit('modelManagement/clearCurrentUploadInfo')
    this.$store.commit('modelManagement/updateUploadModelList', [])
    this.$store.commit('modelManagement/clearCurrentUploadScriptInfo')
    this.$store.commit('modelManagement/updateScriptName')
  },
  methods: {
  },
}
</script>