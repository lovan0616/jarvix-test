<template>
  <!--CATEGORY or BOOLEAN-->
  <div 
    v-if="inputData.statsType === 'CATEGORY' || inputData.statsType === 'BOOLEAN'" 
    class="input-field">
    <label class="input-field__label">{{ inputData.columnName }}</label>
    <div class="input-field__input">
      <default-select 
        v-validate="'required'"
        :popper-append-to-body="true"
        :option-list="inputData.valueList"
        :placeholder="$t('miniApp.pleaseSelect')"
        :is-disabled="isProcessing"
        v-model="columnInfo.userInput"
        :name="inputId + '-' + inputData.columnName"
        filterable
        class="input-field__select"
      />
      <div 
        v-show="errors.has('simulator-' + simulatorId + '.' + inputId + '-' + inputData.columnName)"
        class="error-text"
      >{{ errors.first('simulator-' + simulatorId + '.' + inputId + '-' + inputData.columnName) }}</div>
      <div 
        v-if="isEmptyData" 
        class="input-field__reminder">{{ '*' + $t('miniApp.noResultCheckFilterAndDataSource') }}</div>
    </div>
  </div>
  <!--NUMERIC-->
  <div 
    v-else-if="inputData.statsType === 'NUMERIC'" 
    class="input-field">
    <label class="input-field__label">{{ getNumericTitle }}</label>
    <div class="input-field__input">
      <input-verify
        v-validate="'required|decimal'"
        v-model.number="columnInfo.userInput"
        :is-disabled="isProcessing"
        :name="inputId + '-' + inputData.columnName"
        :validate-scope="'simulator-' + simulatorId"
        type="text"
      />
      <div 
        v-if="isEmptyData" 
        class="input-field__reminder">{{ '*' + $t('miniApp.noResultCheckFilterAndDataSource') }}</div>
    </div>
  </div>
  <!-- DATETIME -->
  <div
    v-else-if="inputData.statsType === 'DATETIME'"
    class="input-field">
    <label class="input-field__label">{{ getDateTimeTitle }}</label>
    <div class="input-field__input">
      <el-date-picker
        v-validate="'required'"
        v-model="columnInfo.userInput"
        :name="inputId + '-' + 'dateTime'"
        :format="inputData.datetimeInfo.datePattern"
        :value-format="inputData.datetimeInfo.datePattern"
        :clearable="false"
        :picker-options="pickerOptions"
        :disabled="isProcessing || isEmptyData"
        :editable="false"
        type="datetime"
      />
      <div 
        v-show="errors.has('simulator-' + simulatorId + '.' + inputId + '-' + 'dateTime')"
        class="error-text"
      >{{ errors.first('simulator-' + simulatorId + '.' + inputId + '-' + 'dateTime') }}</div>
      <div 
        v-if="isEmptyData" 
        class="input-field__reminder">{{ '*' + $t('miniApp.noResultCheckFilterAndDataSource') }}</div>
    </div>
  </div>
</template>

<script>
import { dataValueSearch } from '@/API/DataSource'
import { searchColumnDefaultValue, searchNumericColumnValueRange } from '@/API/Model'
import DefaultSelect from '@/components/select/DefaultSelect'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import InputVerify from '@/components/InputVerify'
import { v4 as uuidv4 } from 'uuid'

export default {
  inject: ['$validator'],
  name: "SimulatorInput",
  components: {
    DefaultSelect,
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
    },
    simulatorId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      inputData: {},
      inputId: uuidv4()
    }
  },
  computed: {
    getNumericTitle () {
      if (!this.inputData.statsType || this.inputData.statsType !== 'NUMERIC') return
      if (this.isEmptyData) return this.inputData.columnName
      return this.inputData.columnName + '(' + this.$t('miniApp.minAndMax', { 
        min: Math.round(this.inputData.valueList.min * 100) / 100, 
        max: Math.round(this.inputData.valueList.max  * 100) / 100
      }) + ')'
    },
    getDateTimeTitle () {
      if (!this.inputData.statsType || this.inputData.statsType !== 'DATETIME') return
      if (this.isEmptyData) return this.inputData.columnName
      return this.inputData.columnName + '(' + this.$t('miniApp.range') + ':' + this.customerTimeFormatter(this.inputData.datetimeInfo.start, 'SECOND') + ' - ' + this.customerTimeFormatter(this.inputData.datetimeInfo.end, 'SECOND') + ')'
    },
    pickerOptions () {
      const vm = this
      return {
        disabledDate (time) {
          return time.getTime() > vm.inputData.datetimeInfo.end || time.getTime() < vm.inputData.datetimeInfo.start
        }
      }
    },
    isEmptyData () {
      if (!this.inputData.statsType) return false
      switch (this.inputData.statsType) {
        case 'NUMERIC': 
          return this.inputData.valueList.min === null || this.inputData.valueList.max === null
        case 'DATETIME':
          return this.inputData.datetimeInfo.start === null || this.inputData.datetimeInfo.end === null
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
    configInputData () {
      Promise.all([
        ...((this.columnInfo.statsType === 'NUMERIC' || this.columnInfo.statsType === 'DATETIME') && [searchNumericColumnValueRange(this.modelId, this.columnInfo.columnId, {
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
        this.columnInfo.userInput = defaultValue
      } else if (inputData.statsType === 'NUMERIC') {
        this.columnInfo.userInput = defaultValue
        this.inputData.valueList = columnInfo
      } else if (inputData.statsType === 'DATETIME') {
        this.columnInfo.userInput = defaultValue
        inputData.datetimeInfo = {
          start: columnInfo.start,
          end: columnInfo.end,
          datePattern: 'yyyy-MM-dd HH:mm:ss' // 目前後端給的 datePattern 沒有用到，前端先暫定這種
        }
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
  },

}
</script>

<style lang="scss" scoped>
.input-field {
  &__label {
    color: #AAAAAA;
    font-weight: 600;
    font-size: 14px;
  }

  &__reminder {
    font-size: 12px;
    color: #FFDF6F;
  }

  /deep/ .el-select-dropdown {
    width: 100%;
  }
  
  .el-input {
    width: 100%;
  }

  /deep/ .sy-select.theme-dark {
    .el-input__inner {
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
  }

  /deep/ .el-select {
    width: 100%;
  }

  /deep/ .input-verify .input-verify-text {
    margin-bottom: 0;
    color: #ffffff;
  }

  /deep/ .input-error.error-text {
    position: unset;
    bottom: -17px;
  }

  /deep/ .el-date-editor .el-input__inner {
    background-color: transparent;
    border-radius: 0;
    border-bottom: 1px solid #FFFFFF;
    font-size: 16px;
    padding: 0 !important; // 為了蓋掉 element-ui 樣式
  }
}
</style>