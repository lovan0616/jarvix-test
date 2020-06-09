<template>
  <div 
    :class="{'droppable': dragEnter}"
    class="upload-block"
    @click="clickBlock"
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
    dragEnter: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
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
  background-color: rgba(50, 58, 58, 0.95);
  text-align: center;
  cursor: pointer;
  &:hover, &.droppable {
    background: #485454;
  }
  .upload-text-container {
    pointer-events: none;
  }
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
