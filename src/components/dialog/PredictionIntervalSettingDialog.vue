<template>
  <div class="edit-feature-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('prediction.predictionIntervalSetting') }}
      </div>
      <div class="feature-block">
        <div class="block-title">
          {{ $t('prediction.predictionIntervalLength') }}
          <span class="block-title__description"> ({{ $t('message.numericShouldBeBetween', {min: 1, max: 50}) }})</span>
        </div>
        <div class="input-block">
          <input-block
            v-validate="'required|numeric|between:1,50'"
            :placeholder="$t('editing.numericOnly')"
            v-model="tempAlgoConfig.predictionIntervalLength"
            name="predictionIntervalLength"
          />
        </div>
      </div>
      <div class="button-block">
        <button
          :disabled="isProcessing"
          class="btn btn-outline"
          @click="$emit('close')"
        >
          {{ $t('button.cancel') }}
        </button>
        <button
          :disabled="isProcessing"
          class="btn btn-default"
          @click="reAnalyze"
        >
          <span v-if="isProcessing"><svg-icon icon-class="spinner" />{{ $t('button.processing') }}</span>
          <span v-else>{{ $t('prediction.rePredict') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import InputBlock from '@/components/InputBlock'

export default {
  name: 'PredictionIntervalSettingDialog',
  inject: ['$validator'],
  components: {
    InputBlock
  },
  data () {
    return {
      tempAlgoConfig: null,
      isProcessing: false
    }
  },
  computed: {
    ...mapState('dataSource', ['algoConfig'])
  },
  mounted () {
    this.tempAlgoConfig = JSON.parse(JSON.stringify(this.algoConfig.prediction))
  },
  methods: {
    ...mapMutations('dataSource', ['setAlgoConfig']),
    reAnalyze () {
      this.$validator.validate('predictionIntervalLength')
        .then(isValid => {
          if (!isValid) return
          this.isProcessing = true

          if (this.tempAlgoConfig.predictionIntervalLength === this.algoConfig.prediction.predictionIntervalLength) return this.$emit('close')

          this.setAlgoConfig({ ...this.algoConfig, prediction: this.tempAlgoConfig })
          this.$emit('re-analyze', 'PREDICTION')
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
