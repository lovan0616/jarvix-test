<template>
  <div class="etl-setting">
    <div class="dialog-title">{{ $t('editing.newData') }}</div>
    <upload-process-block
      :step="3"
    ></upload-process-block>
    <div class="info-block">
      <div>{{ $t('editing.dataFrameContent') }}</div>
      <div>{{ $t('editing.dataSourceName') }}：{{ currentUploadInfo.name }}</div>
    </div>
    <div class="dialog-body">
      <!-- Column Choosing Component -->
      <etl-choose-column
        v-if="step === 'choose-column'"
        @advance="step = 'column-setting'"
      >
      </etl-choose-column>
      <!-- Column Setting Component -->
      <etl-column-setting
        v-else
        @back="step = 'choose-column'"
      >
      </etl-column-setting>
    </div>
    <div class="dialog-footer" v-if="step === 'choose-column'">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          @click="prev"
        >{{ $t('button.prevStep') }}</button>
        <button class="btn btn-default"
          @click="next"
        >{{ $t('button.buildData') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import UploadProcessBlock from './UploadProcessBlock'
import EtlChooseColumn from '../etl/EtlChooseColumn'
import EtlColumnSetting from '../etl/EtlColumnSetting'

export default {
  name: 'EtlSetting',
  components: {
    UploadProcessBlock,
    EtlChooseColumn,
    EtlColumnSetting
  },
  data () {
    return {
      step: 'choose-column'
    }
  },
  methods: {
    prev () {
      this.$emit('prev')
    },
    next () {
      this.$emit('next')
    }
  },
  computed: {
    currentUploadInfo () {
      return this.$store.state.dataManagement.currentUploadInfo
    }
  }
}
</script>

<style lang="scss" scoped>
.etl-setting {
  .info-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
  }
}
</style>
