<template>
  <div class="card">
    <div class="input-field">
      <label class="input-field__label">{{ $t('modelFlow.upload.modelInputArg') }}</label>
      <div class="input-field__text">
        {{ columnInfo.modelColumnName + ` (${columnInfo.statsType})` }}
      </div>
    </div>
    <svg-icon 
      icon-class="sort" 
      class="card__sort-icon"/>
    <div class="input-field">
      <label class="input-field__label">{{ $t('model.upload.columnDataType') }}</label>
      <div class="input-field__input">
        <default-select 
          v-validate="'required'"
          :option-list="dataColumnOptionList"
          :placeholder="$t('batchLoad.chooseColumn')"
          :is-disabled="isProcessing"
          v-model="columnInfo.statsType"
          :name="'select' + columnInfo.id"
          filterable
          class="input-field__select"
          @change="$emit('updateDataColumn', $event)"
        />
        <div 
          v-show="errors.has('select' + columnInfo.id)"
          class="error-text"
        >{{ errors.first('select' + columnInfo.id) }}</div>
      </div>
    </div>
    <!-- <div class="input-field">
      <label class="input-field__label">{{ $t('model.upload.columnDataName') }}</label>
      <input-verify
        v-validate="'required'"
        v-model.trim="columnInfo.modelColumnName"
        :placeholder="$t('editing.pleaseEnterName')"
        :name="'input' + columnInfo.id"
        type="text"
      />
    </div> -->
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
  cursor: move;

  &__sort-icon {
    margin-right: 24px;
    font-size: 32px;
    color: #8F9595;
  }

  &__

  .input-field {
    &:not(:last-of-type) {
      margin-right: 16px;
    }

    .error-text {
      position: absolute;
    }
  }

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