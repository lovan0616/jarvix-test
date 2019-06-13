<template>
  <div class="local-file-upload-flow">
    <transition name="fade" mode="out-in">
      <local-file-upload
        v-if="!fileLoaded"
      ></local-file-upload>
      <local-file-upload-finished
        v-else
      ></local-file-upload-finished>
    </transition>
  </div>
</template>
<script>
import LocalFileUpload from './LocalFileUpload'
import LocalFileUploadFinished from './LocalFileUploadFinished'
export default {
  name: 'LocalFileUploadFlow',
  components: {
    LocalFileUpload,
    LocalFileUploadFinished
  },
  computed: {
    fileLoaded () {
      return this.$store.state.dataManagement.fileLoaded
    }
  }
}
</script>
