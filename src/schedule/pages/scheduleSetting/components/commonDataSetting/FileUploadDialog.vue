<template>
  <section class="dialog file-upload-dialog">
    <form
      ref="uploadForm"
      class="dialog__container"
      @submit.stop.prevent="uploadFiles"
    >
      <div class="dialog__title">
        {{ $t('schedule.setting.updateFiles') }}
        ><i
          class="el-icon-close dialog__close-button"
          @click="$emit('close')"
        />
      </div>
      <div class="dialog__body setting-file">
        <div class="setting-file__list">
          <div
            v-for="(file, index) in tempFileData"
            :key="file.id"
            class="setting-file__item"
          >
            <div class="setting-file__item-content">
              <span class="setting-file__item-title">{{ file.alias }}</span>
              <span class="setting-file__item-name">{{ $t('schedule.setting.fileName') }}：{{ file.originFileName || $t('schedule.setting.noFileSelected') }}</span>
              <!--上傳檔案須將 file upload id 帶入 formData 中-->
              <input
                :name="'importFileUploadId' + (index + 1)"
                :value="file.id"
                type="number"
                hidden
              >
              <label
                v-if="!isUploading"
                class="setting-file__item-upload-label link"
              >
                {{ $t('schedule.button.chooseFile') }}
                <input
                  :accept="acceptFileTypes.join(',').toString()"
                  type="file"
                  class="setting-file__item-upload-input"
                  :name="'file' + (index + 1)"
                  hidden
                  @change="updateFileName(index, $event.target.files)"
                >
              </label>
              <spinner
                v-else
                size="20"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="dialog__footer">
        <span class="dialog__footer-message">
          <i class="el-icon-warning-outline" /> {{ $t('schedule.setting.uploadAllMessage') }}
        </span>
        <div class="dialog__button-block">
          <default-button
            v-if="!isUploading"
            native-type="submit"
          >
            {{ $t('schedule.button.upload') }}
          </default-button>
          <default-button
            v-else
            @click="cancelUploadFiles"
          >
            {{ $t('schedule.button.cancelUpload') }}
          </default-button>
        </div>
      </div>
    </form>
  </section>
</template>

<script>
import { Message } from 'element-ui'
import { uploadMultipleFiles } from '@/schedule/API/Setting'
import { CancelToken } from 'axios'
import { acceptCSVFileTypes } from '@/schedule/utils/mixins'

export default {
  name: 'FileUploadDialog',
  mixins: [acceptCSVFileTypes],
  props: {
    fileData: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      acceptFileTypes: [
        '.csv',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ],
      tempFileData: [],
      isUploading: false,
      cancelFunction: null
    }
  },
  mounted () {
    this.tempFileData = this.fileData.map(file => ({
      id: file.id,
      alias: file.alias,
      originFileName: null
    }))
  },
  methods: {
    updateFileName (index, file) {
      if (!file.length) return
      this.tempFileData[index].originFileName = file[0].name
    },
    uploadFiles (e) {
      if (!this.validateForm()) {
        Message({
          message: this.$t('schedule.errorMessage.fileRequiredInAllFiled'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
        return false
      }
      const formData = new FormData(e.target)
      const _this = this
      this.isUploading = true
      uploadMultipleFiles(formData, new CancelToken(function executor (c) {
        _this.cancelFunction = c
      }))
        .then(() => {
          Message({
            message: this.$t('schedule.successMessage.uploadSuccessfully'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.$emit('uploaded')
          this.$emit('close')
        })
        .finally(() => { this.isUploading = false })
    },
    validateForm () {
      return this.tempFileData.some(file => file.originFileName)
    },
    cancelUploadFiles () {
      if (typeof this.cancelFunction !== 'function') return
      this.cancelFunction('cancel request')
    }
  }
}
</script>

<style lang="scss" scoped>
.file-upload-dialog {
  .dialog {
    &__footer {
      font-size: 12px;
    }

    &__footer-message {
      color: #FFDF6F;
    }
  }

  .setting-file {
    &__list {
      background: rgba(50, 58, 58, .95);
      border-radius: 4px;
      padding: 24px;
    }

    &__item {
      &:not(:last-of-type) {
        margin-bottom: 12px;
      }
    }

    &__item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      background-color: rgba(67, 76, 76, .95);
      border-radius: 5px;
      padding: 16px;
    }

    &__item-title {
      font-size: 18px;
      font-weight: 600;
      flex: 30% 1 1;
    }

    &__item-name {
      font-size: 14px;
      flex: 50% 1 1;
    }
  }
}
</style>
