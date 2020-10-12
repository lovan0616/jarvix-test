<template>
  <div class="edit-file-data-update-dialog full-page-dialog">
    <div class="dialog-container">
      <choose-file-data-update-mode 
        v-if="step === 1"
        :step="1"
        :title="$t('fileDataUpdate.dataUpdateSetting')"
        :data-frame-info="dataFrameInfo"
        :process-text="processText"
        @next="chooseMode"
        @close="cancelFileUpdate"/>
      <data-update-file-upload
        v-if="step === 2"
        :step="step"
        :data-frame-info="dataFrameInfo"
        :process-text="processText"
        @prev="prevStep"
        @next="nextStep"
        @close="cancelFileUpdate"/>
      <data-update-file-upload-status
        v-if="step === 3"
        :step="step"
        :data-frame-info="dataFrameInfo"
        :process-text="processText"
        :update-mode="updateMode"
        @prev="prevStep"
        @next="nextStep"
        @close="cancelFileUpdate"
      />
      <confirm-page
        v-if="step === 4"
        :content="$t('fileDataUpdate.dataUpdatingReminding')"
        @next="uploadFinish"
      />
    </div>
  </div>
</template>

<script>
import ChooseFileDataUpdateMode from './dataUpdate/ChooseFileDataUpdateMode'
import DataUpdateFileUpload from './dataUpdate/DataUpdateFileUpload'
import DataUpdateFileUploadStatus from './dataUpdate/DataUpdateFileUploadStatus'
import ConfirmPage from './fileUpload/ConfirmPage'

export default {
 name: 'EditFileDataUploadDialog',
  components: {
		ChooseFileDataUpdateMode,
		DataUpdateFileUpload,
		DataUpdateFileUploadStatus,
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
	destroyed () {
		this.$store.commit('dataManagement/updateUploadFileList', [])
    this.$store.commit('dataManagement/clearCurrentUploadInfo')
    this.$store.commit('dataManagement/clearImportedTableList')
  },
	methods: {
		chooseMode (updateMode) {
			this.updateMode = updateMode
			this.nextStep()
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
