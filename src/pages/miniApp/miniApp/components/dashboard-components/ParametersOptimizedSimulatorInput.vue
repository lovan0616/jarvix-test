<template>
  <!--CATEGORY or BOOLEAN-->
  <div 
    v-if="inputData.statsType === 'CATEGORY' || inputData.statsType === 'BOOLEAN'" 
    class="input-field">
    <label class="input-field__label">{{ inputData.columnName }}</label>
    <div class="input-field__content-container">
      <div class="input-field__radio-group-container">
        <div
          v-for="(option, index) in categoryOptionList"
          :key="index"
          :class="{ 'disabled': disableInput }"
          class="input-radio-group"
        >
          <input
            :id="inputId + option.type"
            v-model="columnInfo.userInput.type"
            :name="inputId + inputData.columnName"
            :value="option.type"
            :disabled="disableInput"
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
          :is-disabled="isProcessing || disableInput"
          :name="'category' + inputData.columnName"
          filterable
          multiple
          class="input-field__multi-select"
          @input="columnInfo.userInput.selectedList = $event"
        />
        <div 
          v-show="errors.has('params-optimization.category' + inputData.columnName)"
          class="error-text"
        >{{ errors.first('params-optimization.category' + inputData.columnName) }}</div>
      </div>
      <div 
        v-if="disableInput" 
        class="input-field__reminder">{{ '*' + $t('miniApp.noResultUnderCurrentRestrictions') }}</div>
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
          :class="{ 'disabled': disableInput }"
          class="input-radio-group"
        >
          <input
            :id="inputId + option.type"
            v-model="columnInfo.userInput.type"
            :name="inputId + inputData.columnName"
            :value="option.type"
            :disabled="disableInput"
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
        <div 
          :class="{ 'disabled': disableInput }" 
          class="input-field__input">
          <input-verify
            v-validate="'required'"
            v-model.number="columnInfo.userInput.min"
            :validate-scope="'params-optimization'"
            :is-disabled="isProcessing || disableInput"
            :type="'text'"
            :name="'input-min-' + inputData.columnName"
          />
        </div>
        <template v-if="columnInfo.userInput.type === 'RANGE'">
          <div class="input-field__divider">
            -
          </div>
          <div 
            :class="{ 'disabled': disableInput }" 
            class="input-field__input" >
            <input-verify
              v-validate="'required'"
              v-model.number="columnInfo.userInput.max"
              :validate-scope="'params-optimization'"
              :is-disabled="isProcessing || disableInput"
              :type="'text'"
              :name="'input-max-' + inputData.columnName"
            />
          </div>
        </template>
      </div>
      <div 
        v-if="disableInput" 
        class="input-field__reminder">{{ '*' + $t('miniApp.noResultUnderCurrentRestrictions') }}</div>
    </div>
  </div>
  <!--DATETIME-->
  <div 
    v-else-if="inputData.statsType === 'DATETIME'" 
    class="input-field">
    <label class="input-field__label">{{ inputData.columnName }}</label>
    <div class="input-field__content-container">
      <div class="input-field__input-group-container">
        <el-date-picker
          v-validate="'required'"
          :disabled="isProcessing || disableInput"
          :value="dateTimeRange"
          :format="'yyyy-MM-dd HH:mm'"
          :picker-options="dateTimePickerOptions"
          :start-placeholder="$t('miniApp.startTime')"
          :end-placeholder="$t('miniApp.endTime')"
          :clearable="false"
          :class="{ 'has-error': errors.first(inputId + 'dateTimeRange') }"
          :name="[inputId + 'dateTimeRangeStart', inputId + 'dateTimeRangeEnd']"
          :editable="false"
          :value-format="'yyyy-MM-dd HH:mm'"
          size="small"
          type="datetimerange"
          @input="updateDateTimeRange"
        />
      </div>
      <div 
        v-show="!disableInput && errors.has('params-optimization.' + inputId + 'dateTimeRangeStart,' + inputId + 'dateTimeRangeEnd')"
        class="error-text"
      >{{ errors.first('params-optimization.' + inputId + 'dateTimeRangeStart,' + inputId + 'dateTimeRangeEnd') }}</div>
      <div 
        v-if="disableInput" 
        class="input-field__reminder">{{ '*' + $t('miniApp.noResultUnderCurrentRestrictions') }}</div>
    </div>
  </div>
</template>

<script>
import { dataValueSearch } from '@/API/DataSource'
import { searchNumericColumnValueRange } from '@/API/Model'
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
      ],
      startTime: null,
      endTime: null,
      isValidStartTime: true,
      isValidEndTime: true
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
    dateTimePickerOptions () {
      return {
        disabledDate: time => {
          // 如果預設值為今天中午，則今天也會被 disable 掉，因此往前剪一天
          return time.getTime() < this.startTime - 3600 * 1000 * 24 || time.getTime() > this.endTime
        }
      }
    },
    dateTimeRange () {
      if (!this.startTime && !this.endTime) return []
      return [this.columnInfo.userInput.start, this.columnInfo.userInput.end]
    },
    disableInput () {
      if (!this.inputData.statsType) return
      switch (this.inputData.statsType) {
        case 'NUMERIC': 
          return this.columnInfo.userInput.min === null || this.columnInfo.userInput.max === null
        case 'DATETIME':
          return this.columnInfo.userInput.start === null || this.columnInfo.userInput.end === null
        case 'CATEGORY':
        case 'BOOLEAN':
          return !this.inputData.valueList || this.inputData.valueList.length === 0
      }
    }
  },
  watch: {
    
  },
  mounted () {
    this.configInputData()
  },
  methods: {
    fetchInputColumnInfo(statsType) {
      switch (statsType) {
        case 'NUMERIC':
        case 'DATETIME':
          return searchNumericColumnValueRange(this.modelId, this.columnInfo.columnId, {
            restrictions: this.restrictions.length > 0 ? this.restrictions : null 
          })
        case 'CATEGORY':
        case 'BOOLEAN':
          return this.searchValue(this.columnInfo.columnId, '')
      }
    },
    configInputData () {
      this.fetchInputColumnInfo(this.columnInfo.statsType)
        .then(columnValueInfo => this.handleColumnValue(columnValueInfo))
        .catch(() => this.$emit('failed'))
    },
    async handleColumnValue (columnInfo) {
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
      } else if (inputData.statsType === 'NUMERIC' || this.columnInfo.statsType === 'DATETIME') {
        this.startTime = columnInfo.start
        this.endTime = columnInfo.end
        this.columnInfo.userInput = {
          ...this.columnInfo.userInput,
          ...columnInfo,
          start: columnInfo.start && this.customerTimeFormatter(columnInfo.start, 'MINUTE'),
          end: columnInfo.end && this.customerTimeFormatter(columnInfo.end, 'MINUTE')
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
    },
    updateDateTimeRange ([start, end]) {
      this.columnInfo.userInput.start = start
      this.columnInfo.userInput.end = end

      this.isValidStartTime =  start >= this.customerTimeFormatter(this.startTime, 'MINUTE')
      this.isValidEndTime =  end <= this.customerTimeFormatter(this.endime, 'MINUTE')
    },
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
    &.disabled {
      opacity: .5;
      /deep/ .error-text {
        visibility: hidden;
      }
    }
  }

  &__reminder {
    font-size: 12px;
    color: #FF5C46;
    margin-top: 9px;
  }

  &__divider,
  /deep/ .el-range-separator {
    width: 22px;
    text-align: center;
    line-height: 40px;
    padding: 0;
    color: #ffffff;
  }

  .input-radio-group {
    &:not(:last-of-type) {
      margin-right: 12px;
    }
    &.disabled {
      opacity: .5;
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

  /deep/ .el-input {
    width: 100%;
    &__prefix {
      display: none;
    }

    &__suffix {
      right: -3px;
    }

    &__inner {
      border: none;
      border-radius: 0;
      font-size: 16px;
      padding-left: 0;
      padding-right: 20px;
      background-color: transparent;
      color: $theme-text-color;
      height: 40px;
    }
  }

  /deep/ .el-date-editor--datetimerange.el-input__inner {
    width: auto;
    padding-right: 0;
  }

  /deep/ .el-range-editor.is-disabled .el-range-input {
    opacity: .5;
  }

  /deep/ .el-range-editor .el-range__icon {
    display: none;
  }

  /deep/ .el-range__close-icon {
    display: none;
  }

  /deep/ .el-range-input {
    width: 100px;
    background: transparent;
    padding: 0 !important;
    font-size: 16px;
    border-bottom: 1px solid #ffffff;
    border-radius: 0;
  }
}
</style>