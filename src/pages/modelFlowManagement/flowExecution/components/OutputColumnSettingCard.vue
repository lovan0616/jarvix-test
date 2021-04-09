<template>
  <div class="card">
    <div class="input-field">
      <label class="input-field__label">{{ $t('modelFlow.upload.modelOutputArgs') }}</label>
      <div class="input-field__text">
        {{ columnInfo.modelColumnName + ` (${columnInfo.columnStatsType})` }}
      </div>
    </div>
    <div class="input-field">
      <label class="input-field__label">{{ $t('modelFlow.upload.outputColumnName') }}</label>
      <div class="input-field__input">
        <svg-icon 
          icon-class="go-right" 
          class="icon"/>
        <input-verify
          v-validate="'required'"
          v-model.trim="columnInfo.originalName"
          :placeholder="$t('editing.pleaseEnterName')"
          :name="'input' + columnInfo.id"
          type="text"
        />
        <div 
          v-show="errors.has('input' + columnInfo.id)"
          class="error-text"
        >{{ errors.first('input' + columnInfo.id) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import InputVerify from '@/components/InputVerify'

export default {
  name: 'OutputColumnSettingCard',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputVerify
  },
  props: {
    columnInfo: {
      type: Object,
      default: () => ({})
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  padding: 18px;
  border-radius: 8px;
  background-color: rgba(72, 84, 84, .95);
  margin-bottom: 15px;
  position: relative;
  display: flex;
  align-items: center;

  /deep/ .input-verify .input-verify-text {
    margin-bottom: 0;
  }

  /deep/ .input-verify .input-error {
    position: absolute;
    bottom: 0;
    top: 100%;
  }
}
</style>