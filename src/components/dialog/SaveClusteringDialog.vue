<template>
  <div class="full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('feature.createFeature') }}
      </div>
      <div class="feature-block">
        <div class="block-title">{{ $t('editing.tableName') }}</div>
        {{ dataFrameAlias }}
      </div>
      <div class="feature-block">
        <div class="block-title">{{ $t('feature.featureColumnName') }}（{{ $t('editing.isRequired') }}）</div>
        <div class="input-block name">
          <input-block
            v-validate="`required|max:${max}`"
            v-model="columnPrimaryAlias"
            name="columnPrimaryAlias"
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
          @click="save"
        >
          <span v-if="isProcessing"><svg-icon icon-class="spinner"/>{{ $t('button.processing') }}</span>
          <span v-else>{{ $t('button.create') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { saveClusteringColumn } from '@/API/DataSource'
import { Message } from 'element-ui'
import InputBlock from '@/components/InputBlock'

export default {
  name: 'SaveClusteringDialog',
  inject: ['$validator'],
  components: {
    InputBlock
  },
  props: {
    resultId: {
      type: Number,
      default: null
    },
    dataFrameAlias: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      columnPrimaryAlias: '',
      isProcessing: false
    }
  },
  computed: {
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  methods: {
    save () {
      this.$validator.validate('columnPrimaryAlias')
        .then(isValid => {
          if (!isValid) return

          this.isProcessing = true
          saveClusteringColumn({
            primaryAlias: this.columnPrimaryAlias,
            askResultId: this.resultId
          }).then(() => {
              Message({
                message: this.$t('message.saveSuccess'),
                type: 'success',
                duration: 3 * 1000,
                showClose: true
              })
            })
            .catch(() => {})
            .finally(() => {
              this.$emit('close')
              this.isProcessing = false
            })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.full-page-dialog {
  .feature-block {
    padding: 24px;
    background-color: rgba(50, 58, 58, 0.95);
    border-radius: 5px;
    margin-bottom: 12px;

    &:last-child {
      margin-bottom: 16px;
    }

    .block-title {
      font-weight: 600;
      font-size: 18px;
      line-height: 1;
      margin-bottom: 10px;
    }

    & >>> .input-block {

      &.name {
        width: 300px;
      }

      &.has-error {
        .data-frame-select {
          border-color: $theme-color-danger;
        }

        .error-text {
          bottom: -10px;
        }
      }
    }
  }
  .button-block {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 64px;

    .btn:not(:last-child) {
      margin-right: 20px;
    }
  }
}
</style>