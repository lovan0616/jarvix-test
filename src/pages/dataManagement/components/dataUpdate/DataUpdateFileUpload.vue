<template>
  <div class="data-update-file-upload">
    <div class="dialog-title">
      {{ $t('fileDataUpdate.dataUpdateSetting') }}
    </div>
    <upload-process-block
      :step="step"
      :process-text="processText"
    />
    <div 
      class="dialog-sub-title">
      {{ $t('editing.dataFrame') + ': ' + dataFrameInfo.primaryAlias }}
    </div>
    <file-upload
      :file-count-limit="1"
      @next="$emit('next')"
      @close="$emit('close')">
      <template v-slot:additionalButton>
        <button 
          class="btn btn-outline"
          @click="reChooseMode"
        >{{ $t('fileDataUpdate.reSetting') }}</button>
      </template>
    </file-upload>
  </div>
</template>
<script>
import FileUpload from '../fileUpload/FileUpload'
import FileListBlock from '../fileUpload/FileListBlock'
import UploadProcessBlock from '../fileUpload/UploadProcessBlock'

export default {
  name: 'DataUpdateFileUpload',
  components: {
    FileUpload,
    FileListBlock,
    UploadProcessBlock
  },
  props: {
    dataFrameInfo: {
      type: Object,
      default: null
    },
    step: {
      type: Number,
      required: true
    },
    processText: {
      type: Array,
      required: true
    }
  },
  methods: {
    reChooseMode () {
			this.$store.commit('dataManagement/updateUploadFileList', [])
			this.$store.commit('dataManagement/clearImportedTableList')
			this.$emit('prev')
		},
  }
}
</script>
<style lang="scss" scoped>
.data-update-file-upload {

  .dialog {
    &-sub-title {
      margin-bottom: 12px;
      font-size: 14px;
			text-align: right;
    }
  }
}
</style>
