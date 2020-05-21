<template>
  <div class="single-file-row-container">
    <div class="single-file-row"
      :class="statusClass"
    >
      <div class="single-file-info">
        <div class="file-info name">{{ formDataInfo.name }}</div>
        <div class="file-info size">{{ byteToMB(formDataInfo.size) }}</div>
        <div class="single-file-progress"
          v-if="singleFile.status === uploadStatus.uploading"
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
          v-if="singleFile.status === uploadStatus.success || singleFile.status === uploadStatus.fail || singleFile.status === uploadStatus.forbidden"
          :class="singleFile.status === uploadStatus.success ? 'success' : 'fail'"
          :icon-class="singleFile.status === uploadStatus.success ? 'checked' : 'alert'"
        ></svg-icon>
        <a class="link action-link cancel"
          v-else-if="singleFile.status === uploadStatus.uploading"
          @click="cancelUpload"
          href="javascript:void(0)"
        >{{ $t('button.cancel') }}</a>
        <a class="link action-link"
          v-else
          href="javascript:void(0)"
          @click="removeFile"
        >{{ $t('button.delete') }}</a>
      </div>
    </div>
    <div class="error-notification"
      v-if="singleFile.status === uploadStatus.forbidden"
    >
      <svg-icon icon-class="alert" class="alert-icon"></svg-icon>{{ singleFile.msg }}</div>
  </div>
</template>
<script>
import axios from 'axios'
import { uploadStatus } from '@/utils/general'
import { fileImport } from '@/API/File'

export default {
  name: 'SingleFileRow',
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
      fileImport(this.singleFile.data, this.onProgress, new axios.CancelToken(function executor (c) {
        _this.askCancelFunction = c
      }))
        .then(response => {
          this.$store.commit('dataManagement/updateImportedFileList', response)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.single-file-row-container {
  &:not(:last-child) {
    margin-bottom: 12px;
  }

  .error-notification {
    margin-top: 8px;
    font-size: 13px;
    line-height: 18px;
    color: #FF574C;

    .alert-icon {
      margin-right: 6px;
    }
  }
}

.single-file-row {
  display: flex;
  padding: 10px 20px;
  font-size: 14px;
  background-color: rgba(67, 76, 76, 0.95);
  border-radius: 5px;

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
    flex-wrap: wrap;
    align-items: center;
    flex: 1;
    line-height: 19px;
    letter-spacing: 0.5px;
    margin-right: 15px;
  }
  .single-file-progress {
    flex-basis: 100%;
    height: 3px;
    margin: 8px 0 6px 0;

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #4CE2F0 0%, #438AF8 100%);
      border-radius: 5px;
    }
  }
  .file-status {
    position: relative;
    width: 52px;
    text-align: center;

    .warning {
      font-size: 12px;
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
}
</style>
