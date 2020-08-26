<template>
  <div class="file__item">
    <div class="file__item-info">
      <div class="file__item-title">
        {{ fileData.alias }}
      </div>
      <div class="file__item-description">
        <div class="file__item-name">
          {{ $t('schedule.setting.fileName') }}：{{ fileData.originFileName || $t('schedule.setting.noFileSelected') }}
        </div>
        <div class="file__item-date">
          {{ $t('schedule.setting.updatedDate') }}：{{ fileData.updateDate }}
        </div>
      </div>
    </div>
    <div class="file__item-button-block">
      <label
        v-if="!isUploading"
        class="file__item-button btn btn-secondary"
      >
        {{ $t('schedule.button.updateFiles') }}
        <input
          :accept="acceptFileTypes.join(',').toString()"
          type="file"
          class="file__item-upload-input"
          name="file"
          hidden
          @change="uploadFile(fileData.id, $event.target.files)"
        >
      </label>
      <spinner
        v-else
        size="20"
      />
      <default-button
        :show-spinner="isDownloading"
        :disabled="isDownloading"
        type="secondary"
        class="file__item-button btn btn-secondary"
        @click="onClickDownloadCurrentSetting(fileData.id, fileData.originFileName)"
      >
        {{ $t('schedule.button.downloadFile') }}
      </default-button>
      <a
        :href="`/static/files/${fileData.code}.csv`"
        class="file__item-button btn btn-secondary"
        download
      >
        {{ $t('schedule.button.templateFileDownload') }}
      </a>
    </div>
  </div>
</template>

<script>
import { uploadSingleFile } from '@/schedule/API/Setting'
import { acceptCSVFileTypes } from '@/schedule/utils/mixins'

export default {
  name: 'SingleConstraintFile',
  mixins: [acceptCSVFileTypes],
  props: {
    fileData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      publicPath: process.env.BASE_URL,
      isUploading: false,
      tempFileData: null,
      isDownloading: false
    }
  },
  methods: {
    uploadFile (id, file) {
      if (!file.length) return
      this.isUploading = true
      const formData = new FormData()
      formData.append('file', file[0])
      formData.append('importFileUploadId', id)
      uploadSingleFile(formData)
        .then(() => { this.$emit('uploaded') })
        .finally(() => { this.isUploading = false })
    },
    onClickDownloadCurrentSetting (fileId, fileName) {
      this.isDownloading = true
      this.$store.dispatch('scheduleSetting/downloadCurrentSetting', fileId)
        .then(({ data }) => {
          const blob = new Blob(['\uFEFF' + data], { type: 'text/csv;charset=utf-8;' })
          if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, fileName)
          } else {
            const link = document.createElement('a')
            if (link.download !== undefined) {
              // Browsers that support HTML5 download attribute
              const url = URL.createObjectURL(blob)
              link.setAttribute('href', url)
              link.setAttribute('download', fileName)
              link.style.visibility = 'hidden'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }
          }
        })
        .catch(() => {})
        .finally(() => { this.isDownloading = false })
    }
  }
}
</script>

<style lang="scss" scoped>
.file__item {
  &-button {
    display: flex;
    align-items: center;
  }
}
.spinner-block {
  height: 32px;
  width: 100px;
}
</style>
