<template>
  <div class="single-comparing-value-card">
    <div class="setting-block">
      <input
        :id="comparingSet.id"
        :checked="comparingSet.isSelected"
        :class="{ 'input-radio--disabled': !isShowRadio }"
        class="input-radio"
        type="radio"
        name="comparing-condition"
        @change="$emit('selected')"
      >
      <label
        :for="comparingSet.id"
        class="input-radio-label"
      >
        <div 
          v-if="comparingSet.isDisabled" 
          class="setting-value">
          {{ comparisonOperatorName + comparingSet.value }}
        </div>
        <template v-else>
          <div class="input-field">
            <default-select
              :v-validate="comparingSet.isSelected && 'required'"
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
              :v-validate="comparingSet.isSelected && 'required'"
              v-model="comparingSet.value"
              :placeholder="$t('alert.value')"
              name="comparingValue"
              type="number"
            />
          </div>
        </template>
      </label>
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
    },
    isShowRadio: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    comparisonOperatorName () {
      if (!this.comparingSet.comparisonOperator) return
      return this.comparisonOperatorOptionList.find(option => {
        return option.value === this.comparingSet.comparisonOperator
      }).name
    }
  },
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
    height: 54px;
    .input-block {
      margin-left: 16px;
    }
    .setting-value {
      line-height: 49px;
      height: 65px;
    }
  }
  .delete-btn {
    position: absolute;
    top: 8px;
    right: 12px;
    cursor: pointer;
  }

  .input-radio--disabled {
    &+.input-radio-label {
      padding: 0;
      &:before,
      &:after { display: none; }
    }
  }

  .input-radio-label {
    display: flex;
    &:before,
    &:after { top: 35%; }
  }
}
</style>