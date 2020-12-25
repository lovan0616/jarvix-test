<template>
  <div class="card">
    <div
      v-if="columnList.length > 1"
      :class="{ 'disabled': isProcessing || isLoading }"
      class="card__delete-icon"
      @click="removeColumn">
      <svg-icon 
        icon-class="delete" 
        class="icon"/>
    </div>
    <div class="input-field">
      <label class="input-field__label">{{ $t('script.columnDataType') }}</label>
      <div class="input-field__input">
        <default-select 
          v-validate="'required'"
          :option-list="dataTypeOptionList"
          :placeholder="$t('batchLoad.chooseColumn')"
          :is-disabled="isProcessing || isLoading"
          v-model="columnInfo.dataType"
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
    <div class="input-field">
      <label class="input-field__label">{{ $t('script.columnDataName') }}</label>
      <input-verify
        v-validate="`required`"
        v-model.trim="columnInfo.dataColumnName"
        :placeholder="$t('editing.inputCategoryName')"
        :name="'input' + columnInfo.id"
        type="text"
      />
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
    columnList: {
      type: Array,
      default: () => ([])
    },
    dataTypeOptionList: {
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
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    removeColumn () {
      if (this.isProcessing || this.isLoading) return
      this.$emit('remove', this.columnInfo.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(72, 84, 84, .95);
  margin-bottom: 15px;
  position: relative;
  display: flex;

  &__delete-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;

    &.disabled {
      opacity: .7;
      cursor: not-allowed;
    }
  }

  .input-field {
    &:not(:last-of-type) {
      margin-right: 16px;
    }
  }

  /deep/ .input-verify .input-verify-text {
    margin-bottom: 0;
  }

  /deep/ .input-verify .input-error {
    bottom: 0;
    top: 100%;
  }
}
</style>