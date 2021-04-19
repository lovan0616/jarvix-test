<template>
  <div class="input-field">
    <label class="input-field__label">{{ outputInfo.modelColumnName }}</label>
    <div class="input-field__content-container">
      <div class="input-field__radio-group-container">
        <div
          v-for="(option, index) in expectTypeList"
          :key="index"
          class="input-radio-group"
        >
          <input
            :id="inputId + option.type"
            v-model="outputInfo.expectType"
            :value="option.type"
            :name="inputId + outputInfo.expectType"
            class="input-radio"
            type="radio"
          >
          <label
            :for="inputId + option.type"
            class="input-radio-label"
          >
            {{ option.name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'ParametersOptimizedSimulatorOutput',
  props: {
    outputInfo: {
      type: Object,
      required: true
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      inputId: uuidv4(),
      expectTypeList: [
        { type: 'MAX', name: '望大' },
        { type: 'MIN', name: '望小' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.input-field {
  display: flex;
  &__label {
    padding-top: 10px;
    color: #AAAAAA;
    font-weight: 600;
    font-size: 14px;
    width: 80px;
  }

  &__content-container {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    margin-left: 8px;
  }

  .input-radio-group:not(:last-of-type) {
    margin-right: 12px;
  }
  
  .el-input {
    width: 100%;
  }

  /deep/ .el-input__inner {
    padding-left: 0 !important; // 為了蓋掉 element-ui 樣式
    border-bottom: 1px solid #FFFFFF;
    border-radius: 0;
    background: transparent;
    font-size: 16px;
    &::placeholder {
      color: #AAAAAA;
      font-weight: normal;
      font-size: 16px;
    } 
  }

  /deep/ .input-verify .input-verify-text {
    margin-bottom: 0;
    color: #ffffff;
  }

  /deep/ .input-error.error-text {
    bottom: -17px;
  }

  /deep/ .sy-multi-select.theme-dark {
    width: 100%;
    border-bottom: 1px solid #fff;
    .el-tag {
      border-color: #2AD2E2;
      color: #2AD2E2;
    }

    .el-tag__close.el-icon-close {
      background-color: #2AD2E2;
    }
  }
}
</style>