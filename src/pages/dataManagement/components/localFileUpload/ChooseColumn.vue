<template>
  <div class="choose-column">
    <div class="dialog-title">
      {{ $t('editing.newData') }}
    </div>
    <upload-process-block
      :step="3"
    />
    <div class="info-block">
      <div>{{ $t('editing.dataFrameContent') }}</div>
      <div>{{ $t('editing.dataSourceName') }}：{{ currentUploadInfo.name }}</div>
    </div>
    <div class="dialog-body">
      <EtlChooseColumn />
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button
          class="btn btn-outline"
          @click="cancelFileUpload"
        >
          {{ $t('button.cancel') }}
        </button>
        <button
          class="btn btn-default"
          @click="nextStep"
        >
          {{ $t('button.nextStep') }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import EtlChooseColumn from '../etl/EtlChooseColumn'
import UploadProcessBlock from './UploadProcessBlock'

export default {
  name: 'ChooseColumn',
  components: {
    UploadProcessBlock,
    EtlChooseColumn
  },
  computed: {
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    }
  },
  methods: {
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    nextStep () {
      this.$emit('next')
    }
  }
}
</script>
<style lang="scss" scoped>
.choose-column {
  .info-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .dialog-body {
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    padding: 24px;
    margin-bottom: 16px;
  }
}
</style>
