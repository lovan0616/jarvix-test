<template>
  <!--CATEGORY or BOOLEAN-->
  <div 
    v-if="inputData.statsType === 'CATEGORY'" 
    class="input-field">
    <label class="input-field__label">{{ inputData.columnName }}</label>
    <div class="input-field__content-container">
      <div class="input-field__radio-group-container">
        <div
          v-for="(option, index) in categoryOptionList"
          :key="index"
          class="input-radio-group"
        >
          <input
            :id="inputId + option.type"
            v-model="columnInfo.userInput.type"
            :name="inputId + inputData.columnName"
            :value="option.type"
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
      <div
        v-if="columnInfo.userInput.type !== 'ALL'"
        class="input-field__input"
      >
        <default-multi-select
          v-validate="'required'"
          :value="columnInfo.userInput.selectedList"
          :option-list="inputData.valueList"
          :placeholder="$t('miniApp.pleaseSelect')"
          :is-disabled="isProcessing"
          :name="'category' + inputData.columnName"
          filterable
          multiple
          class="input-field__multi-select"
          @input="columnInfo.userInput.selectedList = $event"
        />
        <div 
          v-show="errors.has('category' + inputData.columnName)"
          class="error-text"
        >{{ errors.first('category' + inputData.columnName) }}</div>
      </div>
    </div>
  </div>
  <!--NUMERIC-->
  <div 
    v-else-if="inputData.statsType === 'NUMERIC'" 
    class="input-field">
    <label class="input-field__label">{{ inputData.columnName }}</label>
    <div class="input-field__content-container">
      <div class="input-field__radio-group-container">
        <div
          v-for="(option, index) in numericOptionList"
          :key="index"
          class="input-radio-group"
        >
          <input
            :id="inputId + option.type"
            v-model="columnInfo.userInput.type"
            :name="inputId + inputData.columnName"
            :value="option.type"
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
      <div class="input-field__input-group-container">
        <div class="input-field__input">
          <input-verify
            v-validate="'required'"
            v-model.number="columnInfo.userInput.min"
            :is-disabled="isProcessing"
            :type="'Number'"
            :name="'input-min-' + inputData.columnName"
          />
        </div>
        <template v-if="columnInfo.userInput.type === 'RANGE'">
          <div class="input-field__divider">
            -
          </div>
          <div class="input-field__input">
            <input-verify
              v-validate="'required'"
              v-model.number="columnInfo.userInput.max"
              :is-disabled="isProcessing"
              :type="'Number'"
              :name="'input-max-' + inputData.columnName"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { dataValueSearch } from '@/API/DataSource'
import { searchColumnDefaultValue, searchNumericColumnValueRange } from '@/API/Model'
import DefaultSelect from '@/components/select/DefaultSelect'
import DefaultMultiSelect from '@/components/select/DefaultMultiSelect'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import InputVerify from '@/components/InputVerify'
import { v4 as uuidv4 } from 'uuid'

export default {
  inject: ['$validator'],
  name: 'ParametersOptimizedSimulatorInput',
  components: {
    DefaultSelect,
    DefaultMultiSelect,
    EmptyInfoBlock,
    InputVerify
  },
  props: {
    columnInfo: {
      type: Object,
      required: true
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    modelId: {
      type: Number,
      required: true
    },
    restrictions: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      inputData: {},
      inputId: uuidv4(),
      numericOptionList: [
        { type: 'RANGE', name: '範圍' },
        { type: 'FIXED', name: '定值' }
      ],
      categoryOptionList: [
        { type: 'ALL', name: '全部' },
        { type: 'USE_ITEMS', name: '自訂使用項目' },
        { type: 'REMOVE_ITEMS', name: '自訂剔除項目' }
      ]
    }
  },
  computed: {
    getNumericTitle () {
      if (!this.inputData.statsType || this.inputData.statsType !== 'NUMERIC') return
      return this.inputData.columnName + '(' + this.$t('miniApp.minAndMax', { 
        min: Math.round(this.inputData.valueList.min * 100) / 100, 
        max: Math.round(this.inputData.valueList.max  * 100) / 100
      }) + ')'
    },
    pickerOptions () {
      const vm = this
      return {
        disabledDate (time) {
          return time.getTime() > vm.inputData.datetimeInfo.end || time.getTime() < vm.inputData.datetimeInfo.start
        }
      }
    }
  },
  watch: {
    
  },
  mounted () {
    this.configInputData()
  },
  methods: {
    configInputData () {
      Promise.all([
        ...(this.columnInfo.statsType === 'NUMERIC' && [searchNumericColumnValueRange(this.modelId, this.columnInfo.columnId, {
          restrictions: this.restrictions.length > 0 ? this.restrictions : null 
        })]),
        ...((this.columnInfo.statsType === 'CATEGORY' || this.columnInfo.statsType === 'BOOLEAN') && [this.searchValue(this.columnInfo.columnId, '')]),
        searchColumnDefaultValue(this.modelId, this.columnInfo.columnId, {
          restrictions: this.restrictions
        })
      ])
        .then(([columnValueInfo, defaultValue]) => {
          this.handleColumnValue(columnValueInfo, defaultValue)
        })
        .catch(() => {
          this.$emit('failed')
        })
    },
    async handleColumnValue (columnInfo, defaultValue) {
      const inputData = {}
      inputData.statsType = this.columnInfo.statsType
      inputData.columnName = this.columnInfo.originalName

      if(inputData.statsType === 'CATEGORY' || inputData.statsType === 'BOOLEAN') {
        inputData.valueList = columnInfo.fuzzySearchResult
        inputData.valueList = inputData.valueList.map(element => ({
          value: element,
          name: element
        }))
        this.columnInfo.userInput.selectedList = []
      } else if (inputData.statsType === 'NUMERIC') {
        this.columnInfo.userInput = {
          ...this.columnInfo.userInput,
          ...columnInfo
        }
        this.inputData.valueList = columnInfo
      } 

      this.$emit('done')
      this.inputData = {
        ...this.inputData,
        ...inputData
      }
    },
    searchValue (columnId, searchString) {
      return dataValueSearch(columnId, {
        page: 0,
        searchString,
        size: 200,
        restrictions: this.restrictions.length > 0 ? this.restrictions : null
      })
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

  &__radio-group-container {
    width: 100%;
  }

  &__input-group-container {
    width: 100%;
    display: flex;
  }

  &__input {
    flex: 1 1 110px;
  }

  &__divider {
    width: 25px;
    text-align: center;
    line-height: 40px;
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