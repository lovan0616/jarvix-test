<template>
  <div class="single-file-row"
    :class="statusClass"
  >
    <div class="single-file-info">
      <div class="file-info name">{{ formDataInfo.name }}</div>
      <div class="file-info size">{{ byteToMB(formDataInfo.size) | formatComma }}MB</div>
      <div class="single-file-progress"
        v-if="singleFile.status === fileStatus.uploading && progress < 100"
      >
        <div class="progress-bar"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>
    <div class="file-status"
      :class="{finished: singleFile.status === fileStatus.success || singleFile.status === fileStatus.fail}"
    >
      <svg-icon
        v-if="singleFile.status === fileStatus.success || singleFile.status === fileStatus.fail"
        :class="singleFile.status === fileStatus.success ? 'success' : 'fail'"
        :icon-class="singleFile.status === fileStatus.success ? 'checked' : 'alert'"
      ></svg-icon>
      <div class="warning"
        v-else-if="singleFile.status === fileStatus.forbidden"
      >
        檔案過大
        <tool-tip
          class="warning-tool-tip"
          content="單一檔案大小不超過 100MB"
        ></tool-tip>
      </div>
      <a class="action-link cancel"
        v-else-if="singleFile.status === fileStatus.uploading"
        href="javascript:void(0)"
      >取消</a>
      <a class="action-link"
        v-else
        href="javascript:void(0)"
        @click="removeFile"
      >移除</a>
    </div>
  </div>
</template>
<script>
import { fileStatus } from '@/utils/general'
import { uploadCSV } from '@/API/Upload'
import ToolTip from './ToolTip'

export default {
  name: 'SingleFileRow',
  components: {
    ToolTip
  },
  props: {
    singleFile: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      fileStatus,
      progress: 0
    }
  },
  watch: {
    'singleFile.status' (value) {
      if (value === fileStatus.uploading) {
        this.uploadFile()
      }
    }
  },
  methods: {
    uploadFile () {
      uploadCSV()
    },
    removeFile () {
      this.$store.commit('dataManagement/removeUploadFile', this.index)
    }
  },
  computed: {
    formDataInfo () {
      return this.singleFile.data.get('file')
    },
    statusClass () {
      switch (this.singleFile.status) {
        case this.fileStatus.wait:
          return 'wait'
        case this.fileStatus.forbidden:
          return 'forbidden'
        case this.fileStatus.uploading:
          return 'uploading'
        case this.fileStatus.success:
          return 'success'
        case this.fileStatus.fail:
          return 'fail'
      }
    },
    storageId () {
      return this.$store.state.dataManagement.currentUploadInfo.storageId
    }
  }
}
</script>
<style lang="scss" scoped>
.single-file-row {
  display: flex;
  padding: 10px 20px;
  font-size: 14px;

  &:hover {
    .file-status .action-link.cancel {
      display: block;
    }
  }

  &.fail {
    color: #BDBDBD;
  }

  .single-file-info {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    line-height: 19px;
    letter-spacing: 0.5px;
    margin-right: 15px;
  }
  .single-file-progress {
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #fff;

    .progress-bar {
      height: 100%;
      background-color: #49E6DE;
    }
  }
  .file-status {
    position: relative;
    width: 52px;

    &.finished {
      text-align: center;
    }

    .warning {
      font-size: 12px;

      &:hover {
        .warning-tool-tip {
          display: block;
        }
      }
    }
    .action-link {
      line-height: 19px;
      letter-spacing: 0.5px;
      color: #43BAC3;

      &.cancel {
        display: none;
      }
    }
    .success {
      color: #43BAC3;
    }
    .fail {
      color: #F1616D;
    }
  }
  .warning-tool-tip {
    display: none;
    width: 196px;
    top: -30px;
    right: -60%;
  }
}
</style>
