<template>
  <div class="upload-block"
    @click="clickBlock"
  >
    <div class="upload-message top"
      v-if="topMessage"
    >{{ topMessage }}</div>
    <div class="upload-icon-container">
      <img src="../assets/images/file-upload.svg" class="upload-img" alt="">
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
  background-color: $theme-bg-lighter-color;
  text-align: center;
  cursor: pointer;

  .upload-icon-container {
    width: 120px;
    height: 120px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #fff;
  }
  .upload-img {
    width: 45%;
    height: auto;
  }
  .upload-message {
    &.top {
      letter-spacing: 2px;
      margin-bottom: 10px;
    }
    &.bottom {
      font-size: 14px;
      letter-spacing: 0.5px;
      margin-top: 10px;
    }
  }
}
</style>
