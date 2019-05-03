<template>
  <div class="upload-block"
    @click="clickBlock"
  >
    <div class="upload-message top"
      v-if="topMessage"
    >{{ topMessage }}</div>
    <div class="upload-icon-container">
      <svg-icon icon-class="folder" class="upload-icon"></svg-icon>
    </div>
    <div class="upload-message bottom"
      v-if="bottomMessage"
    >{{ bottomMessage }}</div>
  </div>
</template>
<script>
export default {
  name: 'UploadBlock',
  props: {
    topMessage: {
      default: null,
      type: String
    },
    bottomMessage: {
      default: null,
      type: String
    }
  },
  methods: {
    clickBlock () {
      this.$emit('create')
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-block {
  flex: 1;
  background-color: #FAFAFA;
  text-align: center;
  cursor: pointer;

  .upload-icon-container {
    display: flex;
    width: 120px;
    height: 120px;
    justify-content: center;
    align-items: center;
    background: #EFF5F6;
    border: 1px dashed #78A5A9;
    margin: 0 auto;
  }
  .upload-icon {
    font-size: 48px;
    color: #78A5A9;
  }
  .upload-message {
    font-size: 14px;
    letter-spacing: 0.5px;
    color: #444444;

    &.top {
      margin-bottom: 10px;
    }
    &.bottom {
      margin-top: 10px;
    }
  }
}
</style>
