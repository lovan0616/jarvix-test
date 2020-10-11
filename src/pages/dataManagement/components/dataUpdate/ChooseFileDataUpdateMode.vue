<template>
  <div>
    <div class="dialog-title">
      {{ title }}
    </div>
    <upload-process-block
      :step="step"
      :process-text="processText"
    />
    <div 
      class="dialog-sub-title">
      {{ $t('editing.dataFrame') }}: {{ dataFrameInfo.primaryAlias }}
    </div>
    <div class="setting-block">
      <div class="setting-block__title">{{ $t('fileDataUpdate.updateMode') }}</div>
      <div
        v-for="status in updateStatusList"
        :key="status.type"
        class="input-radio-group"
      >
        <input
          :id="status.type"
          :checked="status.type === updateMode"
          :value="status.type"
          name="status"
          class="input-radio"
          type="radio"
          @change="updateMode = status.type"
        >
        <label
          :for="status.type"
          class="input-radio-label"
        >{{ status.name }}</label>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button 
          class="btn btn-outline"
          @click="cancelFileUpdate"
        >{{ $t('button.cancel') }}</button>
        <button 
          class="btn btn-primary"
          @click="chooseFile"
        >{{ $t('fileDataUpdate.chooseFile') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import UploadProcessBlock from '../fileUpload/UploadProcessBlock'

export default {
 name: 'ChooseFileDataUpdateMode',
  components: {
		UploadProcessBlock
	},
	props: {
    dataFrameInfo: {
      type: Object,
      required: true
    },
    step: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    processText: {
      type: Array,
      required: true
    }
  },
	data () {
		return {
			updateMode: 'append',
			updateStatusList: [
				{
          type: 'append',
          name: this.$t('fileDataUpdate.append')
        },
        {
          type: 'reimport',
          name: this.$t('fileDataUpdate.reimport')
        }
			]
		}
	},
	methods: {
		chooseFile () {
			this.$emit('next', this.updateMode)
		},
		cancelFileUpdate () {
			this.$emit('close')
		}
	}
}
</script>

<style lang="scss" scoped>
.edit-file-data-update-dialog {
 .dialog {
    &-sub-title {
      margin-bottom: 12px;
      font-size: 14px;
			text-align: right;
    }
  }

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
