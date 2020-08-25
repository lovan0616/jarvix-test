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
      <default-button
        :show-spinner="isDownloading"
        :disabled="isDownloading"
        type="secondary"
        class="file__item-button btn btn-secondary"
        @click="onClickDownloadCurrentSetting(fileData.id ,fileData.originFileName)"
      >
        {{ $t('schedule.button.downloadFile') }}
      </default-button>
      <a
        :href="`../../../files/${fileData.code}.csv`"
        class="file__item-button btn btn-secondary"
        download
      >
        {{ $t('schedule.button.templateFileDownload') }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingleCommonFile',
  props: {
    fileData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isDownloading: false
    }
  },
  methods: {
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
