<template>
  <div class="card">
    <div class="input-field">
      <label class="input-field__label">{{ $t('modelFlow.upload.modelInputArgs') }}</label>
      <div class="input-field__text">
        {{ columnInfo.modelColumnName + ` (${columnInfo.columnStatsType})` }}
      </div>
    </div>
    <div class="input-field">
      <label class="input-field__label ">{{ $t('modelFlow.upload.referencedColumn') }}</label>
      <div class="input-field__input">
        <svg-icon 
          icon-class="go-right" 
          class="icon"/>
        <default-select 
          v-validate="'required'"
          :option-list="sameStatsTypeDataColumnOptionList"
          :placeholder="placeholder"
          :is-disabled="isProcessing"
          v-model="columnInfo.columnId"
          :name="'select' + columnInfo.id"
          filterable
          class="input-field__select"
        />
        <div 
          v-show="errors.has('select' + columnInfo.id)"
          class="error-text"
        >{{ errors.first('select' + columnInfo.id) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import InputVerify from '@/components/InputVerify'

export default {
  name: 'InputColumnSettingCard',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputVerify
  },
  props: {
    dataColumnOptionList: {
      type: Array,
      default: () => ([])
    },
    columnInfo: {
      type: Object,
      default: () => ({})
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    }
  },
  computed: {
    sameStatsTypeDataColumnOptionList () {
      return this.dataColumnOptionList.filter(column => column.statsType === this.columnInfo.columnStatsType)
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