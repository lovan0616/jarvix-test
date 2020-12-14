<template>
  <div class="edit-feature-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('prediction.predictionIntervalSetting') }}
      </div>
      <div class="feature-block">
        <div class="block-title">{{ $t('prediction.predictionIntervalLength') }}</div>
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
        >{{ $t('button.cancel') }}</button>
        <button
          :disabled="isProcessing"
          class="btn btn-default"
          @click="rePredict"
        >
          <span v-if="isProcessing"><svg-icon icon-class="spinner"/>{{ $t('button.processing') }}</span>
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
  props: {
    resultId: {
      type: Number,
      default: null
    }
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
    this.tempAlgoConfig = JSON.parse(JSON.stringify(this.algoConfig))
  },
  methods: {
    ...mapMutations('dataSource', ['setAlgoConfig']),
    rePredict () {
      this.$validator.validate('predictionIntervalLength')
        .then(isValid => {
          if (!isValid) return
          this.isProcessing = true

          if (this.tempAlgoConfig.predictionIntervalLength === this.algoConfig.predictionIntervalLength) return this.$emit('close')

          this.setAlgoConfig(this.tempAlgoConfig)
          this.$emit('re-predict')
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
