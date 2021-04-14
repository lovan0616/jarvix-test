<template>
  <div class="content-setting-dialog">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="3"
    />
    <div class="dialog-body">
      <div class="setting-block">
        <div class="setting-block__title">
          {{ $t('modelFlow.upload.updatedTriggerMode') }}
        </div>
        <div
          v-for="status in updateStatusList"
          :key="status.type"
          class="input-radio-group"
        >
          <input
            v-model="updateMode"
            :id="status.type"
            :value="status.type"
            name="status"
            class="input-radio"
            type="radio"
          >
          <label
            :for="status.type"
            class="input-radio-label"
          >{{ status.name }}</label>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button
          :disabled="isProcessing"
          class="btn btn-outline"
          @click="cancel"
        >{{ $t('button.cancel') }}</button>
        <button 
          :disabled="isProcessing"
          class="btn btn-default"
          @click="build"
        >
          <span v-if="isProcessing">
            <svg-icon 
              v-if="isProcessing" 
              icon-class="spinner"/>
            {{ $t('button.processing') }}
          </span>
          <span v-else>{{ $t('button.build') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import UploadProcessBlock from './components/UploadProcessBlock'
import { createModelFlow } from '@/API/ModelFlow'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'OtherSetting',
  components: {
    UploadProcessBlock
  },
  data () {
    return {
      isProcessing: false,
      updateMode: 'MANUAL',
      updateStatusList: [
				{
          type: 'MANUAL',
          name: this.$t('modelFlow.upload.NoAutomaticUpdate')
        },
        {
          type: 'AUTOMATIC',
          name: this.$t('modelFlow.upload.updatedByFrame')
        }
			]
    }
  },
  computed: {
    ...mapState('modelFlowManagement', ['currentUploadFlowInfo']),
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    ...mapMutations('modelFlowManagement', ['updateFlowUploadSuccess', 'updateShowCreateFlowDialog']),
    fetchData () {
    },
    cancel () {
      this.updateShowCreateFlowDialog(false)
    },
    build () {
      this.isProcessing = true
      createModelFlow({
        ...this.currentUploadFlowInfo,
        triggerType: this.updateMode
      }).then(() => {
        this.updateFlowUploadSuccess(true)
        this.updateShowCreateFlowDialog(false)
      }).catch(() => { this.isProcessing = false })
    }
  }
}
</script>
<style lang="scss" scoped>
.content-setting-dialog {
  .dialog-title {
    margin-bottom: 16px;
  }

  .setting-block {
    background: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    padding: 24px;
    &:not(:last-of-type) {
      margin-bottom: 16px;
    }

    &__title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 16px;
    }
  }
}
</style>
