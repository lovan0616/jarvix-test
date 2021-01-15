<template>
  <div class="edit-feature-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('clustering.clusteringNumberSetting') }}
      </div>
      <div class="feature-block">
        <div class="block-title">{{ $t('clustering.clusteringNumber') }}</div>
        <div class="input-block">
          <default-select
            v-validate="`required`"
            v-model="tempAlgoConfig.clusteringCount"
            :option-list="clusteringOptionList"
            :placeholder="$t('editing.defaultOption')"
            :class="{'has-error': errors.has('timeScope')}"
            name="clusteringNumber"/>
        </div>
        <div 
          v-show="errors.has('clusteringNumber')"
          class="error-text"
        >{{ errors.first('clusteringNumber') }}</div>
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
          <span v-else>{{ $t('button.reAnalyze') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'ClusteringNumberSettingDialog',
  inject: ['$validator'],
  components: {
    DefaultSelect
  },
  data () {
    return {
      tempAlgoConfig: null,
      isProcessing: false
    }
  },
  computed: {
    ...mapState('dataSource', ['algoConfig']),
    clusteringOptionList () {
      // 設定數量介於 2-10 之間
      return [...Array(9).keys()].map(value => ({
        value: value + 2,
        name: value + 2
      }))
    }
  },
  mounted () {
    this.tempAlgoConfig = JSON.parse(JSON.stringify(this.algoConfig.clustering))
  },
  methods: {
    ...mapMutations('dataSource', ['setAlgoConfig']),
    reAnalyze () {
      this.$validator.validate('clusteringNumber')
        .then(isValid => {
          if (!isValid) return
          this.isProcessing = true

          if (this.tempAlgoConfig.clusteringCount === this.algoConfig.clustering.clusteringCount) return this.$emit('close')

          this.setAlgoConfig({ ...this.algoConfig, clustering: this.tempAlgoConfig })
          this.$emit('re-analyze', 'CLUSTERING')
        })
    }
  }
}
</script>
