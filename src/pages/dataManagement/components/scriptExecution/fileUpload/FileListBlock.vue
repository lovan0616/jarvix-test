<template>
  <div class="file-list-block">
    <div class="block-title-row">
      <div class="block-title">{{ title }}</div>
      <slot name="fileListTitle"/>
    </div>
    <div 
      :class="[{fail: type === 'fail'}, {'droppable': dragEnter}]"
      class="file-list"
    >
      <single-file-row
        v-for="(singleFile, index) in fileList"
        :key="index"
        :single-file="singleFile"
        :index="index"
        :progress="progress"
        :currnt-upload-status="currntUploadStatus"
      />
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
      required: false,
      default: ''
    },
    dragEnter: {
      type: Boolean,
      default: false
    },
    progress: {
      type: Number,
      default: 0
    },
    currntUploadStatus: {
      type: String,
      required: true
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
    background: rgba(50, 58, 58, 0.95);
    border-radius: 4px;
    max-height: 280px;
    overflow: auto;
    padding: 24px;
    &.droppable {
      cursor: pointer;
      background: #485454;
    }

    &.fail {
      height: 100px;
    }
  }
}
</style>
