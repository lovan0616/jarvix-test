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
    this.$store.commit('modelremoveUploadModelManagement/clearCurrentUploadInfo')
    this.$store.commit('modelremoveUploadModelManagement/updateUploadModelList', [])
    this.$store.commit('modelManagement/clearCurrentUploadModelInfo')
    this.$store.commit('modelManagement/updateModelName')
  },
  methods: {
  },
}
</script>