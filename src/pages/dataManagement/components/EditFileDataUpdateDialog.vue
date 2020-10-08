<template>
  <div class="edit-file-data-update-dialog full-page-dialog">
    <div class="dialog-container">
      <choose-file-data-update-mode 
        v-if="step === 1"
        :step="1"
        :title="$t('fileDataUpdate.dataUpdateSetting')"
        :data-frame-info="dataFrameInfo"
        :process-text="processText"
        @next="chooseFile"
        @close="cancelFileUpdate"/>
      <file-upload
        v-if="step === 2"
        :step="step"
        :data-frame-info="dataFrameInfo"
        :file-count-limit="1"
        :title="$t('fileDataUpdate.dataUpdateSetting')"
        :process-text="processText"
        @next="nextStep"
        @close="cancelFileUpdate">
        <template v-slot:additionalButton>
          <button 
            class="btn btn-outline"
            @click="reChooseMode"
          >{{ $t('fileDataUpdate.reSetting') }}</button>
        </template>
      </file-upload>
      <file-upload-status
        v-if="step === 3"
        :step="step"
        :data-frame-name="dataFrameInfo.primaryAlias"
        :title="$t('fileDataUpdate.dataUpdateSetting')"
        :process-text="processText"
      >
        <template v-slot:button="slotProps">
          <button 
            :disabled="isProcessing"
            class="btn btn-outline"
            @click="cancelFileUpdate"
          >{{ $t('button.cancel') }}</button>
          <button 
            :disabled="isProcessing" 
            class="btn btn-outline"
            type="button"
            @click="reChooseMode"
          >{{ $t('button.chooseFileUpload') }}</button>
          <button 
            :disabled="slotProps.successList.length === 0 || isProcessing"
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
        </template>
      </file-upload-status>
      <confirm-page
        v-if="step === 4"
        :content="$t('fileDataUpdate.dataUpdatingReminding')"
        @next="uploadFinish"
      />
    </div>
  </div>
</template>

<script>
import { appendFile, reimportFile } from '@/API/File'
import UploadProcessBlock from './fileUpload/UploadProcessBlock'
import ChooseFileDataUpdateMode from './ChooseFileDataUpdateMode'
import FileUpload from './fileUpload/FileUpload'
import FileUploadStatus from './fileUpload/FileUploadStatus'
import ConfirmPage from './fileUpload/ConfirmPage'
import { mapState } from 'vuex'

export default {
 name: 'EditFileDataUploadDialog',
  components: {
		UploadProcessBlock,
		ChooseFileDataUpdateMode,
		FileUpload,
		FileUploadStatus,
		ConfirmPage
	},
	props: {
    dataFrameInfo: {
      type: Object,
      required: true
    }
  },
	data () {
		return {
			step: 1,
			updateMode: '',
			isProcessing: false,
			processText: [
        this.$t('fileDataUpdate.processStep1'),
        this.$t('fileDataUpdate.processStep2'),
        this.$t('fileDataUpdate.processStep3')
			],
		}
	},
	computed: {
		...mapState('dataSource', ['processingDataFrameList']),
		importedFileList () {
      return this.$store.state.dataManagement.importedFileList
    }
	},
	destroyed () {
		this.$store.commit('dataManagement/updateUploadFileList', [])
    this.$store.commit('dataManagement/clearCurrentUploadInfo')
    this.$store.commit('dataManagement/clearImportedTableList')
  },
	methods: {
		chooseFile (updateMode) {
			this.updateMode = updateMode
			this.nextStep()
		},
		reChooseMode () {
			this.$store.commit('dataManagement/updateUploadFileList', [])
			this.$store.commit('dataManagement/clearImportedTableList')
			this.prevStep()
		},
		cancelFileUpdate () {
			this.$emit('close')
		},
		nextStep () {
			this.step += 1
		},
		prevStep () {
      this.step -= 1
		},
		uploadFinish () {
			this.$store.commit('dataManagement/updateFileUploadSuccess', true)
			this.$emit('close')
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
							this.nextStep()
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
							this.nextStep()
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
.edit-file-data-update-dialog {

	.setting-block {
    position: relative;
    padding: 24px 14%;
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    margin-bottom: 12px;

    &__title {
      font-weight: 600;
      font-size: 18px;
      line-height: 1;
      margin-bottom: 16px;
    }

		.input-radio-group {
			display: inline-block;

			&:not(:last-of-type) {
				margin-right: 40px;
			}
			&:last-of-type {
				margin-right: 16px;
			}
  }

  }
}
</style>
