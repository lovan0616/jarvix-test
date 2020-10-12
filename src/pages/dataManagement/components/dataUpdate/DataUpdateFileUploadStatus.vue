<template>
  <div class="file-upload-finished">
    <div class="dialog-title">
      {{ $t('fileDataUpdate.dataUpdateSetting') }}
    </div>
    <upload-process-block
      :step="step"
      :process-text="processText"
    />
    <div class="dialog-body">
      <file-list-block
        v-if="successList.length > 0"
        :title="$t('editing.uploaded')"
        :file-list="successList"
      >
        <div 
          slot="fileListTitle" 
          class="uploaded-data-info">
          {{ $t('editing.dataFrame') }}: {{ dataFrameInfo.primaryAlias }}
        </div>
      </file-list-block>
      <file-upload-status />
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          :disabled="isProcessing"
          class="btn btn-outline"
          @click="cancelFileUpdate"
        >{{ $t('button.cancel') }}</button>
        <button 
          :disabled="isProcessing" 
          class="btn btn-outline"
          type="button"
          @click="chooseFileUpload"
        >{{ $t('button.chooseFileUpload') }}</button>
        <button 
          :disabled="successList.length === 0 || isProcessing"
          class="btn btn-default"
          @click="build"
        >
          <span v-if="isProcessing">
            <svg-icon 
              v-if="isProcessing" 
              icon-class="spinner"/>
            {{ $t('button.processing') }}
          </span>
          <span v-else>{{ $t('fileDataUpdate.build') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { appendFile, reimportFile } from '@/API/File'
import { uploadStatus } from '@/utils/general'
import { mapState } from 'vuex'
import FileListBlock from '../fileUpload/FileListBlock'
import FileUploadStatus from '../fileUpload/FileUploadStatus'
import UploadProcessBlock from '../fileUpload/UploadProcessBlock'

export default {
  name: 'DataUpdateFileUploadStatus',
  components: {
    FileListBlock,
    FileUploadStatus,
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
    },
    updateMode: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isProcessing: false
    }
  },
  computed: {
    ...mapState('dataManagement', ['uploadFileList']),
    successList () {
      return this.uploadFileList.filter(element => {
        return element.status === uploadStatus.success
      })
    },
    importedFileList () {
      return this.$store.state.dataManagement.importedFileList
    }
  },
  methods: {
    chooseFileUpload () {
      this.$store.commit('dataManagement/updateUploadFileList', [])
			this.$store.commit('dataManagement/clearImportedTableList')
      this.$emit("prev")
    },
    cancelFileUpdate () {
      this.$emit("close")
    },
		build () {
			this.isProcessing = true
			const fileId = this.importedFileList[0].id
			switch(this.updateMode) {
				case 'append':
					appendFile(fileId, this.dataFrameInfo.id)
						.then (() => {
							this.$store.commit('dataSource/setProcessingDataFrameList', {
								dataSourceId: this.$route.params.id,
								dataFrameId: this.dataFrameInfo.id,
								primaryAlias: this.dataFrameInfo.primaryAlias,
							})
							this.$emit('next')
						})
						.catch(() => {})
						.finally(() => {
							this.isProcessing = false
						})
					break
				case 'reimport':
					reimportFile(fileId, this.dataFrameInfo.id)
						.then (() => {
							this.$store.commit('dataSource/setProcessingDataFrameList', {
								dataSourceId: this.$route.params.id,
								dataFrameId: this.dataFrameInfo.id,
								primaryAlias: this.dataFrameInfo.primaryAlias,
							})
							this.$emit('next')
						})
						.catch(() => {})
						.finally(() => {
							this.isProcessing = false
						})
					break
			}
		}
  }
}
</script>
<style lang="scss" scoped>
.file-upload-finished {
  .dialog-title {
    margin-bottom: 32px;
  }

  .uploaded-data-info {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
  }
}
</style>
