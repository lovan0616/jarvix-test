<template>
  <div 
    class="upload-block"
    @click="clickBlock"
    @drop.prevent="dropHandler($event)"
    @dragover.prevent
  >
    <div class="upload-text-container">
      <svg-icon 
        icon-class="file-plus" 
        class="upload-icon"/>
      <div 
        v-if="bottomMessage"
        class="upload-message bottom"
      >{{ bottomMessage }}</div>
      <slot name="uploadLimit"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UploadBlock',
  props: {
    bottomMessage: {
      default: null,
      type: String
    },
    remarkMessage: {
      default: null,
      type: String
    },
    acceptFileTypes: {
      default: null,
      type: Array
    }
  },
  methods: {
    clickBlock () {
      this.$emit('create')
    },
    dropHandler (event) {
      let files = []
      if (event.dataTransfer.items) {
        files = Array.from(event.dataTransfer.items).map(item => {
          return this.acceptFileTypes.includes(item.type) ? item.getAsFile() : null
        })
      } 
      this.$emit('filesDropped', files)
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-block {
  flex: 1;
  background-color: rgba(50, 58, 58, 0.95);
  text-align: center;
  cursor: pointer;

  .upload-icon {
    font-size: 52px;
    margin-bottom: 16px;
  }

  .upload-message {
    &.bottom {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.01em;
    }
  }
}
</style>
