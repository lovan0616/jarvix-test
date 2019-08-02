<template>
  <div class="file-list-block">
    <div class="block-title-row">
      <div class="block-title">{{ title }}</div>
      <slot name="fileListTitle"></slot>
    </div>
    <div class="file-list"
      :class="{fail: type === 'fail'}"
    >
      <single-file-row
        v-for="(singleFile, index) in fileList"
        :key="index"
        :single-file="singleFile"
        :index="index"
      ></single-file-row>
    </div>
  </div>
</template>
<script>
import SingleFileRow from './SingleFileRow'

export default {
  name: 'FileListBlock',
  components: {
    SingleFileRow
  },
  props: {
    title: {
      type: String,
      default: null
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      required: false
    }
  }
}
</script>
<style lang="scss" scoped>
.file-list-block {
  &.forbidden {
    .file-list {
      min-height: 90px;
      background-color: #F9F9F9;
    }
  }

  &:not(:last-child) {
    margin-bottom: 15px;
  }

  .block-title-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .block-title {
      font-size: 14px;
      line-height: 21px;
      letter-spacing: 0.5px;
    }
  }

  .file-list {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    height: 300px;
    overflow: auto;

    &.fail {
      height: 100px;
    }
  }
}
</style>
