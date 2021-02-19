<template>
  <div class="edit-feature-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('editing.histogramBinSetting') }}
      </div>
      <div class="feature-block">
        <div class="block-title">
          {{ $t('editing.histogramBinSize') }}
        </div>
        <div class="input-block">
          <input-block
            v-validate="'required|decimal|min_value:0'"
            :placeholder="$t('editing.numericOnly')"
            v-model="binSize"
            name="histogramBinSize"
          />
        </div>
      </div>
      <div class="button-block">
        <button
          :disabled="isProcessing"
          class="btn btn-outline"
          @click="$emit('close')"
        >{{ $t('button.cancel') }}</button>
        <button
          :disabled="isProcessing"
          class="btn btn-default"
          @click="reAnalyze"
        >
          <span v-if="isProcessing"><svg-icon icon-class="spinner"/>{{ $t('button.processing') }}</span>
          <span v-else>{{ $t('button.update') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import InputBlock from '@/components/InputBlock'

export default {
  name: 'HistogramBinSettingDialog',
  inject: ['$validator'],
  components: {
    InputBlock
  },
  data () {
    return {
      isProcessing: false,
      binSize: ''
    }
  },
  methods: {
    reAnalyze () {
      this.$validator.validate('histogramBinSize')
        .then(isValid => {
          if (!isValid) return
          this.isProcessing = true
          if (this.binSize === '') return this.$emit('close')
          this.$emit('re-analyze', 'OVERVIEW', this.binSize)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.input-block {
  width: 200px;
}
</style>
