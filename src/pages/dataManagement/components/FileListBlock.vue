<template>
  <div class="file-list-block">
    <div class="block-title-row">
      <div class="block-title">{{ title }}</div>
      <slot name="fileListTitle"></slot>
    </div>
    <div class="file-list">
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
    }
  }
}
</script>
<style lang="scss" scoped>
.file-list-block {
  &:not(:last-child) {
    margin-bottom: 15px;
  }

  .block-title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    .block-title {
      line-height: 21px;
      letter-spacing: 0.5px;
    }
  }

  .file-list {
    background: #FAFAFA;
    border-radius: 4px;
  }
}
</style>
