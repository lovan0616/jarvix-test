<template>
  <div>
    <div
      v-if="isUploading"
      class="upload-process-block"
    >
      <spinner
        class="upload-process"
        size="20"
      />
      Loading...
    </div>
    <label
      v-else
      class="setting-file__item-upload-label link"
    >
      {{ $t('schedule.button.chooseFile') }}
      <input
        :accept="acceptFileTypes.join(',').toString()"
        :name="'file' + (index + 1)"
        type="file"
        class="setting-file__item-upload-input"
        hidden
        @change="uploadFile($event.target.files)"
      >
    </label>
  </div>
</template>
<script>
import { uploadOrder } from '@/schedule/API/Setting'
import { Message } from 'element-ui'
import { mapState } from 'vuex'

export default {
  name: 'OrderUpload',
  data () {
    return {
      isUploading: false,
      acceptFileTypes: [
        '.csv',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ]
    }
  },
  computed: {
    ...mapState('scheduleSetting', ['scheduleProjectId'])
  },
  methods: {
    uploadFile (file) {
      if (!file.length) return
      this.isUploading = true
      const formData = new FormData()
      formData.append('file', file[0])
      formData.append('projectId', this.scheduleProjectId)
      uploadOrder(formData)
        .then(() => {
          Message({
            message: this.$t('schedule.successMessage.uploadSuccessfully'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
        })
        .finally(() => { this.isUploading = false })
    }
  }
}
</script>
<style lang="scss" scoped>
.upload-process-block {
  display: flex;
  align-items: center;

  .upload-process {
    width: 24px;
    padding: 0;
    margin-right: 8px;
  }
}
</style>
