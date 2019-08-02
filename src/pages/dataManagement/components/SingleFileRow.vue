<template>
  <div class="single-file-row"
    :class="statusClass"
  >
    <div class="single-file-info">
      <div class="file-info name">{{ formDataInfo.name }}</div>
      <div class="file-info size">{{ byteToMB(formDataInfo.size) | formatComma }}MB</div>
      <div class="single-file-progress"
        v-if="singleFile.status === uploadStatus.uploading && progress < 100"
      >
        <div class="progress-bar"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>
    <div class="file-status"
      :class="{finished: singleFile.status === uploadStatus.success || singleFile.status === uploadStatus.fail}"
    >
      <svg-icon
        v-if="singleFile.status === uploadStatus.success || singleFile.status === uploadStatus.fail"
        :class="singleFile.status === uploadStatus.success ? 'success' : 'fail'"
        :icon-class="singleFile.status === uploadStatus.success ? 'checked' : 'alert'"
      ></svg-icon>
      <div class="warning"
        v-else-if="singleFile.status === uploadStatus.forbidden"
      >
        檔案過大
        <tool-tip
          class="warning-tool-tip"
          content="單一檔案大小不超過 100MB"
        ></tool-tip>
      </div>
      <a class="action-link cancel"
        v-else-if="singleFile.status === uploadStatus.uploading"
        @click="cancelUpload"
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
import axios from 'axios'
import { uploadStatus } from '@/utils/general'
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
      uploadStatus,
      progress: 0,
      askCancelFunction: null
    }
  },
  watch: {
    'singleFile.status' (value) {
      if (value === uploadStatus.uploading) {
        this.uploadFile()
      }
    }
  },
  methods: {
    uploadFile () {
      let _this = this
      uploadCSV(this.storageId, this.singleFile.id, this.singleFile.data, this.onProgress, new axios.CancelToken(function executor (c) {
        _this.askCancelFunction = c
      }))
        .then(response => {
          this.singleFile.status = uploadStatus.success
        }).catch(() => {
          this.singleFile.status = uploadStatus.fail
        })
    },
    onProgress (percent) {
      this.progress = percent
    },
    removeFile () {
      this.$store.commit('dataManagement/removeUploadFile', this.index)
    },
    cancelUpload () {
      if (typeof this.askCancelFunction === 'function') {
        this.askCancelFunction('cancel request')
      }
    }
  },
  computed: {
    formDataInfo () {
      return this.singleFile.data.get('file')
    },
    statusClass () {
      switch (this.singleFile.status) {
        case this.uploadStatus.wait:
          return 'wait'
        case this.uploadStatus.forbidden:
          return 'forbidden'
        case this.uploadStatus.uploading:
          return 'uploading'
        case this.uploadStatus.success:
          return 'success'
        case this.uploadStatus.fail:
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
      color: $theme-color-primary;

      &.cancel {
        display: none;
      }
    }
    .success {
      color: $theme-color-primary;
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
