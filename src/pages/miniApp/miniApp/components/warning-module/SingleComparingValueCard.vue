<template>
  <div class="single-comparing-value-card">
    <div class="setting-block">
      <div class="input-field">
        <default-select
          v-validate="'required'"
          v-model="comparingSet.comparisonOperator"
          :option-list="comparisonOperatorOptionList"
          :placeholder="$t('alert.chooseComparisionOperator')"
          name="comparingOperator"
          class="input-field__select"
        />
        <div 
          v-show="errors.has('comparingOperator')"
          class="error-text"
        >{{ errors.first('comparingOperator') }}</div>
      </div>
      <div class="input-field">
        <input-block
          v-validate="'required'"
          v-model="comparingSet.value"
          :placeholder="$t('alert.value')"
          name="comparingValue"
          type="number"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import InputBlock from '@/components/InputBlock'

export default {
  name: 'SingleComparingValueCard',
  inject: ['$validator'],
  components: {
    DefaultSelect,
    InputBlock
  },
  props: {
    comparisonOperatorOptionList: {
      type: Array,
      default: () => []
    },
    comparingSet: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
.single-comparing-value-card {
  background: rgba(72, 84, 84, 0.95);
  border-radius: 8px;
  padding: 8px 20px;
  margin-bottom: 12px;
  position: relative;

  .setting-block {
    display: flex;
    height: 54px;
    .input-block {
      margin-left: 16px;
    }
  }
  .delete-btn {
    position: absolute;
    top: 8px;
    right: 12px;
    cursor: pointer;
  }
}
</style>