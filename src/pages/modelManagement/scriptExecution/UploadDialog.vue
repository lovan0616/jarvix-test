<template>
  <div class="file-upload-dialog full-page-dialog">
    <div class="dialog-container">
      <transition 
        name="fade" 
        mode="out-in">
        <model-execution-flow />
      </transition>
    </div>
  </div>
</template>
<script>
import ModelExecutionFlow from './ModelExecutionFlow'

export default {
  name: 'UploadDialog',
  components: {
    ModelExecutionFlow
  },
  data () {
    return {
    } 
  },
  destroyed () {
    this.$store.commit('modelManagement/updateUploadModelList', [])
    this.$store.commit('modelManagement/clearCurrentUploadModelInfo')
    this.$store.commit('modelManagement/updateModelName')
  },
  methods: {
  },
}
</script>